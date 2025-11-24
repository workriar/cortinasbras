# Script para criar as tabelas do banco de dados do backend Flask
from app import db

if __name__ == '__main__':
    from app import app, db
    with app.app_context():
        db.create_all()
        print('Tabelas criadas com sucesso!')
