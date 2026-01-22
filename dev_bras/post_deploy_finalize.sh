#!/usr/bin/env bash
set -euo pipefail

# post_deploy_finalize.sh
# Interactive finalization script for deployment.
# - Backups and writes /etc/default/cortinas-bras with secure permissions
# - Reloads systemd and restarts the cortinas-bras service
# - Optionally runs certbot to obtain TLS certs (requires domain & email)
# - Shows UFW and service status checks
# Usage: sudo bash post_deploy_finalize.sh

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root or with sudo: sudo bash $0"
  exit 1
fi

echo "This script will update /etc/default/cortinas-bras, reload systemd, and optionally run certbot."
read -r -p "Proceed? [y/N]: " proceed
if [[ ! "$proceed" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

BACKUP_DIR=/root/meu-projeto/backups
mkdir -p "$BACKUP_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
if [ -f /etc/default/cortinas-bras ]; then
  cp /etc/default/cortinas-bras "$BACKUP_DIR/cortinas-bras.env.$TS.bak"
  echo "Backup saved to $BACKUP_DIR/cortinas-bras.env.$TS.bak"
fi

echo
echo "Enter values to write to /etc/default/cortinas-bras. Leave blank to keep default/empty fields."
read -r -p "MAIL_USERNAME: " MAIL_USERNAME
read -r -s -p "MAIL_PASSWORD (input hidden): " MAIL_PASSWORD
echo
read -r -p "MAIL_DEFAULT_SENDER [contato@cortinasbras.com.br]: " MAIL_DEFAULT_SENDER
MAIL_DEFAULT_SENDER=${MAIL_DEFAULT_SENDER:-contato@cortinasbras.com.br}
read -r -p "SECRET_KEY (a long random string recommended): " SECRET_KEY
read -r -p "Use production mode? (leave empty for ON) [y/N]: " prod_reply
if [[ "$prod_reply" =~ ^[Yy]$ ]]; then
  PRODUCTION=1
else
  PRODUCTION=1
fi
read -r -p "DATABASE_URL [sqlite:////opt/meu-projeto/leads.db]: " DATABASE_URL
DATABASE_URL=${DATABASE_URL:-sqlite:////opt/meu-projeto/leads.db}

echo "Writing /etc/default/cortinas-bras (permissions 600)..."
cat > /etc/default/cortinas-bras <<EOF
# Variáveis de ambiente para o serviço cortinas-bras
# Created: $TS
MAIL_USERNAME='${MAIL_USERNAME}'
MAIL_PASSWORD='${MAIL_PASSWORD}'
MAIL_DEFAULT_SENDER='${MAIL_DEFAULT_SENDER}'
SECRET_KEY='${SECRET_KEY}'
PRODUCTION=${PRODUCTION}
DATABASE_URL='${DATABASE_URL}'
EOF

chmod 600 /etc/default/cortinas-bras
chown root:root /etc/default/cortinas-bras
echo "/etc/default/cortinas-bras written."

echo "Reloading systemd and restarting cortinas-bras.service..."
systemctl daemon-reload
systemctl restart cortinas-bras.service || true
systemctl status cortinas-bras.service --no-pager -l

echo
echo "Check application (Gunicorn) on 127.0.0.1:8000"
curl -I http://127.0.0.1:8000 || true

read -r -p "Do you want to (re)issue TLS cert with Certbot now? (requires DNS A record to point to this server) [y/N]: " CERT
if [[ "$CERT" =~ ^[Yy]$ ]]; then
  read -r -p "Enter domain (example: cortinasbras.com.br): " DOMAIN
  read -r -p "Enter email for Let's Encrypt notifications: " EMAIL
  if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Domain and email are required for certbot. Skipping cert issuance."
  else
    apt update
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" -m "$EMAIL" --agree-tos --no-eff-email --redirect || true
  fi
fi

echo
echo "UFW status (if installed):"
if command -v ufw >/dev/null 2>&1; then
  ufw status verbose
else
  echo "UFW not installed. To install: sudo apt install -y ufw"
fi

echo
echo "Final sanity checks (last lines of journals):"
echo "---- cortinas-bras (last 50 lines) ----"
journalctl -u cortinas-bras -n 50 --no-hostname || true
echo "---- nginx (last 50 lines) ----"
journalctl -u nginx -n 50 --no-hostname || true

echo
echo "Done. If you ran certbot, verify the site via https://$DOMAIN/ from a browser."
exit 0
