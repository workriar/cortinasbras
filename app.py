
from __future__ import annotations

import datetime as dt
import io
import os
from flask import Flask, current_app, render_template, request, send_file
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from reportlab.pdfgen import canvas

db = SQLAlchemy()
mail = Mail()

def create_app() -> Flask:
    app = Flask(__name__, template_folder="frontend")
    ...


    configure_app(app)
    db.init_app(app)
    mail.init_app(app)

    register_routes(app)

    with app.app_context():
        db.create_all()

    return app

def configure_app(app: Flask) -> None:
    """Configure Flask, database and mail settings based on environment."""
    production = str(os.environ.get("PRODUCTION", "")).lower() in {"1", "true", "on", "yes"}

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "chave-secreta-padrao")

    database_uri = os.environ.get("DATABASE_URL")
    if not database_uri:
        database_uri = "sqlite:///leads.db"
    elif database_uri.startswith("mysql://"):
        # sqlalchemy 2.x requires the driver name explicit
        database_uri = database_uri.replace("mysql://", "mysql+pymysql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config.update(
        MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtplw.com.br"),
        MAIL_PORT=int(os.environ.get("MAIL_PORT", "587")),
        MAIL_USE_TLS=str(os.environ.get("MAIL_USE_TLS", "true")).lower() in {"1", "true", "on"},
        MAIL_USERNAME=os.environ.get("MAIL_USERNAME"),
        MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD"),
        MAIL_DEFAULT_SENDER=os.environ.get("MAIL_DEFAULT_SENDER", "contato@cortinasbras.com.br"),
        MAIL_SUPPRESS_SEND=not production,
    )

    app.config["APP_PRODUCTION"] = production

class Lead(db.Model):  # type: ignore[misc]
    __tablename__ = "leads"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    telefone = db.Column(db.String(30), nullable=False)
    largura_parede = db.Column(db.Float, nullable=False)
    altura_parede = db.Column(db.Float, nullable=False)
    largura_janela = db.Column(db.Float, nullable=False)
    altura_janela = db.Column(db.Float, nullable=False)
    tecido = db.Column(db.String(30), nullable=False)
    instalacao = db.Column(db.String(30), nullable=False)
    observacoes = db.Column(db.Text, default="")
    endereco = db.Column(db.Text, default="")
    criado_em = db.Column(db.DateTime, default=dt.datetime.utcnow, nullable=False)

def register_routes(app: Flask) -> None:
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/enviar", methods=["POST"])
    def enviar():
        data = request.form

        try:
            lead = Lead(
                nome=_required(data.get("nome"), "Nome"),
                telefone=_required(data.get("telefone"), "Telefone"),
                largura_parede=_parse_float(data.get("parede"), "Largura da parede"),
                altura_parede=_parse_float(data.get("altura_parede"), "Altura da parede"),
                largura_janela=_parse_float(data.get("janela_largura"), "Largura da janela"),
                altura_janela=_parse_float(data.get("janela_altura"), "Altura da janela"),
                tecido=_required(data.get("tecido"), "Tipo de tecido"),
                instalacao=_required(data.get("instalacao"), "Tipo de instalação"),
                observacoes=(data.get("observacoes") or "").strip(),
                endereco=(data.get("endereco") or "").strip(),
            )
        except ValueError as exc:
            current_app.logger.warning("Validation error: %s", exc)
            return f"Erro: {exc}", 400

        try:
            db.session.add(lead)
            db.session.commit()
        except Exception as exc:  # pragma: no cover - defensive
            db.session.rollback()
            current_app.logger.exception("Erro ao salvar lead")
            return "Erro ao processar solicitação!", 500

        pdf_bytes = _build_lead_pdf(lead)

        if current_app.config["APP_PRODUCTION"]:
            try:
                _send_notification_email(lead, pdf_bytes)
            except Exception as exc:  # pragma: no cover - envio de email não deve derrubar o fluxo
                current_app.logger.exception("Falha ao enviar e-mail: %s", exc)

        return "success"

    @app.route("/orcamento/<int:lead_id>/pdf")
    def baixar_pdf(lead_id: int):
        lead = Lead.query.get_or_404(lead_id)
        pdf_bytes = _build_lead_pdf(lead)
        buffer = io.BytesIO(pdf_bytes)
        return send_file(buffer, as_attachment=True, download_name="orcamento.pdf", mimetype="application/pdf")

    @app.route("/admin/leads")
    def admin_leads():
        leads = Lead.query.order_by(Lead.criado_em.desc()).all()
        return render_template("admin_leads.html", leads=leads)

def _required(value: str | None, field_name: str) -> str:
    if not value or not value.strip():
        raise ValueError(f"{field_name} é obrigatório.")
    return value.strip()

def _parse_float(value: str | None, field_name: str) -> float:
    cleaned = _required(value, field_name)
    cleaned = cleaned.replace(",", ".")
    try:
        return float(cleaned)
    except ValueError as exc:
        raise ValueError(f"{field_name} deve ser um número válido.") from exc

