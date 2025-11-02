#!/usr/bin/env bash
# Script de deploy melhorado para VPS - Cortinas Brás
# Uso: sudo bash deploy_vps_improved.sh
# Ou: sudo PROJECT_DIR=/caminho/projeto DOMAIN=seudominio.com bash deploy_vps_improved.sh

set -euo pipefail

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR=${PROJECT_DIR:-/root/app}
VENV_DIR="$PROJECT_DIR/venv"
SERVICE_NAME=${SERVICE_NAME:-cortinas-bras}
GUNICORN_BIND=${GUNICORN_BIND:-127.0.0.1:8000}
GUNICORN_WORKERS=${GUNICORN_WORKERS:-3}
NGINX_SITE=/etc/nginx/sites-available/${SERVICE_NAME}
NGINX_LINK=/etc/nginx/sites-enabled/${SERVICE_NAME}
DOMAIN=${DOMAIN:-_}

echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}Deploy Cortinas Brás - VPS${NC}"
echo -e "${GREEN}===================================${NC}"

if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}Erro: Projeto não encontrado em $PROJECT_DIR${NC}"
  echo "Por favor copie o projeto para esse diretório antes de executar o script."
  exit 1
fi

cd "$PROJECT_DIR"

echo -e "\n${YELLOW}[1/6] Atualizando sistema e instalando dependências...${NC}"
apt update -qq
apt install -y python3 python3-venv python3-pip nginx git build-essential libmysqlclient-dev pkg-config > /dev/null 2>&1
echo -e "${GREEN}✓ Dependências instaladas${NC}"

echo -e "\n${YELLOW}[2/6] Criando ambiente virtual e instalando pacotes Python...${NC}"
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi
source "$VENV_DIR/bin/activate"
pip install --upgrade pip -q
pip install -r "$PROJECT_DIR/requirements.txt" -q
echo -e "${GREEN}✓ Ambiente Python configurado${NC}"

echo -e "\n${YELLOW}[3/6] Criando usuário de serviço...${NC}"
if ! id cortinas >/dev/null 2>&1; then
  useradd -r -s /usr/sbin/nologin cortinas 2>/dev/null || true
  echo -e "${GREEN}✓ Usuário 'cortinas' criado${NC}"
else
  echo -e "${GREEN}✓ Usuário 'cortinas' já existe${NC}"
fi
chown -R cortinas:cortinas "$PROJECT_DIR" 2>/dev/null || true

# Criar banco de dados SQLite se não existir
if [ ! -f "$PROJECT_DIR/leads.db" ]; then
  echo "Inicializando banco de dados..."
  sudo -u cortinas "$VENV_DIR/bin/python" -c "from app import app, db; app.app_context().push(); db.create_all()" 2>/dev/null || true
fi

echo -e "\n${YELLOW}[4/6] Configurando serviço systemd...${NC}"
SERVICE_FILE=/etc/systemd/system/${SERVICE_NAME}.service

# Criar arquivo de variáveis de ambiente se não existir
ENV_FILE="/etc/default/${SERVICE_NAME}"
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<ENVEOF
# Variáveis de ambiente para Cortinas Brás
# Edite este arquivo com suas credenciais reais
PRODUCTION=1
SECRET_KEY=change-this-to-a-random-secret-key
MAIL_USERNAME=seu-email@dominio.com.br
MAIL_PASSWORD=sua-senha
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
DATABASE_URL=sqlite:///$PROJECT_DIR/leads.db
ENVEOF
  chmod 600 "$ENV_FILE"
  chown cortinas:cortinas "$ENV_FILE"
  echo -e "${YELLOW}⚠️  ATENÇÃO: Configure as variáveis em $ENV_FILE${NC}"
fi

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Cortinas Bras Gunicorn Service
After=network.target

[Service]
Type=simple
User=cortinas
Group=cortinas
WorkingDirectory=$PROJECT_DIR
Environment="PATH=$VENV_DIR/bin"
Environment="PYTHONUNBUFFERED=1"
EnvironmentFile=/etc/default/${SERVICE_NAME}
ExecStart=$VENV_DIR/bin/gunicorn --workers $GUNICORN_WORKERS --bind ${GUNICORN_BIND} --timeout 300 --access-logfile - --error-logfile - app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${SERVICE_NAME}.service 2>/dev/null || true
echo -e "${GREEN}✓ Serviço systemd configurado${NC}"

echo -e "\n${YELLOW}[5/6] Configurando Nginx...${NC}"

# Remover configuração default se existir
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

cat > "$NGINX_SITE" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    
    client_max_body_size 10M;
    
    # Logs
    access_log /var/log/nginx/cortinas-bras-access.log;
    error_log /var/log/nginx/cortinas-bras-error.log;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
        proxy_redirect off;
        proxy_buffering off;
    }

    location /static/ {
        alias $PROJECT_DIR/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

ln -sf "$NGINX_SITE" "$NGINX_LINK"

if nginx -t 2>/dev/null; then
  systemctl restart nginx
  echo -e "${GREEN}✓ Nginx configurado e reiniciado${NC}"
else
  echo -e "${RED}✗ Erro na configuração do Nginx${NC}"
  nginx -t
  exit 1
fi

echo -e "\n${YELLOW}[6/6] Iniciando serviço...${NC}"
systemctl restart ${SERVICE_NAME}.service

sleep 2

if systemctl is-active --quiet ${SERVICE_NAME}.service; then
  echo -e "${GREEN}✓ Serviço iniciado com sucesso${NC}"
else
  echo -e "${RED}✗ Erro ao iniciar serviço${NC}"
  echo "Verificando logs..."
  journalctl -u ${SERVICE_NAME}.service -n 20 --no-pager
  exit 1
fi

echo -e "\n${GREEN}===================================${NC}"
echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente em: $ENV_FILE"
echo "2. Reinicie o serviço: systemctl restart ${SERVICE_NAME}"
echo "3. Verifique logs: journalctl -u ${SERVICE_NAME} -f"
echo "4. Acesse o admin em: http://seu-dominio/admin/leads"
echo ""
if [ "$DOMAIN" = "_" ]; then
  echo -e "${YELLOW}⚠️  Para usar HTTPS, configure o domínio e execute:${NC}"
  echo "   certbot --nginx -d seu-dominio.com"
fi
echo ""
