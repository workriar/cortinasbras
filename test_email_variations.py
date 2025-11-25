#!/usr/bin/env python3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configurações
SMTP_SERVER = 'smtplw.com.br'
SMTP_PORT = 587
PASSWORD = '6ze3C7WPvvHXqrT@'
FROM_EMAIL = 'loja@cortinasbras.com.br'
TO_EMAIL = 'loja@cortinasbras.com.br'

# Testar diferentes formatos de usuário
usernames_to_test = [
    'loja',
    'loja@cortinasbras.com.br',
    'loja@cortinasbras.com.br',  # com domínio completo
]

for username in usernames_to_test:
    print(f"\n{'='*60}")
    print(f"🧪 Testando com usuário: {username}")
    print(f"{'='*60}")
    
    try:
        # Criar mensagem
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = TO_EMAIL
        msg['Subject'] = '✅ Teste de Email - Cortinas Brás'
        
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #D4A93E;">✅ Teste de Configuração de Email</h2>
            <p>Teste com usuário: <strong>{username}</strong></p>
            <p><strong>Status:</strong> <span style="color: green;">Funcionando!</span></p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Conectar e enviar
        print("📡 Conectando ao servidor SMTP...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30)
        
        print("🔐 Iniciando TLS...")
        server.starttls()
        
        print(f"🔑 Fazendo login com: {username}")
        server.login(username, PASSWORD)
        
        print("📧 Enviando email...")
        server.send_message(msg)
        
        print(f"✅ ✅ ✅ SUCESSO! Email enviado com usuário: {username}")
        server.quit()
        
        print(f"\n🎉 CONFIGURAÇÃO CORRETA:")
        print(f"   MAIL_USERNAME='{username}'")
        print(f"   MAIL_PASSWORD='6ze3C7WPvvHXqrT@'")
        break  # Se funcionou, para o loop
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Falha de autenticação com '{username}': {e}")
    except Exception as e:
        print(f"❌ Erro com '{username}': {e}")
        import traceback
        traceback.print_exc()

print("\n" + "="*60)
print("Teste concluído!")
print("="*60)
