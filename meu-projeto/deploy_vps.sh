#!/usr/bin/env bash
# Script de deploy para VPS (rodar no servidor como root ou com sudo)
# Uso recomendado:
# 1) Transfira o projeto para /opt/meu-projeto ou clone o repositório lá
# 2) Ajuste variáveis abaixo se necessário
# 3) Execute: sudo bash /opt/meu-projeto/deploy_vps.sh

set -euo pipefail
PROJECT_DIR=${PROJECT_DIR:-/opt/meu-projeto}
VENV_DIR="$PROJECT_DIR/venv"
SERVICE_NAME=${SERVICE_NAME:-cortinas-bras}
GUNICORN_BIND=${GUNICORN_BIND:-127.0.0.1:8000}
NGINX_SITE=/etc/nginx/sites-available/${SERVICE_NAME}
NGINX_LINK=/etc/nginx/sites-enabled/${SERVICE_NAME}

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Projeto não encontrado em $PROJECT_DIR"
  echo "Por favor copie o projeto para esse diretório antes de executar o script."
  exit 1
fi

# Update sources.list to use a different mirror
echo "deb http://archive.ubuntu.com/ubuntu noble main restricted universe multiverse" > /etc/apt/sources.list
echo "deb http://archive.ubuntu.com/ubuntu noble-updates main restricted universe multiverse" >> /etc/apt/sources.list
echo "deb http://archive.ubuntu.com/ubuntu noble-backports main restricted universe multiverse" >> /etc/apt/sources.list
echo "deb http://security.ubuntu.com/ubuntu noble-security main restricted universe multiverse" >> /etc/apt/sources.list

echo "Atualizando pacotes e instalando dependências do sistema..."
apt update
apt install -y python3 python3-venv python3-pip nginx git build-essential

echo "Criando venv e instalando dependências Python..."
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install -r "$PROJECT_DIR/requirements.txt"

# Cria usuário de serviço opcional (recomendado em produção)
if ! id cortinas >/dev/null 2>&1; then
  echo "Criando usuário 'cortinas'..."
  useradd -r -s /usr/sbin/nologin cortinas || true
fi
chown -R cortinas:cortinas "$PROJECT_DIR" || true

# Systemd service
SERVICE_FILE=/etc/systemd/system/${SERVICE_NAME}.service
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Cortinas Bras Gunicorn Service
After=network.target

[Service]
User=cortinas
Group=cortinas
WorkingDirectory=$PROJECT_DIR
Environment="PATH=$VENV_DIR/bin"
# Defina variáveis de ambiente sensíveis no /etc/default/${SERVICE_NAME} (veja README)
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --bind ${GUNICORN_BIND} app:app

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${SERVICE_NAME}.service
systemctl restart ${SERVICE_NAME}.service || true

# Nginx config
cat > "$NGINX_SITE" <<'EOF'
server {
    listen 80;
    server_name _; # substituir por seu domínio

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /opt/meu-projeto/static/;
    }
}
EOF

ln -sf "$NGINX_SITE" "$NGINX_LINK"
nginx -t && systemctl restart nginx

echo "Deploy concluído. Verifique logs do systemd: sudo journalctl -u ${SERVICE_NAME} -f"
echo "Lembre-se de configurar variáveis de ambiente sensíveis (MAIL_USERNAME, MAIL_PASSWORD, SECRET_KEY, PRODUCTION=1, DATABASE_URL) no servidor."
