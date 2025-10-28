#!/usr/bin/env bash
set -euo pipefail

# post_deploy_all.sh
# Uso (no servidor):
# sudo DOMAIN=your.domain EMAIL=you@domain.com bash /opt/meu-projeto/post_deploy_all.sh
# Este script tenta automatizar os passos finais do deploy:
# - cria/atualiza requirements.txt se necessário
# - cria virtualenv e instala dependências
# - ajusta permissões
# - cria um arquivo de variáveis de ambiente em /etc/default/cortinas-bras (modelo)
# - recarrega systemd e reinicia o serviço
# - instala Certbot e emite certificado TLS para o domínio (se DNS apontar)
# - configura firewall (UFW) e testa a aplicação

PROJECT_DIR=${PROJECT_DIR:-/opt/meu-projeto}
DOMAIN=${DOMAIN:-}
EMAIL=${EMAIL:-}

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "\nUsage: sudo DOMAIN=your.domain EMAIL=you@domain.com bash $0\n"
  exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Projeto não encontrado em $PROJECT_DIR"
  exit 1
fi

echo "[1/9] Preparando requirements.txt (se necessário)"
if [ ! -f "$PROJECT_DIR/requirements.txt" ]; then
  cat > "$PROJECT_DIR/requirements.txt" <<'EOF'
Flask==2.2.5
Flask-Mail==0.9.1
Flask-SQLAlchemy==3.0.2
reportlab==3.6.12
gunicorn==20.1.0
EOF
  echo "requirements.txt criado"
else
  echo "requirements.txt já existe, pulando criação"
fi

echo "[2/9] Criando virtualenv e instalando dependências"
python3 -m venv "$PROJECT_DIR/venv" || true
source "$PROJECT_DIR/venv/bin/activate"
pip install --upgrade pip setuptools wheel
pip install -r "$PROJECT_DIR/requirements.txt"
deactivate

echo "[3/9] Ajustando permissões e usuário de serviço"
if ! id cortinas >/dev/null 2>&1; then
  sudo useradd -r -s /usr/sbin/nologin cortinas || true
  echo "usuario cortinas criado"
fi
sudo chown -R cortinas:cortinas "$PROJECT_DIR"

echo "[4/9] Criando arquivo de variáveis de ambiente em /etc/default/cortinas-bras"
sudo tee /etc/default/cortinas-bras > /dev/null <<EOF
# Variáveis de ambiente para o serviço cortinas-bras
# Edite este arquivo para adicionar credenciais seguras (NÃO comite em repositórios)
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
SECRET_KEY='troque_por_uma_chave_segura'
PRODUCTION=1
DATABASE_URL='sqlite:////opt/meu-projeto/leads.db'
EOF
sudo chmod 600 /etc/default/cortinas-bras

echo "[5/9] Recarregando systemd e reiniciando serviço cortinas-bras"
sudo systemctl daemon-reload
sudo systemctl enable --now cortinas-bras.service || true
sudo systemctl restart cortinas-bras.service || true
sudo systemctl status cortinas-bras.service --no-pager -l

echo "[6/9] Instalando Certbot e obtendo TLS para $DOMAIN (se possível)"
sudo apt update
sudo apt install -y certbot python3-certbot-nginx || true

if sudo certbot certificates | grep -q "$DOMAIN"; then
  echo "Certificado já existe para $DOMAIN"
else
  # tenta emitir certificado (não funcionará se DNS não apontar)
  sudo certbot --nginx -d "$DOMAIN" -m "$EMAIL" --agree-tos --no-eff-email --redirect --non-interactive || true
fi

echo "[7/9] Configurando UFW (firewall)"
sudo apt install -y ufw || true
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full' || true
sudo ufw --force enable || true
sudo ufw status verbose

echo "[8/9] Testando endpoints localmente"
echo "Teste Gunicorn (127.0.0.1:8000):"
curl -I http://127.0.0.1:8000 || true
echo "Teste via Nginx (localhost):"
curl -I http://127.0.0.1/ || true
echo "Teste via domínio (https):"
curl -I https://$DOMAIN/ || true

echo "[9/9] Pronto. Verifique os logs e adapte /etc/default/cortinas-bras com valores reais."
echo "Ver logs do app: sudo journalctl -u cortinas-bras -f"
echo "Ver logs do nginx: sudo journalctl -u nginx -f"

exit 0
#!/usr/bin/env bash
# post_deploy_all.sh
# Script de pós-deploy para VPS - configures env file, UFW, Certbot (HTTPS), and restarts services.
# USO (no VPS, como root):
# sudo DOMAIN=cortinasbras.com.br EMAIL=you@domain.com bash /opt/meu-projeto/post_deploy_all.sh

