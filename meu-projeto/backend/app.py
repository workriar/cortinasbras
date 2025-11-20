from flask import Flask, jsonify, send_from_directory, request
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io, datetime
from flask_cors import CORS
import os


import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder=None)
CORS(app)

# Configurações de Email
app.config['MAIL_SERVER'] = 'mail.cronos-painel.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'vendas@cortinasbras.com.br')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'sua-senha')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'vendas@cortinasbras.com.br')
mail = Mail(app)

# Banco de dados (SQLite para dev, MySQL para prod)
if os.environ.get('PRODUCTION'):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql://usuario:senha@localhost/cortinas_db')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leads.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Lead(db.Model):
    __tablename__ = 'leads'
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
# Rotas API

@app.route('/api/enviar', methods=['POST'])
def api_enviar():
    data = request.get_json()
    try:
        lead = Lead(
            nome=data['nome'],
            telefone=data['telefone'],
            largura_parede=float(data.get('largura_parede', 0) or 0),
            altura_parede=float(data.get('altura_parede', 0) or 0),
            largura_janela=0.0,
            altura_janela=0.0,
            tecido=data.get('tecido', 'Não especificado'),
            instalacao=data.get('instalacao', 'Não especificado'),
            observacoes=data.get('mensagem', data.get('observacoes', '')),
            endereco=data.get('endereco', '')
        )
        db.session.add(lead)
        db.session.commit()

        # Criar PDF
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        logo_path = os.path.join(os.path.dirname(__file__), '../static/logo.png')
        if os.path.exists(logo_path):
            p.drawImage(logo_path, width/2 - 50, height - 120, width=100, height=80, preserveAspectRatio=True, mask='auto')
        p.setFont("Helvetica-Bold", 18)
        p.drawCentredString(width/2, height - 140, "ORÇAMENTO DE CORTINAS SOB MEDIDA")
        p.setStrokeColorRGB(0.831, 0.663, 0.243)
        p.setLineWidth(2)
        p.line(50, height - 150, width - 50, height - 150)
        y_position = height - 180
        p.setFont("Helvetica-Bold", 12)
        p.setFillColorRGB(0, 0, 0)
        p.drawString(50, y_position, "DADOS DO CLIENTE")
        y_position -= 25
        p.setFont("Helvetica", 11)
        p.drawString(70, y_position, f"Nome: {lead.nome}")
        y_position -= 20
        p.drawString(70, y_position, f"Telefone/WhatsApp: {lead.telefone}")
        y_position -= 20
        p.drawString(70, y_position, f"Data da Solicitação: {lead.criado_em.strftime('%d/%m/%Y às %H:%M')}")
        y_position -= 35
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y_position, "ESPECIFICAÇÕES DO PRODUTO")
        y_position -= 25
        p.setFont("Helvetica", 11)
        p.drawString(70, y_position, f"Tipo de Tecido: {lead.tecido}")
        y_position -= 20
        p.drawString(70, y_position, f"Tipo de Instalação: {lead.instalacao}")
        y_position -= 35
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y_position, "MEDIDAS DA PAREDE")
        y_position -= 25
        p.setFont("Helvetica", 11)
        p.drawString(70, y_position, f"Largura: {lead.largura_parede}m")
        y_position -= 20
        p.drawString(70, y_position, f"Altura: {lead.altura_parede}m")
        if lead.observacoes:
            y_position -= 35
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y_position, "OBSERVAÇÕES")
            y_position -= 25
            p.setFont("Helvetica", 11)
            obs_lines = [lead.observacoes[i:i+80] for i in range(0, len(lead.observacoes), 80)]
            for line in obs_lines:
                p.drawString(70, y_position, line)
                y_position -= 20
        if lead.endereco:
            y_position -= 15
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y_position, "ENDEREÇO PARA INSTALAÇÃO")
            y_position -= 25
            p.setFont("Helvetica", 11)
            end_lines = [lead.endereco[i:i+80] for i in range(0, len(lead.endereco), 80)]
            for line in end_lines:
                p.drawString(70, y_position, line)
                y_position -= 20
        p.setFont("Helvetica-Oblique", 9)
        p.setFillColorRGB(0.4, 0.4, 0.4)
        p.drawCentredString(width/2, 50, "Cortinas Brás - Av. Celso Garcia, 129 - Brás, São Paulo - SP")
        p.drawCentredString(width/2, 35, "Tel: (11) 99289-1070 | www.cortinasbras.com.br")
        p.save()
        buffer.seek(0)

        # Enviar email
        email_sent = False
        try:
            msg = Message(
                subject=f"📋 Novo Orçamento - {lead.nome} - {lead.criado_em.strftime('%d/%m/%Y %H:%M')}",
                recipients=['vendas@cortinasbras.com.br']
            )
            msg.html = f"""
            <html><body><h2>Novo Orçamento Recebido</h2>
            <p><b>Nome:</b> {lead.nome}<br>
            <b>Telefone:</b> {lead.telefone}<br>
            <b>Tecido:</b> {lead.tecido}<br>
            <b>Instalação:</b> {lead.instalacao}<br>
            <b>Largura:</b> {lead.largura_parede}m<br>
            <b>Altura:</b> {lead.altura_parede}m<br>
            <b>Observações:</b> {lead.observacoes}<br>
            <b>Endereço:</b> {lead.endereco}</p></body></html>
            """
            msg.attach(f"orcamento_{lead.nome.replace(' ', '_')}_{lead.criado_em.strftime('%Y%m%d_%H%M')}.pdf", "application/pdf", buffer.read())
            mail.send(msg)
            email_sent = True
        except Exception as email_error:
            app.logger.error(f"Falha ao enviar email: {email_error}")

        return jsonify({
            'success': True,
            'email_sent': email_sent,
            'lead_id': lead.id,
            'message': 'Orçamento salvo com sucesso!'
        })
    except Exception as err:
        return jsonify({'success': False, 'error': str(err)}), 500

# Configuração
WHATSAPP_NUMBER = '5511992891070'

# Rotas API
@app.route('/api/config', methods=['GET'])
def get_config():
    """Retorna configurações do site"""
    return jsonify({
        'title': 'Cortinas sob medida em São Paulo',
        'description': 'Transforme seu ambiente com sofisticação, tecidos nobres e instalação profissional.',
        'whatsapp': WHATSAPP_NUMBER,
        'address': {
            'street': 'Av. Celso Garcia, 129',
            'neighborhood': 'Brás',
            'city': 'São Paulo',
            'state': 'SP'
        },
        'contact': {
            'phone': '(11) 99289-1070',
            'email': 'contato@cortinasbras.com.br'
        }
    })

@app.route('/api/slides', methods=['GET'])
def get_slides():
    """Retorna slides do carrossel"""
    return jsonify([
        {'src': 'slide1.jpg', 'alt': 'Cortina elegante em sala de estar'},
        {'src': 'slide2.jpg', 'alt': 'Cortina moderna em quarto'},
        {'src': 'slide3.jpg', 'alt': 'Cortina sofisticada em escritório'}
    ])

# Serve React App
@app.route('/')
def index():
    return send_from_directory('build', 'index.html')

# Serve arquivos estáticos do React build  
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('build/static', filename)

# Serve outros arquivos do build (favicon, logo, etc)
@app.route('/<path:filename>')
def serve_file(filename):
    # Servir arquivos do build se existirem
    file_path = os.path.join('build', filename)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory('build', filename)
    # Caso contrário, serve o index.html (SPA routing)
    return send_from_directory('build', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
