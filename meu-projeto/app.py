from flask import Flask, render_template, request, send_file, redirect, url_for
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from reportlab.pdfgen import canvas
import io, datetime
import os

app = Flask(__name__)

# Configurações para produção Locaweb
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'chave-secreta-padrao')

# Configurações de Email Locaweb
app.config['MAIL_SERVER'] = 'smtplw.com.br'  # Ou use o servidor da Locaweb
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'seu-email@seudominio.com.br')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'sua-senha')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'contato@cortinasbras.com.br')

mail = Mail(app)

# Banco de dados - usar MySQL na produção
if os.environ.get('PRODUCTION'):
    # Configuração para produção (MySQL)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql://usuario:senha@localhost/cortinas_db')
else:
    # Configuração para desenvolvimento
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leads.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80))
    telefone = db.Column(db.String(30))
    largura_parede = db.Column(db.Float)
    altura_parede = db.Column(db.Float)
    largura_janela = db.Column(db.Float)
    altura_janela = db.Column(db.Float)
    tecido = db.Column(db.String(30))
    instalacao = db.Column(db.String(30))
    observacoes = db.Column(db.Text)
    endereco = db.Column(db.Text)
    criado_em = db.Column(db.DateTime, default=datetime.datetime.utcnow)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    data = request.form
    try:
        lead = Lead(
            nome=data['nome'],
            telefone=data['telefone'],
            largura_parede=float(data.get('largura_parede', 0) or 0),
            altura_parede=float(data.get('altura_parede', 0) or 0),
            largura_janela=0.0,  # Campo não mais coletado, manter compatibilidade com DB
            altura_janela=0.0,   # Campo não mais coletado, manter compatibilidade com DB
            tecido=data.get('tecido', 'Não especificado'),
            instalacao=data.get('instalacao', 'Não especificado'),
            observacoes=data.get('mensagem', data.get('observacoes', '')),
            endereco=data.get('endereco', '')
        )
        db.session.add(lead)
        db.session.commit()

        # Criar PDF
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(50, 820, "Orçamento Cortinas Sob Medida")
        p.drawString(50, 800, f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}")
        p.drawString(50, 780, f"Nome: {lead.nome}")
        p.drawString(50, 760, f"Telefone: {lead.telefone}")
        p.drawString(50, 740, f"Medidas da Parede: {lead.largura_parede}m x {lead.altura_parede}m")
        p.drawString(50, 720, f"Tecido: {lead.tecido}")
        p.drawString(50, 700, f"Instalação: {lead.instalacao}")
        p.drawString(50, 680, f"Obs.: {lead.observacoes}")
        p.drawString(50, 660, f"Endereço: {lead.endereco}")
        p.save()
        buffer.seek(0)

        # Enviar email (apenas em produção)
        if os.environ.get('PRODUCTION'):
            try:
                msg = Message(
                    subject="Novo orçamento pelo site - Cortinas Brás",
                    recipients=['contato@cortinasbras.com.br']  # Email de destino
                )
                msg.body = f"""
                Novo lead de orçamento!
                
                Nome: {lead.nome}
                Telefone: {lead.telefone}
                Tecido: {lead.tecido}
                Instalação: {lead.instalacao}
                
                Medidas da Parede:
                - Largura: {lead.largura_parede}m
                - Altura: {lead.altura_parede}m
                
                Observações: {lead.observacoes}
                Endereço: {lead.endereco}
                
                Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}
                """
                msg.attach("orcamento.pdf", "application/pdf", buffer.read())
                mail.send(msg)
                print("✅ Email enviado com sucesso!")
            except Exception as email_error:
                app.logger.error(f"Falha ao enviar email: {email_error}")
                # Consider logging to a file or external service for better tracking

        return "success"
    
    except Exception as err:
        print(f"❌ Erro: {err}")
        return "Erro ao enviar!", 500

@app.route('/orcamento/<int:lead_id>/pdf')
def baixar_pdf(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(50, 820, "Orçamento Cortinas Sob Medida")
    p.drawString(50, 800, f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}")
    p.drawString(50, 780, f"Nome: {lead.nome}")
    p.drawString(50, 760, f"Telefone: {lead.telefone}")
    p.drawString(50, 740, f"Medidas da Parede: {lead.largura_parede}m x {lead.altura_parede}m")
    p.drawString(50, 720, f"Tecido: {lead.tecido}")
    p.drawString(50, 700, f"Instalação: {lead.instalacao}")
    p.drawString(50, 680, f"Obs.: {lead.observacoes}")
    p.drawString(50, 660, f"Endereço: {lead.endereco}")
    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='orcamento.pdf', mimetype='application/pdf')

@app.route('/admin/leads')
def admin_leads():
    leads = Lead.query.order_by(Lead.criado_em.desc()).all()
    return render_template('admin_leads.html', leads=leads)

def whatsapp_message(lead):
    msg = f"Olá {lead.nome}, recebemos sua solicitação de orçamento de cortinas.%0AEm breve entraremos em contato."
    return msg

app.jinja_env.globals.update(whatsapp_message=whatsapp_message)

# Configuração para produção
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # Em produção, use Gunicorn ou outro WSGI server
    app.run(debug=not os.environ.get('PRODUCTION'), port=5001)
