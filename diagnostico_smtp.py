#!/usr/bin/env python3
"""
Script para testar credenciais SMTP da Locaweb
Execute este script e verifique qual senha funciona
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = 'smtplw.com.br'
SMTP_PORT = 587
FROM_EMAIL = 'loja@cortinasbras.com.br'
TO_EMAIL = 'loja@cortinasbras.com.br'

print("="*70)
print("🔐 TESTE DE CREDENCIAIS SMTP - CORTINAS BRÁS")
print("="*70)
print("\n⚠️  IMPORTANTE: Verifique as credenciais no painel da Locaweb")
print("\nPossíveis problemas:")
print("1. Senha incorreta")
print("2. Conta de email desativada")
print("3. SMTP não habilitado para esta conta")
print("4. Autenticação de dois fatores ativada")
print("5. Senha de aplicativo necessária")
print("\n" + "="*70)

# Senhas para testar (adicione variações se necessário)
passwords_to_test = [
    '6ze3C7WPvvHXqrT@',  # Senha fornecida
    # Adicione outras variações se necessário
]

usernames_to_test = [
    'loja@cortinasbras.com.br',
    'loja',
]

success = False

for username in usernames_to_test:
    if success:
        break
    
    for password in passwords_to_test:
        print(f"\n{'─'*70}")
        print(f"🧪 Testando:")
        print(f"   Usuário: {username}")
        print(f"   Senha: {password[:3]}{'*' * (len(password)-6)}{password[-3:]}")
        print(f"{'─'*70}")
        
        try:
            msg = MIMEMultipart()
            msg['From'] = FROM_EMAIL
            msg['To'] = TO_EMAIL
            msg['Subject'] = '✅ Teste SMTP - Cortinas Brás'
            
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #D4A93E;">✅ Configuração SMTP Funcionando!</h2>
                <p>Usuário: <strong>{username}</strong></p>
                <p>Servidor: <strong>{SMTP_SERVER}:{SMTP_PORT}</strong></p>
                <p><strong>Status:</strong> <span style="color: green;">✅ Sucesso!</span></p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            print("📡 Conectando ao servidor...")
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30)
            
            print("🔐 Iniciando TLS...")
            server.starttls()
            
            print("🔑 Autenticando...")
            server.login(username, password)
            
            print("📧 Enviando email de teste...")
            server.send_message(msg)
            server.quit()
            
            print("\n" + "="*70)
            print("🎉 🎉 🎉 SUCESSO! EMAIL ENVIADO! 🎉 🎉 🎉")
            print("="*70)
            print("\n✅ Configuração correta:")
            print(f"   MAIL_USERNAME='{username}'")
            print(f"   MAIL_PASSWORD='{password}'")
            print(f"   MAIL_DEFAULT_SENDER='{FROM_EMAIL}'")
            print("\n✅ Verifique o email em: {TO_EMAIL}")
            print("="*70)
            
            success = True
            break
            
        except smtplib.SMTPAuthenticationError as e:
            print(f"❌ Falha de autenticação: {e}")
            print("   → Verifique usuário e senha no painel da Locaweb")
            
        except smtplib.SMTPException as e:
            print(f"❌ Erro SMTP: {e}")
            
        except Exception as e:
            print(f"❌ Erro: {e}")

if not success:
    print("\n" + "="*70)
    print("❌ NENHUMA CONFIGURAÇÃO FUNCIONOU")
    print("="*70)
    print("\n📋 PRÓXIMOS PASSOS:")
    print("\n1. Acesse o painel da Locaweb:")
    print("   https://painel.locaweb.com.br")
    print("\n2. Vá em 'Email' → 'Contas de Email'")
    print("\n3. Verifique a conta: loja@cortinasbras.com.br")
    print("   - Está ativa?")
    print("   - Qual é a senha correta?")
    print("   - SMTP está habilitado?")
    print("\n4. Se necessário, redefina a senha")
    print("\n5. Verifique se precisa de 'Senha de Aplicativo'")
    print("   (algumas contas exigem senha específica para SMTP)")
    print("\n" + "="*70)
