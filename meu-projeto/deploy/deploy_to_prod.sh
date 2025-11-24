#!/bin/bash
# Script para sincronizar alterações do projeto para o diretório de produção e reiniciar o Gunicorn

SRC="/root/meu-projeto/"
DST="/opt/meu-projeto/"

# Sincroniza arquivos do projeto (exceto venv, __pycache__, node_modules, backups)
rsync -av --delete --exclude='venv' --exclude='__pycache__' --exclude='node_modules' --exclude='backups' "$SRC" "$DST"

# Reinicia o serviço Gunicorn (ajuste o nome do serviço se necessário)
systemctl restart gunicorn || systemctl restart meu-projeto || echo "⚠️ Não foi possível reiniciar o Gunicorn automaticamente. Reinicie manualmente se necessário."

echo "Deploy concluído."
