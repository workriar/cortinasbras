import smtplib
import os

smtp_server = "mail.cronos-painel.com"
smtp_port = 465
smtp_user = "loja"  # Testando com usuário curto
smtp_password = "6ze3C7WPvvHXqrT@"

try:
    print(f"Conectando a {smtp_server}:{smtp_port}...")
    server = smtplib.SMTP_SSL(smtp_server, smtp_port)
    server.login(smtp_user, smtp_password)
    print("✅ Login com usuário 'loja' SUCESSO!")
    server.quit()
except Exception as e:
    print(f"❌ Falha com usuário 'loja': {e}")
    
    # Tentar com email completo
    try:
        smtp_user_full = "loja@cortinasbras.com.br"
        print(f"Tentando com {smtp_user_full}...")
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(smtp_user_full, smtp_password)
        print("✅ Login com 'loja@cortinasbras.com.br' SUCESSO!")
        server.quit()
    except Exception as e2:
        print(f"❌ Falha com email completo também: {e2}")
