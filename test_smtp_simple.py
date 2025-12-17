import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuracoes do Cronos/Hostinger
MAIL_SERVER = "mail.cronos-painel.com"
MAIL_PORT = 465
MAIL_USERNAME = "loja@cortinasbras.com.br"
MAIL_PASSWORD = "4LuZr4hrFqeTsrZ@"

print("=== Teste de Conexao SMTP - Cronos/Hostinger ===")
print(f"Servidor: {MAIL_SERVER}")
print(f"Porta: {MAIL_PORT}")
print(f"Usuario: {MAIL_USERNAME}")
print(f"SSL: True")

try:
    # Criar contexto SSL
    context = ssl.create_default_context()
    
    print("\nConectando ao servidor SMTP...")
    server = smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT, context=context)
    
    print("[OK] Conexao estabelecida")
    
    print("\nTentando login...")
    server.login(MAIL_USERNAME, MAIL_PASSWORD)
    
    print("[OK] Login bem-sucedido!")
    
    # Criar email de teste
    print("\nEnviando email de teste...")
    msg = MIMEMultipart()
    msg['From'] = MAIL_USERNAME
    msg['To'] = "loja@cortinasbras.com.br"
    msg['Subject'] = "Teste de Configuracao SMTP - Cortinas Bras"
    
    body = """
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #D4A93E;">✅ Teste de Email Bem-Sucedido!</h2>
        <p>Este é um email de teste para confirmar que a configuração SMTP está funcionando corretamente.</p>
        <p><strong>Servidor:</strong> mail.cronos-painel.com</p>
        <p><strong>Porta:</strong> 465 (SSL)</p>
        <p><strong>Remetente:</strong> loja@cortinasbras.com.br</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Enviado em: 16/12/2025 às 21:52</p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    server.send_message(msg)
    print("[OK] Email enviado com sucesso!")
    
    server.quit()
    
    print("\n" + "="*50)
    print("[SUCESSO] TODAS AS CONFIGURACOES ESTAO CORRETAS!")
    print("="*50)
    print("\nO sistema de email esta pronto para uso.")
    
except Exception as e:
    print(f"\n[ERRO] {e}")
    print("\nVerifique:")
    print("1. Credenciais de email estao corretas")
    print("2. Servidor SMTP esta acessivel")
    print("3. Porta 465 nao esta bloqueada por firewall")

