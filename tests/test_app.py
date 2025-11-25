import unittest
import os
import shutil
import sys
from app import app, db, Lead

class TestApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['WTF_CSRF_ENABLED'] = False
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
        
        # Ensure orcamentos dir exists for test cleanup
        if os.path.exists('orcamentos'):
            # clean it up to be sure
            pass 

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_enviar_orcamento(self):
        # Data to send
        data = {
            'nome': 'Teste User',
            'telefone': '11999999999',
            'larguraparede': '2,5',
            'alturaparede': '2.8',
            'largura_janela': '1,5',
            'altura_janela': '1.2',
            'tecido': 'Linho',
            'instalacao': 'Teto',
            'observacoes': 'Teste automatizado',
            'endereco': 'Rua Teste, 123'
        }

        # Send POST request
        response = self.app.post('/enviar', data=data)
        
        # Check response
        self.assertEqual(response.data.decode('utf-8'), 'success')
        
        # Check if Lead was saved to DB
        lead = Lead.query.filter_by(nome='Teste User').first()
        self.assertIsNotNone(lead, "Lead 'Teste User' not found in DB")
        self.assertEqual(lead.nome, 'Teste User')
        self.assertEqual(lead.largura_parede, 2.5)
        
        # Check if PDF was generated
        pdf_filename = f"orcamento_{lead.id}.pdf"
        pdf_path = os.path.join('orcamentos', pdf_filename)
        self.assertTrue(os.path.exists(pdf_path), f"PDF file not found at {pdf_path}")
        
        # Clean up PDF
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

if __name__ == '__main__':
    unittest.main()
