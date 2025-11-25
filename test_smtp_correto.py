#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl

# Configurações CORRETAS
SMTP_SERVER = 'mail.cronos-painel.com'
SMTP_PORT = 465  # SSL
USERNAME = 'loja@cortinasbras.com.br'
PASSWORD = 'RMWa9wNemzQW6dm@'
FROM_EMAIL = 'loja@cortinasbras.com.br'
TO_EMAIL = 'loja@cortinasbras.com.br'

print("="*70)
print("🔐 TESTE COM CREDENCIAIS CORRETAS")
print("="*70)
print(f"Servidor: {SMTP_SERVER}:{SMTP_PORT} (SSL)")
print(f"Usuário: {USERNAME}")
print(f"De: {FROM_EMAIL}")
print(f"Para: {TO_EMAIL}")
print("="*70)

try:
    # Criar mensagem
    msg = MIMEMultipart()
    msg['From'] = FROM_EMAIL
    msg['To'] = TO_EMAIL
    msg['Subject'] = '🎉 Teste SMTP - Cortinas Brás - CONFIGURAÇÃO CORRETA'
    
    body = """
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #D4A93E 0%, #8B5C2A 100%); padding: 30px; text-align: center; border-radius: 8px; margin: -30px -30px 20px -30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Sucesso!</h1>
            </div>
            <h2 style="color: #D4A93E;">✅ Configuração SMTP Funcionando!</h2>
            <p>O email está configurado corretamente e funcionando!</p>
            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Servidor:</strong> mail.cronos-painel.com:465</p>
                <p><strong>Protocolo:</strong> SSL</p>
                <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">✅ Ativo</span></p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                Cortinas Brás - Sistema de Orçamentos
            </p>
        </div>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    print("\n📡 Conectando ao servidor SMTP via SSL...")
    
    # Usar SMTP_SSL para porta 465
    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context, timeout=30)
    
    print("🔑 Fazendo login...")
    server.login(USERNAME, PASSWORD)
    
    print("📧 Enviando email de teste...")
    server.send_message(msg)
    
    print("\n" + "="*70)
    print("🎉 🎉 🎉 EMAIL ENVIADO COM SUCESSO! 🎉 🎉 🎉")
    print("="*70)
    print(f"\n✅ Verifique o email em: {TO_EMAIL}")
    print("\n✅ Configuração correta:")
    print(f"   SMTP_SERVER: {SMTP_SERVER}")
    print(f"   SMTP_PORT: {SMTP_PORT}")
    print(f"   USERNAME: {USERNAME}")
    print("="*70)
    
    server.quit()
    
except Exception as e:
    print(f"\n❌ Erro: {e}")
    import traceback
    traceback.print_exc()