set -euo pipefail

DOMAIN=${DOMAIN:-}
EMAIL=${EMAIL:-}
PROJECT_DIR=${PROJECT_DIR:-/opt/meu-projeto}
SERVICE_NAME=${SERVICE_NAME:-cortinas-bras}
ENV_FILE=/etc/default/${SERVICE_NAME}

if [ "$EUID" -ne 0 ]; then
  echo "Este script deve ser executado como root (use sudo)." >&2
  exit 1
fi

echo "Pós-deploy: iniciando configuração (diretório do projeto: $PROJECT_DIR)"

# 1) Criar arquivo de environment se não existir (com placeholders)
if [ ! -f "$ENV_FILE" ]; then
  echo "Criando arquivo de variáveis em $ENV_FILE (verifique e preencha valores sensíveis)..."
  cat > "$ENV_FILE" <<EOF
# Variáveis de ambiente para o serviço cortinas-bras
# Exemplo:
# MAIL_USERNAME=seu-email@dominio.com
# MAIL_PASSWORD='senha-segura'
# SECRET_KEY='uma_chave_secreta_aqui'
# PRODUCTION=1
# DATABASE_URL='sqlite:////opt/meu-projeto/leads.db'
EOF
  chmod 640 "$ENV_FILE"
  echo "Arquivo criado. Edite $ENV_FILE e adicione MAIL_USERNAME e MAIL_PASSWORD antes de reiniciar o serviço." 
else
  echo "$ENV_FILE já existe — edite se precisar atualizar variáveis.
"
fi

# 2) Atualizar pacotes e instalar ferramentas necessárias
echo "Atualizando apt e instalando certbot/ufw (se necessário)..."
apt update -y
apt install -y certbot python3-certbot-nginx ufw || true

# 3) Configurar UFW (abre SSH e Nginx Full)
if command -v ufw >/dev/null 2>&1; then
  echo "Configurando UFW (OpenSSH, Nginx Full)..."
  ufw allow OpenSSH || true
  ufw allow 'Nginx Full' || true
  # habilitar apenas se ainda não ativo
  if ufw status | grep -iq inactive; then
    echo "Ativando UFW..."
    ufw --force enable
  fi
  ufw status verbose
else
  echo "UFW não encontrado, pulando etapa de firewall."
fi

# 4) Testar nginx e reiniciar
if command -v nginx >/dev/null 2>&1; then
  echo "Testando configuração do nginx..."
  nginx -t
  systemctl restart nginx || true
  systemctl status nginx --no-pager -l | sed -n '1,8p'
else
  echo "Nginx não instalado. Instale nginx antes de usar Certbot." >&2
fi

# 5) Certbot (HTTPS) - requer DOMAIN e EMAIL
if [ -n "$DOMAIN" ] && [ -n "$EMAIL" ]; then
  echo "Tentando obter/renovar certificado para: $DOMAIN (email: $EMAIL)"
  # cria backups e tenta obter com plugin nginx
  certbot --nginx -n --agree-tos --redirect --email "$EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" || {
    echo "Certbot falhou — verifique DNS apontando para este servidor e reexecute manualmente." >&2
  }
else
  echo "DOMAIN e/ou EMAIL não informados. Pulando instalação do certificado."
  echo "Para gerar: sudo DOMAIN=seu_dominio EMAIL=you@domain.com bash $0"
fi

# 6) Recarregar unit e reiniciar serviço da aplicação
echo "Recarregando systemd e reiniciando serviço $SERVICE_NAME..."
# garantir que environment seja lido por systemd - cria drop-in que referencia /etc/default
SYSTEMD_DROP=/etc/systemd/system/${SERVICE_NAME}.service.d
mkdir -p "$SYSTEMD_DROP"
cat > "$SYSTEMD_DROP/environment.conf" <<EOF
[Service]
EnvironmentFile=$ENV_FILE
EOF
systemctl daemon-reload
systemctl restart "$SERVICE_NAME" || true
systemctl status "$SERVICE_NAME" --no-pager -l | sed -n '1,12p'

# 7) Recomendações finais
cat <<EOF
Pós-deploy concluído (passo automático). Ações recomendadas (manuais):
 - Edite $ENV_FILE e adicione MAIL_USERNAME e MAIL_PASSWORD e SECRET_KEY.
 - Verifique se o certificado foi emitido corretamente (https://$DOMAIN) e ajuste DNS se necessário.
 - Configure backups regulares do banco (leads.db se estiver usando sqlite).
 - Verifique logs do serviço: sudo journalctl -u $SERVICE_NAME -f
EOF

exit 0
