#!/usr/bin/env bash
set -euo pipefail

# fix_gunicorn_and_install.sh
# Instala dependências no venv, testa gunicorn em /opt/meu-projeto/meu-projeto
# e, se o teste for bem-sucedido, atualiza o unit file do systemd para usar --chdir
# Uso:
# sudo bash /root/meu-projeto/fix_gunicorn_and_install.sh

PROJECT_ROOT=/opt/meu-projeto
APP_SUBDIR=${PROJECT_ROOT}/meu-projeto
VENV=${PROJECT_ROOT}/venv
REQUIREMENTS=${APP_SUBDIR}/requirements.txt
GUNICORN_BIN=${VENV}/bin/gunicorn

echo "[info] Script iniciando — verifique que está rodando como root (ou com sudo)."

if [ ! -d "$PROJECT_ROOT" ]; then
  echo "[error] Projeto não encontrado em $PROJECT_ROOT"
  exit 1
fi

if [ ! -d "$APP_SUBDIR" ]; then
  echo "[error] Subdiretório do app não encontrado: $APP_SUBDIR"
  exit 1
fi

echo "[1/6] Ativando virtualenv e instalando dependências"
if [ ! -d "$VENV" ]; then
  echo "[info] Virtualenv não existe em $VENV — criando..."
  python3 -m venv "$VENV"
fi

source "$VENV/bin/activate"
pip install --upgrade pip setuptools wheel

if [ -f "$REQUIREMENTS" ]; then
  echo "[info] Instalando a partir de $REQUIREMENTS"
  pip install -r "$REQUIREMENTS"
else
  echo "[warn] requirements.txt não encontrado em $REQUIREMENTS — instalando pacotes mínimos"
  pip install Flask Flask-Mail Flask-SQLAlchemy reportlab gunicorn
fi

echo "[2/6] Verificando se gunicorn está disponível"
if [ ! -x "$GUNICORN_BIN" ]; then
  echo "[warn] Gunicorn não encontrado em $GUNICORN_BIN após instalação — checando PATH"
fi

echo "[3/6] Teste rápido: iniciar gunicorn em background e checar resposta"
TEST_LOG=/tmp/gunicorn_test.log
TEST_PID_FILE=/tmp/gunicorn_test.pid
rm -f "$TEST_LOG" "$TEST_PID_FILE"

cd "$APP_SUBDIR"
nohup "$GUNICORN_BIN" --chdir "$APP_SUBDIR" --workers 1 --bind 127.0.0.1:8000 app:app &> "$TEST_LOG" &
echo $! > "$TEST_PID_FILE"
echo "[info] Gunicorn de teste iniciado (pid=$(cat $TEST_PID_FILE)), esperando 3s..."
sleep 3

if curl -sS -I http://127.0.0.1:8000 | head -n1 | grep -qE "HTTP/[0-9\.]+ [23].."; then
  echo "[ok] Gunicorn respondeu com código 2xx/3xx — teste bem-sucedido"
  TEST_OK=1
else
  echo "[fail] Gunicorn não respondeu corretamente — checando logs"
  TEST_OK=0
  echo "--- tail $TEST_LOG ---"
  tail -n 200 "$TEST_LOG" || true
fi

echo "[4/6] Limpando processo de teste"
if [ -f "$TEST_PID_FILE" ]; then
  kill "$(cat $TEST_PID_FILE)" >/dev/null 2>&1 || true
  sleep 1
  rm -f "$TEST_PID_FILE"
fi

deactivate || true

if [ "$TEST_OK" -ne 1 ]; then
  echo "[error] Teste falhou — não aplicarei alterações no systemd. Corrija o erro acima e reexecute este script." 
  exit 1
fi

echo "[5/6] Aplicando unit file do systemd (WorkingDirectory e --chdir apontando para $APP_SUBDIR)"
sudo tee /etc/systemd/system/cortinas-bras.service > /dev/null <<EOF
[Unit]
Description=Cortinas Bras Gunicorn Service
After=network.target

[Service]
User=cortinas
Group=cortinas
WorkingDirectory=$APP_SUBDIR
EnvironmentFile=/etc/default/cortinas-bras
ExecStart=$GUNICORN_BIN --chdir $APP_SUBDIR --workers 3 --bind 127.0.0.1:8000 app:app
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

echo "[6/6] Recarregando systemd e reiniciando serviço"
sudo systemctl daemon-reload
sudo systemctl enable --now cortinas-bras.service || true
sudo systemctl restart cortinas-bras.service || true
sudo systemctl status cortinas-bras.service --no-pager -l || true

echo "Concluído. Se houver problemas, consulte o journal: sudo journalctl -u cortinas-bras -f"
exit 0
