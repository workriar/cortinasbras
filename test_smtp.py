#!/usr/bin/env python3
import smtplib
import ssl

# Configurações
MAIL_SERVER = 'mail.cronos-painel.com'
MAIL_PORT = 465
MAIL_USERNAME = 'vendas@cortinasbras.com.br'
MAIL_PASSWORD = '95ZX35LYcFEYpsu@'

print(f"Testando conexão SMTP com:")
print(f"Servidor: {MAIL_SERVER}:{MAIL_PORT}")
print(f"Usuário: {MAIL_USERNAME}")
print(f"Senha: {'*' * len(MAIL_PASSWORD)}")
print("-" * 50)

try:
    # Criar contexto SSL
    context = ssl.create_default_context()
    
    # Conectar usando SSL
    print("1. Conectando ao servidor SMTP...")
    server = smtplib.SMTP_SSL(MAIL_SERVER, MAIL_PORT, context=context)
    print("✓ Conexão estabelecida")
    
    # Fazer login
    print("2. Tentando autenticação...")
    server.login(MAIL_USERNAME, MAIL_PASSWORD)
    print("✓ Autenticação bem-sucedida!")
    
    # Fechar conexão
    server.quit()
    print("✓ Teste concluído com sucesso!")
    
except smtplib.SMTPAuthenticationError as e:
    print(f"✗ Erro de autenticação: {e}")
    print(f"Código: {e.smtp_code}")
    print(f"Mensagem: {e.smtp_error}")
except Exception as e:
    print(f"✗ Erro: {type(e).__name__}: {e}")
