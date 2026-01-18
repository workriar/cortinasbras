#!/bin/bash

# Script para corrigir automaticamente as URLs do Traefik
# Executa a cada minuto via cron

CONFIG_FILE="/etc/easypanel/traefik/config/main.yaml"
BACKUP_FILE="/etc/easypanel/traefik/config/main.yaml.backup-auto"

# Fazer backup
cp "$CONFIG_FILE" "$BACKUP_FILE"

# Corrigir as 3 URLs
sed -i 's|http://bresser_app_cortinas-bresser:80/|http://cortinas-bresser:80/|g' "$CONFIG_FILE"
sed -i 's|http://cortinasbras_cortinasbras:3000/|http://cortinasbras:3000/|g' "$CONFIG_FILE"
sed -i 's|http://relluarte_relluarte:8080/|http://relluarte:8080/|g' "$CONFIG_FILE"

# Recarregar Traefik
TRAEFIK_CONTAINER=$(docker ps --filter "name=traefik" --format "{{.ID}}" | head -1)
if [ ! -z "$TRAEFIK_CONTAINER" ]; then
    docker kill --signal=HUP "$TRAEFIK_CONTAINER"
    echo "[$(date)] URLs corrigidas e Traefik recarregado"
else
    echo "[$(date)] ERRO: Container Traefik não encontrado"
fi
