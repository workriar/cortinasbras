#!/usr/bin/env bash
set -euo pipefail

# post_deploy_safe.sh
# Uso (no servidor):
# sudo DOMAIN=your.domain EMAIL=you@domain.com bash /opt/meu-projeto/post_deploy_safe.sh
# Versão conservadora do post_deploy_all: NÃO habilita UFW nem executa Certbot.
# O script faz:
# - garante requirements.txt
# - cria/atualiza virtualenv e instala dependências
# - ajusta permissões e cria usuário de serviço (cortinas)
# - cria /etc/default/cortinas-bras com placeholders
# - recarrega systemd e reinicia o serviço cortinas-bras
# - testa endpoints localmente
# NOTAS: ações de firewall e emissão de certificados são mostradas como instruções mas NÃO serão executadas.

PROJECT_DIR=${PROJECT_DIR:-/opt/meu-projeto}
DOMAIN=${DOMAIN:-}
EMAIL=${EMAIL:-}

echo "Script conservador: não habilita firewall nem solicita certificados automaticamente."

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "\nUsage: sudo DOMAIN=your.domain EMAIL=you@domain.com bash $0\n"
  echo "You can set DOMAIN and EMAIL to let the script print the suggested certbot command (it won't run it)."
  # continue without domain/email
fi

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Projeto não encontrado em $PROJECT_DIR"
  exit 1
fi

echo "[1/6] Preparando requirements.txt (se necessário)"
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

echo "[2/6] Criando/atualizando virtualenv e instalando dependências"
python3 -m venv "$PROJECT_DIR/venv" || true
source "$PROJECT_DIR/venv/bin/activate"
pip install --upgrade pip setuptools wheel
pip install -r "$PROJECT_DIR/requirements.txt"
deactivate

echo "[3/6] Ajustando permissões e usuário de serviço"
if ! id cortinas >/dev/null 2>&1; then
  sudo useradd -r -s /usr/sbin/nologin cortinas || true
  echo "usuario cortinas criado"
fi
sudo chown -R cortinas:cortinas "$PROJECT_DIR"

echo "[4/6] Criando arquivo de variáveis de ambiente em /etc/default/cortinas-bras (modelo)"
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

echo "[5/6] Recarregando systemd e reiniciando serviço cortinas-bras"
sudo systemctl daemon-reload
sudo systemctl enable --now cortinas-bras.service || true
sudo systemctl restart cortinas-bras.service || true
sudo systemctl status cortinas-bras.service --no-pager -l || true

echo "[6/6] Testes e instruções manuais"
echo "Teste Gunicorn (127.0.0.1:8000):"
curl -I http://127.0.0.1:8000 || true
echo "Teste via Nginx (localhost):"
curl -I http://127.0.0.1/ || true

if [ -n "$DOMAIN" ]; then
  echo "---"
  echo "Sugestão (não executada): emitir certificado com certbot quando DNS apontar para o servidor:"
  echo "sudo apt update && sudo apt install -y certbot python3-certbot-nginx"
  echo "sudo certbot --nginx -d $DOMAIN -m $EMAIL --agree-tos --no-eff-email --redirect"
  echo "---"
fi

echo "Sugestão manual para UFW (não executado por este script):"
echo "sudo apt install -y ufw"
echo "sudo ufw allow OpenSSH"
echo "sudo ufw allow 'Nginx Full'"
echo "sudo ufw enable"

echo "Concluído. Revise /etc/default/cortinas-bras e os logs (journalctl -u cortinas-bras -f, journalctl -u nginx -f)."

exit 0
