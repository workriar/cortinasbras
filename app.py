from flask import Flask, render_template, request, send_file, redirect, url_for
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from reportlab.pdfgen import canvas
import io, datetime
import os
from datetime import timezone
import pytz

# Timezone de São Paulo
SP_TZ = pytz.timezone('America/Sao_Paulo')

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
    criado_em = db.Column(db.DateTime, default=lambda: datetime.datetime.now(SP_TZ))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/robots.txt')
def robots():
    """Robots.txt para SEO"""
    robots_txt = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /orcamento/

Sitemap: https://www.cortinasbras.com.br/sitemap.xml
"""
    return robots_txt, 200, {'Content-Type': 'text/plain; charset=utf-8'}

@app.route('/sitemap.xml')
def sitemap():
    """Sitemap XML para SEO"""
    from datetime import datetime
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.cortinasbras.com.br/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.cortinasbras.com.br/#produtos</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.cortinasbras.com.br/#sobre</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.cortinasbras.com.br/#contato</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>"""
    return sitemap_xml, 200, {'Content-Type': 'application/xml; charset=utf-8'}

@app.route('/enviar', methods=['POST'])
def enviar():
    data = request.form
    try:
        lead = Lead(
            nome=data['nome'],
            telefone=data['telefone'],
            largura_parede=float(data.get('largura_parede', 0) or 0),
            altura_parede=float(data.get('altura_parede', 0) or 0),
            largura_janela=float(data.get('largura_janela', 0) or 0),
            altura_janela=float(data.get('altura_janela', 0) or 0),
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
        p.drawString(50, 740, f"Parede: {lead.largura_parede}m x {lead.altura_parede}m")
        p.drawString(50, 720, f"Janela: {lead.largura_janela}m x {lead.altura_janela}m")
        p.drawString(50, 700, f"Tecido: {lead.tecido}")
        p.drawString(50, 680, f"Instalação: {lead.instalacao}")
        p.drawString(50, 660, f"Obs.: {lead.observacoes}")
        p.drawString(50, 640, f"Endereço: {lead.endereco}")
        p.save()
        buffer.seek(0)

        # Enviar email (sempre tentar enviar)
        try:
            buffer.seek(0)  # Reset buffer position
            # Garantir que a hora esteja no timezone de São Paulo
            hora_sp = lead.criado_em.strftime('%d/%m/%Y às %H:%M')
            msg = Message(
                subject=f"🏠 Novo Orçamento - {lead.nome} - {hora_sp}",
                recipients=['loja@cortinasbras.com.br'],
                reply_to=lead.telefone if '@' in lead.telefone else None
            )
            msg.html = f"""
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #D4A93E; border-bottom: 2px solid #D4A93E; padding-bottom: 10px;">
                        🏠 Novo Orçamento de Cortinas
                    </h2>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #333; margin-bottom: 15px;">👤 Dados do Cliente</h3>
                        <p><strong>Nome:</strong> {lead.nome}</p>
                        <p><strong>Telefone:</strong> <a href="tel:{lead.telefone}">{lead.telefone}</a></p>
                        <p><strong>WhatsApp:</strong> <a href="https://wa.me/55{lead.telefone.replace('(','').replace(')','').replace('-','').replace(' ','')}">Enviar mensagem</a></p>
                    </div>
                    
                    <div style="margin: 20px 0; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                        <h3 style="color: #333; margin-bottom: 15px;">📏 Medidas</h3>
                        <p><strong>Parede:</strong> {lead.largura_parede}m (largura) × {lead.altura_parede}m (altura)</p>
                        <p><strong>Janela:</strong> {lead.largura_janela}m (largura) × {lead.altura_janela}m (altura)</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h3 style="color: #333; margin-bottom: 15px;">🎨 Especificações</h3>
                        <p><strong>Tecido:</strong> {lead.tecido}</p>
                        <p><strong>Tipo de Instalação:</strong> {lead.instalacao}</p>
                    </div>
                    
                    {f'<div style="margin: 20px 0; background-color: #fff9e6; padding: 15px; border-left: 3px solid #D4A93E;"><h3 style="color: #333; margin-bottom: 10px;">📝 Observações</h3><p>{lead.observacoes}</p></div>' if lead.observacoes else ''}
                    
                    {f'<div style="margin: 20px 0;"><h3 style="color: #333; margin-bottom: 10px;">📍 Endereço para Instalação</h3><p>{lead.endereco}</p></div>' if lead.endereco else ''}
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                        <p>Orçamento recebido em: {lead.criado_em.strftime('%d/%m/%Y às %H:%M')}</p>
                        <p>ID do Lead: #{lead.id}</p>
                    </div>
                </div>
            </body>
            </html>
            """
            msg.attach("orcamento.pdf", "application/pdf", buffer.read())
            mail.send(msg)
            print(f"✅ Email enviado para loja@cortinasbras.com.br (Lead #{lead.id})")
        except Exception as email_error:
            app.logger.error(f"❌ Falha ao enviar email: {email_error}")
            print(f"❌ Erro ao enviar email: {email_error}")

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
    p.drawString(50, 740, f"Parede: {lead.largura_parede}m x {lead.altura_parede}m")
    p.drawString(50, 720, f"Janela: {lead.largura_janela}m x {lead.altura_janela}m")
    p.drawString(50, 700, f"Tecido: {lead.tecido}")
    p.drawString(50, 680, f"Instalação: {lead.instalacao}")
    p.drawString(50, 660, f"Obs.: {lead.observacoes}")
    p.drawString(50, 640, f"Endereço: {lead.endereco}")
    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='orcamento.pdf', mimetype='application/pdf')