def _build_lead_pdf(lead: Lead) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)

    pdf.drawString(50, 820, "Orçamento Cortinas Sob Medida")
    pdf.drawString(50, 800, f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}")
    pdf.drawString(50, 780, f"Nome: {lead.nome}")
    pdf.drawString(50, 760, f"Telefone: {lead.telefone}")
    pdf.drawString(50, 740, f"Parede: {lead.largura_parede:.2f}m x {lead.altura_parede:.2f}m")
    pdf.drawString(50, 720, f"Janela: {lead.largura_janela:.2f}m x {lead.altura_janela:.2f}m")
    pdf.drawString(50, 700, f"Tecido: {lead.tecido}")
    pdf.drawString(50, 680, f"Instalação: {lead.instalacao}")
    pdf.drawString(50, 660, f"Obs.: {lead.observacoes or '-'}")
    pdf.drawString(50, 640, f"Endereço: {lead.endereco or '-'}")

    pdf.save()
    buffer.seek(0)
    return buffer.getvalue()

def _send_notification_email(lead: Lead, pdf_bytes: bytes) -> None:
    msg = Message(
        subject="Novo orçamento pelo site - Cortinas Brás",
        recipients=[os.environ.get("MAIL_NOTIFICATION_TO", "contato@cortinasbras.com.br")],
    )
    msg.body = (
        "Novo lead de orçamento!\n\n"
        f"Nome: {lead.nome}\n"
        f"Telefone: {lead.telefone}\n"
        f"Tecido: {lead.tecido}\n"
        f"Instalação: {lead.instalacao}\n\n"
        "Dimensões:\n"
        f"- Parede: {lead.largura_parede:.2f}m x {lead.altura_parede:.2f}m\n"
        f"- Janela: {lead.largura_janela:.2f}m x {lead.altura_janela:.2f}m\n\n"
        f"Observações: {lead.observacoes or '-'}\n"
        f"Endereço: {lead.endereco or '-'}\n\n"
        f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}\n"
    )
    msg.attach("orcamento.pdf", "application/pdf", pdf_bytes)
    mail.send(msg)

app = create_app()

def whatsapp_message(lead: Lead) -> str:
    return (
        f"Olá {lead.nome}, recebemos sua solicitação de orçamento de cortinas.%0A"
        "Em breve entraremos em contato."
    )

app.jinja_env.globals.update(whatsapp_message=whatsapp_message)
from __future__ import annotations

import datetime as dt
import io
import os
from flask import Flask, current_app, render_template, request, send_file
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from reportlab.pdfgen import canvas

db = SQLAlchemy()
mail = Mail()

def create_app() -> Flask:
    app = Flask(__name__)

    configure_app(app)
    db.init_app(app)
    mail.init_app(app)

    register_routes(app)

    with app.app_context():
        db.create_all()

    return app

def configure_app(app: Flask) -> None:
    """Configure Flask, database and mail settings based on environment."""
    production = str(os.environ.get("PRODUCTION", "")).lower() in {"1", "true", "on", "yes"}

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "chave-secreta-padrao")

    database_uri = os.environ.get("DATABASE_URL")
    if not database_uri:
        database_uri = "sqlite:///leads.db"
    elif database_uri.startswith("mysql://"):
        # sqlalchemy 2.x requires the driver name explicit
        database_uri = database_uri.replace("mysql://", "mysql+pymysql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config.update(
        MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtplw.com.br"),
        MAIL_PORT=int(os.environ.get("MAIL_PORT", "587")),
        MAIL_USE_TLS=str(os.environ.get("MAIL_USE_TLS", "true")).lower() in {"1", "true", "on"},
        MAIL_USERNAME=os.environ.get("MAIL_USERNAME"),
        MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD"),
        MAIL_DEFAULT_SENDER=os.environ.get("MAIL_DEFAULT_SENDER", "contato@cortinasbras.com.br"),
        MAIL_SUPPRESS_SEND=not production,
    )

    app.config["APP_PRODUCTION"] = production

class Lead(db.Model):  # type: ignore[misc]
    __tablename__ = "leads"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    telefone = db.Column(db.String(30), nullable=False)
    largura_parede = db.Column(db.Float, nullable=False)
    altura_parede = db.Column(db.Float, nullable=False)
    largura_janela = db.Column(db.Float, nullable=False)
    altura_janela = db.Column(db.Float, nullable=False)
    tecido = db.Column(db.String(30), nullable=False)
    instalacao = db.Column(db.String(30), nullable=False)
    observacoes = db.Column(db.Text, default="")
    endereco = db.Column(db.Text, default="")
    criado_em = db.Column(db.DateTime, default=dt.datetime.utcnow, nullable=False)

