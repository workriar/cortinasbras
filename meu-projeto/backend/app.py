from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

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
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
