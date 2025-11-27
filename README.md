<<<<<<< HEAD
# 🪟 Cortinas Brás - Sistema de Orçamentos

> Landing page moderna com formulário de orçamento integrado ao WhatsApp, gestão de leads e tracking de conversões do Google Ads.

## 📋 Funcionalidades

- ✅ Formulário de orçamento responsivo
- ✅ Envio automático para WhatsApp
- ✅ Armazenamento de leads em banco de dados
- ✅ Geração de PDF com orçamento
- ✅ Painel admin para visualizar leads
- ✅ Integração com Google Ads para tracking de conversões
- ✅ Mapa interativo do Google Maps
- ✅ Design moderno com tema dark/gold

## 🚀 Deploy Rápido

### Opção 1: Deploy em VPS (Recomendado)

```bash
# 1. Conecte-se ao seu VPS
ssh root@seu-servidor

# 2. Clone o repositório
git clone https://github.com/seu-usuario/cortinas-bras.git /root/app
cd /root/app

# 3. Execute o script de deploy
sudo bash deploy_vps_improved.sh

# 4. Configure as variáveis de ambiente
sudo nano /etc/default/cortinas-bras

# 5. Reinicie o serviço
sudo systemctl restart cortinas-bras

# 6. Teste a aplicação internamente
curl -I http://127.0.0.1:8000
```

> **Importante:** o Nginx deve encaminhar as requisições para `http://127.0.0.1:8000`, que é a porta usada pelo Gunicorn nos scripts de deploy. Após qualquer alteração rode `sudo nginx -t && sudo systemctl reload nginx`.

### Opção 2: Deploy com Docker

```bash
# Build
docker build -t cortinas-bras:latest .

# Run
docker run -d -p 80:5000 \
  -e PRODUCTION=1 \
  -e SECRET_KEY=sua-chave-secreta \
  -e MAIL_USERNAME=seu-email@dominio.com \
  -e MAIL_PASSWORD=sua-senha \
  --name cortinas-bras \
  cortinas-bras:latest
```

### Opção 3: Heroku/Render

```bash
# Heroku
git push heroku main
heroku config:set PRODUCTION=1 SECRET_KEY=xxx MAIL_USERNAME=xxx

# Render
# Configure via dashboard:
# - Build: pip install -r requirements.txt
# - Start: gunicorn app:app
```

## 💻 Desenvolvimento Local

### Pré-requisitos

- Python 3.8+
- pip
- virtualenv (opcional, mas recomendado)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cortinas-bras.git
cd cortinas-bras

# 2. Crie e ative o ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Configure as variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configurações

# 5. Inicialize o banco de dados
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# 6. Execute a aplicação
python app.py
```

Acesse: http://127.0.0.1:5001

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
PRODUCTION=1
SECRET_KEY=sua-chave-secreta-gerada
MAIL_USERNAME=seu-email@dominio.com.br
MAIL_PASSWORD=sua-senha-email
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
DATABASE_URL=sqlite:///leads.db  # ou mysql://user:pass@host/db
```

**Gerar SECRET_KEY segura:**
=======
# Cortinas Bresser - Sistema de Orçamentos

Sistema web para orçamentos de cortinas sob medida com geração de PDF e envio automático por email.

## 🚀 Deploy

Este projeto está preparado para deploy no **EasyPanel (Hostinger VPS)** usando Docker.

📖 **[Guia Completo de Deploy](./DEPLOY-EASYPANEL.md)**

## 🛠️ Tecnologias

- **Backend:** Python 3.11 + Flask
- **Banco de Dados:** SQLite (desenvolvimento) / MySQL (produção opcional)
- **Email:** Flask-Mail com SMTP
- **PDF:** ReportLab
- **Deploy:** Docker + EasyPanel

## 📦 Estrutura do Projeto

```
cortinas-app/
├── app.py                    # Aplicação Flask principal
├── requirements.txt          # Dependências Python
├── templates/                # Templates HTML
│   ├── index.html           # Página principal
│   └── admin_leads.html     # Admin de leads
├── static/                   # Arquivos estáticos (CSS, JS, imagens)
├── Dockerfile               # Container Docker
├── docker-compose.yml       # Orquestração Docker
├── .dockerignore           # Arquivos ignorados no build
├── .env.example            # Exemplo de variáveis de ambiente
└── DEPLOY-EASYPANEL.md     # Guia de deploy completo
```

## 🏃 Executar Localmente

### 1. Instalar Dependências

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 3. Executar Aplicação

```bash
python app.py
```

Acesse: http://localhost:5000

### 4. Executar com Docker (Desenvolvimento)

```bash
# Build da imagem
docker build -t cortinas-app .

# Executar container
docker run -p 8000:8000 \
  -e PRODUCTION=false \
  cortinas-app
```

