from flask import Flask, render_template, request, send_file, redirect, url_for, jsonify
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from reportlab.pdfgen import canvas
from dotenv import load_dotenv
from reportlab.lib.pagesizes import A4
import io, datetime
import os
from datetime import timezone
import pytz

# Timezone de São Paulo
SP_TZ = pytz.timezone('America/Sao_Paulo')

app = Flask(__name__)
load_dotenv()

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
        # Helper para converter float
        def parse_float(val):
            if not val: return 0.0
            if isinstance(val, (float, int)): return float(val)
            try:
                return float(str(val).replace(',', '.'))
            except ValueError:
                return 0.0

        lead = Lead(
            nome=data.get('nome', 'Sem Nome'),
            telefone=data.get('telefone', 'Sem Telefone'),
            largura_parede=parse_float(data.get('largura_parede', 0)),
            altura_parede=parse_float(data.get('altura_parede', 0)),
            largura_janela=parse_float(data.get('largura_janela', 0)),
            altura_janela=parse_float(data.get('altura_janela', 0)),
            tecido=data.get('tecido', 'Não especificado'),
            instalacao=data.get('instalacao', 'Não especificado'),
            observacoes=data.get('observacoes', ''),
            endereco=''
        )
        db.session.add(lead)
        db.session.commit()
        
        print(f"✅ Lead #{lead.id} salvo no banco.")

        # Criar PDF Profissional
        pdf_buffer = None
        try:
            from pdf_generator import generate_orcamento_pdf
            pdf_buffer = generate_orcamento_pdf(lead)
            print("✅ PDF gerado com sucesso")
            
            # Salvar PDF na pasta 'orcamentos' para backup
            try:
                if pdf_buffer:
                    pdf_content = pdf_buffer.getvalue()
                    pdf_dir = os.path.join(os.getcwd(), 'orcamentos')
                    os.makedirs(pdf_dir, exist_ok=True)
                    pdf_filename = f"orcamento_{lead.id}.pdf"
                    with open(os.path.join(pdf_dir, pdf_filename), 'wb') as f:
                        f.write(pdf_content)
                    print(f"✅ PDF salvo localmente: {pdf_filename}")
            except Exception as e:
                print(f"⚠️ Erro ao salvar PDF localmente (não crítico): {e}")

        except Exception as pdf_error:
            print(f"❌ Erro ao gerar PDF: {pdf_error}")
            import traceback
            traceback.print_exc()

        # Enviar email
        email_sent = False
        try:
            # Assunto com emoji para destaque
            subject = f"🏠 Novo Orçamento #{lead.id} - {lead.nome}"
            recipients = ['loja@cortinasbras.com.br']
            
            msg = Message(
                subject=subject,
                recipients=recipients,
                reply_to=lead.telefone if '@' in lead.telefone else 'noreply@cortinasbras.com.br'
            )
            
            # Hora formatada
            hora_sp = lead.criado_em.strftime('%d/%m/%Y às %H:%M')

            # Template HTML do Email
            msg.html = f"""
            <html>
            <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background-color: #D4A93E; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Novo Lead Recebido</h1>
                        <p style="color: #ffffff; margin: 5px 0 0; opacity: 0.9;">{hora_sp}</p>
                    </div>

                    <!-- Conteúdo -->
                    <div style="padding: 30px;">
                        <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                            <h2 style="color: #333; font-size: 18px; margin-top: 0;">👤 Dados do Cliente</h2>
                            <p style="margin: 5px 0;"><strong>Nome:</strong> {lead.nome}</p>
                            <p style="margin: 5px 0;"><strong>Telefone:</strong> <a href="tel:{lead.telefone}" style="color: #D4A93E; text-decoration: none;">{lead.telefone}</a></p>
                            
                            <div style="margin-top: 15px;">
                                <a href="https://wa.me/55{lead.telefone.replace('(','').replace(')','').replace('-','').replace(' ','')}" 
                                   style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                   Iniciar Conversa no WhatsApp
                                </a>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                            <h2 style="color: #333; font-size: 18px; margin-top: 0;">📏 Medidas e Detalhes</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Parede:</td>
                                    <td style="padding: 8px 0; font-weight: bold;">{lead.largura_parede}m (L) x {lead.altura_parede}m (A)</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Tecido:</td>
                                    <td style="padding: 8px 0; font-weight: bold;">{lead.tecido}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #666;">Instalação:</td>
                                    <td style="padding: 8px 0; font-weight: bold;">{lead.instalacao}</td>
                                </tr>
                            </table>
                        </div>

                        {f'''<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                            <h3 style="margin: 0 0 10px; font-size: 16px; color: #555;">Observações:</h3>
                            <p style="margin: 0; color: #333; font-style: italic;">"{lead.observacoes}"</p>
                        </div>''' if lead.observacoes else ''}
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #333; padding: 15px; text-align: center; color: #999; font-size: 12px;">
                        <p style="margin: 0;">Lead ID: #{lead.id}</p>
                        <p style="margin: 5px 0 0;">Cortinas Brás - Sistema Automático</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Anexar PDF se gerado com sucesso
            if pdf_buffer:
                pdf_buffer.seek(0)
                filename = f"Orcamento_{lead.nome.split()[0]}_{lead.id}.pdf"
                msg.attach(filename, "application/pdf", pdf_buffer.read())
            
            mail.send(msg)
            email_sent = True
            print(f"✅ Email enviado com sucesso para {recipients}")
            
        except Exception as email_error:
            print(f"❌ ERRO CRÍTICO AO ENVIAR EMAIL: {email_error}")
            import traceback
            traceback.print_exc()
            # Não falhar a requisição se o email falhar, priorizar salvar o lead

        # Gerar link do WhatsApp para retorno
        wa_text = f"Olá {lead.nome}, recebi seu orçamento de cortinas (ID #{lead.id}).\n\n*Medidas:* {lead.largura_parede}m x {lead.altura_parede}m\n*Tecido:* {lead.tecido}\n*Instalação:* {lead.instalacao}\n\nPodemos continuar o atendimento?"
        wa_url = f"https://wa.me/55{lead.telefone.replace('(','').replace(')','').replace('-','').replace(' ','')}?text={wa_text}"

        return jsonify({
            "status": "success", 
            "message": "Lead salvo com sucesso",
            "email_sent": email_sent,
            "whatsapp_url": wa_url,
            "lead_id": lead.id
        }), 200
    
    except Exception as err:
        print(f"❌ Erro geral no endpoint /enviar: {err}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(err)}), 500

@app.route('/orcamento/<int:lead_id>/pdf')
def baixar_pdf(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Logo Centralizado
    logo_path = os.path.join(app.static_folder, 'logo.png')
    if os.path.exists(logo_path):
        p.drawImage(logo_path, width/2 - 50, height - 100, width=100, height=50, preserveAspectRatio=True, mask='auto')

    p.setFont("Helvetica-Bold", 16)
    p.drawCentredString(width/2, height - 130, "Orçamento Cortinas Sob Medida")
    
    p.setFont("Helvetica", 12)
    y = height - 160
    p.drawString(50, y, f"Data: {lead.criado_em.strftime('%d/%m/%Y %H:%M')}")
    y -= 25
    p.drawString(50, y, f"Nome: {lead.nome}")
    y -= 20
    p.drawString(50, y, f"Telefone: {lead.telefone}")
    y -= 20
    p.drawString(50, y, f"Parede: {lead.largura_parede}m x {lead.altura_parede}m")
    y -= 20
    if lead.largura_janela or lead.altura_janela:
        p.drawString(50, y, f"Janela: {lead.largura_janela}m x {lead.altura_janela}m")
        y -= 20
    p.drawString(50, y, f"Tecido: {lead.tecido}")
    y -= 20
    p.drawString(50, y, f"Instalação: {lead.instalacao}")
    y -= 20
    p.drawString(50, y, f"Obs.: {lead.observacoes}")
    y -= 20

    
    p.save()
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='orcamento.pdf', mimetype='application/pdf')

@app.route('/admin/leads')
def admin_leads():
    leads = Lead.query.order_by(Lead.criado_em.desc()).all()
    
    # Estatísticas
    import datetime
    now = datetime.datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    stats = {
        'total': len(leads),
        'today': len([l for l in leads if l.criado_em >= today_start])
    }
    
    return render_template('admin_leads.html', leads=leads, stats=stats)

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
# Garantir que as tabelas existam (mesmo rodando via Gunicorn)
with app.app_context():
    # Se for SQLite, garantir que o diretório existe
    db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    if db_uri.startswith('sqlite:///'):
        db_path = db_uri.replace('sqlite:///', '')
        if '/' in db_path:
            db_dir = os.path.dirname(db_path)
            if db_dir and not os.path.exists(db_dir):
                try:
                    os.makedirs(db_dir, exist_ok=True)
                    print(f"✅ Diretório do banco criado: {db_dir}")
                except Exception as e:
                    print(f"❌ Erro ao criar diretório do banco: {e}")
    
    try:
        db.create_all()
        print("✅ Tabelas do banco verificadas/criadas com sucesso")
    except Exception as e:
        print(f"❌ Erro crítico ao conectar/criar tabelas no banco: {e}")
        # Não matar a aplicação, permitir que suba mesmo sem banco (para debug/home)
        pass

if __name__ == "__main__":
    # Em produção, use Gunicorn ou outro WSGI server
    port = int(os.environ.get('PORT', 5001))
    debug_mode = not os.environ.get('PRODUCTION')
    app.run(host='0.0.0.0', debug=debug_mode, port=port)