def register_routes(app: Flask) -> None:
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/enviar", methods=["POST"])
    def enviar():
        data = request.form

        try:
            lead = Lead(
                nome=_required(data.get("nome"), "Nome"),
                telefone=_required(data.get("telefone"), "Telefone"),
                largura_parede=_parse_float(data.get("parede"), "Largura da parede"),
                altura_parede=_parse_float(data.get("altura_parede"), "Altura da parede"),
                largura_janela=_parse_float(data.get("janela_largura"), "Largura da janela"),
                altura_janela=_parse_float(data.get("janela_altura"), "Altura da janela"),
                tecido=_required(data.get("tecido"), "Tipo de tecido"),
                instalacao=_required(data.get("instalacao"), "Tipo de instalação"),
                observacoes=(data.get("observacoes") or "").strip(),
                endereco=(data.get("endereco") or "").strip(),
            )
        except ValueError as exc:
            current_app.logger.warning("Validation error: %s", exc)
            return f"Erro: {exc}", 400

        try:
            db.session.add(lead)
            db.session.commit()
        except Exception as exc:  # pragma: no cover - defensive
            db.session.rollback()
            current_app.logger.exception("Erro ao salvar lead")
            return "Erro ao processar solicitação!", 500

        pdf_bytes = _build_lead_pdf(lead)

        if current_app.config["APP_PRODUCTION"]:
            try:
                _send_notification_email(lead, pdf_bytes)
            except Exception as exc:  # pragma: no cover - envio de email não deve derrubar o fluxo
                current_app.logger.exception("Falha ao enviar e-mail: %s", exc)

        return "success"

    @app.route("/orcamento/<int:lead_id>/pdf")
    def baixar_pdf(lead_id: int):
        lead = Lead.query.get_or_404(lead_id)
        pdf_bytes = _build_lead_pdf(lead)
        buffer = io.BytesIO(pdf_bytes)
        return send_file(buffer, as_attachment=True, download_name="orcamento.pdf", mimetype="application/pdf")

    @app.route("/admin/leads")
    def admin_leads():
        leads = Lead.query.order_by(Lead.criado_em.desc()).all()
        return render_template("admin_leads.html", leads=leads)

def _required(value: str | None, field_name: str) -> str:
    if not value or not value.strip():
        raise ValueError(f"{field_name} é obrigatório.")
    return value.strip()

def _parse_float(value: str | None, field_name: str) -> float:
    cleaned = _required(value, field_name)
    cleaned = cleaned.replace(",", ".")
    try:
        return float(cleaned)
    except ValueError as exc:
        raise ValueError(f"{field_name} deve ser um número válido.") from exc

def _build_lead_pdf(lead: Lead) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)

    pdf.drawString(50, 820, "Orçamento Cortinas Sob Medida")
    pdf.drawString(50, 800, f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}")
    pdf.drawString(50, 780, f"Nome: {lead.nome}")
    pdf.drawString(50, 760, f"Telefone: {lead.telefone}")
    pdf.drawString(50, 740, f"Parede: {lead.largura_parede:.2f}m x {lead.altura_parede:.2f}m")
    pdf.drawString(50, 720, f"Janela: {lead.largura_janela:.2f}m x {lead.altura_janela:.2f}m")
    pdf.drawString(50, 700, f"Tecido: {lead.tecido}")
    pdf.drawString(50, 680, f"Instalação: {lead.instalacao}")
    pdf.drawString(50, 660, f"Obs.: {lead.observacoes or '-'}")
    pdf.drawString(50, 640, f"Endereço: {lead.endereco or '-'}")

    pdf.save()
    buffer.seek(0)
    return buffer.getvalue()

def _send_notification_email(lead: Lead, pdf_bytes: bytes) -> None:
    msg = Message(
        subject="Novo orçamento pelo site - Cortinas Brás",
        recipients=[os.environ.get("MAIL_NOTIFICATION_TO", "contato@cortinasbras.com.br")],
    )
    msg.body = (
        "Novo lead de orçamento!\n\n"
        f"Nome: {lead.nome}\n"
        f"Telefone: {lead.telefone}\n"
        f"Tecido: {lead.tecido}\n"
        f"Instalação: {lead.instalacao}\n\n"
        "Dimensões:\n"
        f"- Parede: {lead.largura_parede:.2f}m x {lead.altura_parede:.2f}m\n"
        f"- Janela: {lead.largura_janela:.2f}m x {lead.altura_janela:.2f}m\n\n"
        f"Observações: {lead.observacoes or '-'}\n"
        f"Endereço: {lead.endereco or '-'}\n\n"
        f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}\n"
    )
    msg.attach("orcamento.pdf", "application/pdf", pdf_bytes)
    mail.send(msg)

app = create_app()

def whatsapp_message(lead: Lead) -> str:
    return (
        f"Olá {lead.nome}, recebemos sua solicitação de orçamento de cortinas.%0A"
        "Em breve entraremos em contato."
    )

app.jinja_env.globals.update(whatsapp_message=whatsapp_message)