Acesse: http://localhost:8000

## 🌐 Deploy em Produção

### EasyPanel (Recomendado)

Siga o guia completo: **[DEPLOY-EASYPANEL.md](./DEPLOY-EASYPANEL.md)**

Resumo dos passos:
1. ✅ Fazer push do código para GitHub
2. ✅ Conectar repositório no EasyPanel
3. ✅ Configurar variáveis de ambiente
4. ✅ Deploy automático!

## 📧 Configuração de Email

### Hostinger SMTP

```env
MAIL_USERNAME=seu-email@dominio.com
MAIL_PASSWORD=sua-senha
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
```

Servidor SMTP (em `app.py`):
- Host: `smtp.hostinger.com`
- Port: `587`
- TLS: `True`

## 💾 Banco de Dados

### SQLite (Padrão - Desenvolvimento)

Arquivo local: `instance/leads.db`

```env
DATABASE_URL=sqlite:///leads.db
```

### MySQL (Produção)

```env
DATABASE_URL=mysql://usuario:senha@host/database
```

## 🔒 Segurança

- ✅ Use sempre HTTPS em produção
- ✅ Gere uma SECRET_KEY forte
- ✅ Não commite o arquivo `.env`
- ✅ Use variáveis de ambiente para credenciais

Gerar SECRET_KEY:
>>>>>>> 78c9a6c (Fix: Form submission, PDF generation with logo, and WhatsApp message)
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

<<<<<<< HEAD
### Configurar HTTPS (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática já está configurada
```

## 📊 Painel Admin

Acesse o painel de leads em: `http://seu-dominio/admin/leads`

## 🔧 Manutenção

### Ver logs do serviço
```bash
sudo journalctl -u cortinas-bras -f
```

### Reiniciar serviço
```bash
sudo systemctl restart cortinas-bras
```

### Atualizar aplicação
```bash
cd /root/app
git pull
sudo systemctl restart cortinas-bras
```

### Backup do banco de dados
```bash
sudo cp /root/app/leads.db /root/app/backups/leads-$(date +%Y%m%d).db
```

## 📁 Estrutura do Projeto

```
cortinas-bras/
├── app.py                    # Aplicação Flask principal
├── requirements.txt          # Dependências Python
├── Dockerfile               # Imagem Docker
├── Procfile                 # Deploy Heroku
├── deploy_vps_improved.sh   # Script de deploy VPS
├── .env.example             # Exemplo de variáveis
├── templates/
│   ├── index.html          # Landing page principal
│   └── admin_leads.html    # Painel admin
├── static/
│   ├── style.css           # Estilos CSS
│   ├── script.js           # JavaScript (legado)
│   ├── logo.png
│   └── icons/
└── README.md
```

## 🛠️ Tecnologias Utilizadas

- **Backend:** Flask, SQLAlchemy, Flask-Mail
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Banco de Dados:** SQLite (dev) / MySQL (prod)
- **Deploy:** Gunicorn, Nginx, Systemd
- **Tracking:** Google Ads Conversion Tracking

## 🐛 Solução de Problemas

### Erro de permissão no banco de dados
```bash
sudo chown cortinas:cortinas /root/app/leads.db
```

### Serviço não inicia
```bash
# Verificar logs
sudo journalctl -u cortinas-bras -n 50

# Testar manualmente
source /root/app/venv/bin/activate
cd /root/app
python app.py
```

### Nginx retorna 502 Bad Gateway
```bash
# Verificar se o Gunicorn está rodando
sudo systemctl status cortinas-bras

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/cortinas-bras-error.log
```

## 📝 Licença

© 2025 Cortinas Brás - Todos os direitos reservados

## 📧 Contato

- **Site:** https://cortinasbras.com.br
- **Email:** contato@cortinasbras.com.br
- **WhatsApp:** (11) 99289-1070
- **Endereço:** Av. Celso Garcia, 129 - Brás, São Paulo - SP
=======
## 📊 Admin

Visualize os leads cadastrados:

```
http://seu-dominio.com/admin/leads
```

> ⚠️ **Importante:** Adicione autenticação antes de usar em produção!

## 🧪 Testes

Teste localmente antes de fazer deploy:

1. ✅ Formulário de orçamento
2. ✅ Geração de PDF
3. ✅ Envio de email
4. ✅ Salvamento no banco

## 📄 Licença

Projeto proprietário - Cortinas Bresser © 2024

## 📞 Suporte

Para dúvidas sobre deploy, consulte: [DEPLOY-EASYPANEL.md](./DEPLOY-EASYPANEL.md)

---

**Status:** ✅ Pronto para deploy no EasyPanel
>>>>>>> 78c9a6c (Fix: Form submission, PDF generation with logo, and WhatsApp message)
