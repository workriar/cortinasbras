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
GUNICORN_BIND=${GUNICORN_BIND:-0.0.0.0:8000}
SYSTEM_USER=${SYSTEM_USER:-cortinas}

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Projeto não encontrado em $PROJECT_DIR"
  echo "Por favor copie o projeto para esse diretório antes de executar o script."
  exit 1
fi

echo "Atualizando pacotes e instalando dependências do sistema..."
apt update
apt install -y python3 python3-venv python3-pip git build-essential

echo "Criando venv e instalando dependências Python..."
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"
pip install --upgrade pip wheel
pip install -r "$PROJECT_DIR/requirements.txt"

# Cria usuário de serviço opcional (recomendado em produção)
if ! id "$SYSTEM_USER" >/dev/null 2>&1; then
  echo "Criando usuário '$SYSTEM_USER'..."
  useradd -r -s /usr/sbin/nologin "$SYSTEM_USER" || true
fi
chown -R "$SYSTEM_USER":"$SYSTEM_USER" "$PROJECT_DIR" || true

# Systemd service
SERVICE_FILE=/etc/systemd/system/${SERVICE_NAME}.service
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Cortinas Bras Gunicorn Service
After=network.target

[Service]
User=$SYSTEM_USER
Group=$SYSTEM_USER
WorkingDirectory=$PROJECT_DIR
Environment="PATH=$VENV_DIR/bin"
# Defina variáveis de ambiente sensíveis no /etc/default/${SERVICE_NAME} (veja README)
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --bind ${GUNICORN_BIND} app:app
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${SERVICE_NAME}.service
systemctl restart ${SERVICE_NAME}.service || true

# Opcional: desabilita Nginx para evitar conflitos com proxies externos (ex.: Traefik)
if systemctl list-unit-files | grep -q '^nginx.service'; then
  if systemctl is-enabled nginx >/dev/null 2>&1; then
    echo "Desabilitando serviço nginx para evitar conflitos nas portas 80/443..."
    systemctl disable --now nginx || true
  fi
fi

echo "Deploy concluído. Verifique logs do systemd: sudo journalctl -u ${SERVICE_NAME} -f"
echo "Lembre-se de configurar variáveis de ambiente sensíveis (MAIL_USERNAME, MAIL_PASSWORD, SECRET_KEY, PRODUCTION=1, DATABASE_URL) no servidor."
