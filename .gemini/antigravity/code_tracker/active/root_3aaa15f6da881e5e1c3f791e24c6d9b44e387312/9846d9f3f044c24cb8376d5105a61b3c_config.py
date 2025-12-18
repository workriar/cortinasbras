�	import os

class Config:
    # Segurança
    SECRET_KEY = os.environ.get('SECRET_KEY', 'chave-secreta-padrao-seguranca')
    
    # Configurações de Email
    # Configurações de Email
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.hostinger.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 465))
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'True') == 'True'
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'False') == 'True'
    
    # Auto-fix para o username se o user esquecer do dominio
    _mail_user = os.environ.get('MAIL_USERNAME', 'loja@cortinasbras.com.br')
    if _mail_user and '@' not in _mail_user:
        _mail_user += '@cortinasbras.com.br'
    
    MAIL_USERNAME = _mail_user
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = _mail_user
    
    # Banco de Dados
    if os.environ.get('PRODUCTION'):
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    else:
        # Caminho absoluto para evitar erros de diretório
        BASE_DIR = os.path.abspath(os.path.dirname(__file__))
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'leads.db')
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
�	"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122file:///root/config.py:file:///root