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

# Configurações de Email
app.config['MAIL_SERVER'] = 'mail.cronos-painel.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'loja@cortinasbras.com.br')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'sua-senha')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'loja@cortinasbras.com.br')

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

        # Criar PDF Profissional
        try:
            from pdf_generator import generate_orcamento_pdf
            buffer = generate_orcamento_pdf(lead)
            print("✅ PDF gerado com sucesso")
        except Exception as pdf_error:
            print(f"❌ Erro ao gerar PDF: {pdf_error}")
            import traceback
            traceback.print_exc()
            # Fallback para PDF simples se falhar
            buffer = io.BytesIO()
            p = canvas.Canvas(buffer)
            p.drawString(100, 750, f"Orçamento #{lead.id} - {lead.nome}")
            p.save()
            buffer.seek(0)

        # Enviar email (sempre tentar enviar)
        try:
            buffer.seek(0)  # Reset buffer position
            # Garantir que a hora esteja no timezone de São Paulo
            hora_sp = lead.criado_em.strftime('%d/%m/%Y às %H:%M')
            
            subject = f"🏠 Novo Orçamento - {lead.nome} - {hora_sp}"
            recipients = ['loja@cortinasbras.com.br']
            
            msg = Message(
                subject=subject,
                recipients=recipients,
                reply_to=lead.telefone if '@' in lead.telefone else None
            )
            
            # Template HTML
            msg.html = f"""
            <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background-color: #f5f5f5; margin: 0;">
                <div style="max-width: 650px; margin: 0 auto; background-color: white; padding: 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #D4A93E 0%, #8B5C2A 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                            🏠 Novo Orçamento de Cortinas
                        </h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                            Recebido em {lead.criado_em.strftime('%d/%m/%Y às %H:%M')}
                        </p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        
                        <!-- Dados do Cliente -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #D4A93E;">
                            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">👤</span> Dados do Cliente
                            </h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-weight: 600; width: 120px;">Nome:</td>
                                    <td style="padding: 8px 0; color: #333; font-size: 16px;"><strong>{lead.nome}</strong></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Telefone:</td>
                                    <td style="padding: 8px 0;">
                                        <a href="tel:{lead.telefone}" style="color: #D4A93E; text-decoration: none; font-weight: 600;">{lead.telefone}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-weight: 600;">WhatsApp:</td>
                                    <td style="padding: 8px 0;">
                                        <a href="https://wa.me/55{lead.telefone.replace('(','').replace(')','').replace('-','').replace(' ','')}" 
                                           style="display: inline-block; background-color: #25D366; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                                            💬 Enviar Mensagem
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- Medidas -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #fff9e6; border-radius: 8px; border-left: 4px solid #D4A93E;">
                            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📏</span> Medidas da Parede
                            </h2>
                            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                <div style="flex: 1; min-width: 200px;">
                                    <div style="background-color: white; padding: 15px; border-radius: 6px; text-align: center;">
                                        <div style="color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Largura</div>
                                        <div style="color: #D4A93E; font-size: 28px; font-weight: 700;">{lead.largura_parede}m</div>
                                    </div>
                                </div>
                                <div style="flex: 1; min-width: 200px;">
                                    <div style="background-color: white; padding: 15px; border-radius: 6px; text-align: center;">
                                        <div style="color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px;">Altura</div>
                                        <div style="color: #D4A93E; font-size: 28px; font-weight: 700;">{lead.altura_parede}m</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Especificações -->
                        <div style="margin-bottom: 25px; padding: 20px; background-color: #f0f8ff; border-radius: 8px; border-left: 4px solid #D4A93E;">
                            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">🎨</span> Especificações
                            </h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-weight: 600; width: 150px;">Tipo de Tecido:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 600; font-size: 15px;">{lead.tecido}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666; font-weight: 600;">Tipo de Instalação:</td>
                                    <td style="padding: 8px 0; color: #333; font-weight: 600; font-size: 15px;">{lead.instalacao}</td>
                                </tr>
                            </table>
                        </div>
                        
                        {f'''<div style="margin-bottom: 25px; padding: 20px; background-color: #fffbf0; border-radius: 8px; border-left: 4px solid #D4A93E;">
                            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 18px; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📝</span> Observações
                            </h2>
                            <p style="color: #555; line-height: 1.6; margin: 0; white-space: pre-wrap;">{lead.observacoes}</p>
                        </div>''' if lead.observacoes else ''}
                        
                        {f'''<div style="margin-bottom: 25px; padding: 20px; background-color: #f0fff4; border-radius: 8px; border-left: 4px solid #D4A93E;">
                            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 18px; display: flex; align-items: center;">
                                <span style="margin-right: 8px;">📍</span> Endereço para Instalação
                            </h2>
                            <p style="color: #555; line-height: 1.6; margin: 0; white-space: pre-wrap;">{lead.endereco}</p>
                        </div>''' if lead.endereco else ''}
                        
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f9f9f9; padding: 20px 30px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                            ID do Lead: <strong>#{lead.id}</strong> | 
                            Cortinas Brás - Qualidade há mais de 20 anos
                        </p>
                    </div>
                    
                </div>
            </body>
            </html>
            """
            
            # Anexar PDF
            filename = f"orcamento_{lead.id}_{lead.nome.split()[0]}.pdf"
            msg.attach(filename, "application/pdf", buffer.read())
            
            # Enviar
            mail.send(msg)
            print(f"✅ Email enviado para {recipients} (Lead #{lead.id})")
            
        except Exception as email_error:
            app.logger.error(f"❌ Falha ao enviar email: {email_error}")
            print(f"❌ Erro ao enviar email: {email_error}")
            import traceback
            traceback.print_exc()

        return "success"
    
    except Exception as err:
        print(f"❌ Erro geral no endpoint /enviar: {err}")
        import traceback
        traceback.print_exc()
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
@app.route('/test-email')
def test_email_route():
    recipient = request.args.get('to', 'loja@cortinasbras.com.br')
    try:
        msg = Message(
            subject="Teste Diagnóstico",
            recipients=[recipient],
            body=f"Teste de envio para {recipient}"
        )
        mail.send(msg)
        return f"Email enviado para {recipient} com sucesso!"
    except Exception as e:
        return f"Erro ao enviar para {recipient}: {str(e)}", 500

@app.route('/test-email-pdf')
def test_email_pdf_route():
    try:
        # Gerar PDF de teste
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 750, "PDF de Teste de Diagnóstico")
        p.save()
        buffer.seek(0)
        
        msg = Message(
            subject="Teste Manual de Rota (COM Anexo)",
            recipients=['loja@cortinasbras.com.br'],
            body="Teste de envio direto pela rota /test-email-pdf COM anexo PDF."
        )
        msg.attach("teste.pdf", "application/pdf", buffer.read())
        
        mail.send(msg)
        return "Email COM anexo enviado com sucesso!"
    except Exception as e:
        return f"Erro ao enviar email com anexo: {str(e)}", 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # Em produção, use Gunicorn ou outro WSGI server
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', debug=not os.environ.get('PRODUCTION'), port=port)