@app.route('/admin/leads')
def admin_leads():
    leads = Lead.query.order_by(Lead.criado_em.desc()).all()
    return render_template('admin_leads.html', leads=leads)

@app.route('/admin/leads/export-pdf')
def export_leads_pdf():
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    
    leads = Lead.query.order_by(Lead.criado_em.desc()).all()
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Título
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#D4A93E'),
        spaceAfter=30,
        alignment=1  # Center
    )
    elements.append(Paragraph("Dashboard de Leads - Cortinas Brás", title_style))
    elements.append(Paragraph(f"Gerado em: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 0.5*inch))
    
    # Estatísticas
    total_leads = len(leads)
    elements.append(Paragraph(f"<b>Total de Leads:</b> {total_leads}", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Tabela de leads
    data = [['ID', 'Nome', 'Telefone', 'Tecido', 'Instalação', 'Data']]
    
    for lead in leads:
        data.append([
            str(lead.id),
            lead.nome[:20],
            lead.telefone,
            lead.tecido[:15],
            lead.instalacao[:15],
            lead.criado_em.strftime('%d/%m/%y')
        ])
    
    table = Table(data, colWidths=[0.5*inch, 1.5*inch, 1.3*inch, 1.2*inch, 1.2*inch, 0.8*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D4A93E')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8F5F1')])
    ]))
    
    elements.append(table)
    
    # Detalhes dos leads (últimos 5)
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("<b>Últimos 5 Leads (Detalhado):</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    for lead in leads[:5]:
        elements.append(Paragraph(f"<b>#{lead.id} - {lead.nome}</b>", styles['Heading3']))
        detail_text = f"""
        Telefone: {lead.telefone}<br/>
        Parede: {lead.largura_parede}m × {lead.altura_parede}m<br/>
        Janela: {lead.largura_janela}m × {lead.altura_janela}m<br/>
        Tecido: {lead.tecido} | Instalação: {lead.instalacao}<br/>
        {f'Observações: {lead.observacoes}<br/>' if lead.observacoes else ''}
        {f'Endereço: {lead.endereco}<br/>' if lead.endereco else ''}
        Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}
        """
        elements.append(Paragraph(detail_text, styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
    
    doc.build(elements)
    buffer.seek(0)
    
    filename = f"leads_cortinas_bras_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return send_file(buffer, as_attachment=True, download_name=filename, mimetype='application/pdf')

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
