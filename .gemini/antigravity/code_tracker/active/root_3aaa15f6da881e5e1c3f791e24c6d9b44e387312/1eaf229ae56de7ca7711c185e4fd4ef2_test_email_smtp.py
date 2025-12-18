�#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configurações
SMTP_SERVER = 'smtplw.com.br'
SMTP_PORT = 587
USERNAME = 'loja'  # Apenas o nome do usuário, sem @dominio
PASSWORD = '6ze3C7WPvvHXqrT@'
FROM_EMAIL = 'loja@cortinasbras.com.br'
TO_EMAIL = 'loja@cortinasbras.com.br'

print("🔧 Testando configuração de email SMTP...")
print(f"Servidor: {SMTP_SERVER}:{SMTP_PORT}")
print(f"Usuário: {USERNAME}")
print(f"De: {FROM_EMAIL}")
print(f"Para: {TO_EMAIL}")
print("-" * 50)

try:
    # Criar mensagem
    msg = MIMEMultipart()
    msg['From'] = FROM_EMAIL
    msg['To'] = TO_EMAIL
    msg['Subject'] = '✅ Teste de Email - Cortinas Brás'
    
    body = """
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #D4A93E;">✅ Teste de Configuração de Email</h2>
        <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
        <p><strong>Servidor:</strong> {}</p>
        <p><strong>Porta:</strong> {}</p>
        <p><strong>Status:</strong> <span style="color: green;">Funcionando!</span></p>
    </body>
    </html>
    """.format(SMTP_SERVER, SMTP_PORT)
    
    msg.attach(MIMEText(body, 'html'))
    
    # Conectar e enviar
    print("📡 Conectando ao servidor SMTP...")
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    
    print("🔐 Iniciando TLS...")
    server.starttls()
    
    print("🔑 Fazendo login...")
    server.login(USERNAME, PASSWORD)
    
    print("📧 Enviando email...")
    server.send_message(msg)
    
    print("✅ Email enviado com sucesso!")
    server.quit()
    
except Exception as e:
    print(f"❌ Erro ao enviar email: {e}")
    import traceback
    traceback.print_exc()
�"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122file:///root/test_email_smtp.py:file:///root