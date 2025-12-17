#!/usr/bin/env python3
import os
import smtplib
import ssl
from dotenv import load_dotenv

# Carregar ambiente
load_dotenv()

def verify_config():
    print("=== Verificador de Configuracao de Email ===")
    
    # 1. Verificar Variaveis
    mail_server = os.environ.get('MAIL_SERVER')
    mail_port = os.environ.get('MAIL_PORT')
    mail_username = os.environ.get('MAIL_USERNAME')
    mail_password = os.environ.get('MAIL_PASSWORD')
    use_tls = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
    use_ssl = os.environ.get('MAIL_USE_SSL', 'False').lower() == 'true'
    
    print(f"Servidor: {mail_server}")
    print(f"Porta: {mail_port}")
    print(f"Usuario: {mail_username}")
    print(f"TLS: {use_tls} | SSL: {use_ssl}")
    print(f"Senha: {'*' * 8 if mail_password else 'NAO DEFINIDA'}")
    
    if not all([mail_server, mail_port, mail_username, mail_password]):
        print("[ERRO] Variaveis obrigatorias faltando (.env nao encontrado ou incompleto)")
        return False
        
    # 2. Testar Conexao
    print("\nTestando conexao SMTP...")
    try:
        connection = None
        if use_ssl:
            context = ssl.create_default_context()
            connection = smtplib.SMTP_SSL(mail_server, int(mail_port), context=context)
        else:
            connection = smtplib.SMTP(mail_server, int(mail_port))
            if use_tls:
                connection.starttls()
                
        print("[OK] Conexao estabelecida")
        
        print("Tentando login...")
        connection.login(mail_username, mail_password)
        print("[OK] Login bem-sucedido!")
        
        connection.quit()
        print("\n[SUCESSO] TODAS AS CONFIGURACOES ESTAO CORRETAS!")
        return True
        
    except Exception as e:
        print(f"\n[ERRO DE CONEXAO] {e}")
        return False

if __name__ == "__main__":
    verify_config()

