#!/bin/bash
# Deploy automático para projeto Python com ambiente virtual e Gunicorn

PROJETO_DIR=/root/meu-projeto
VENV_DIR=$PROJETO_DIR/venv
REPO_URL=https://github.com/workriar/cortinasbras.git
SERVICE_NAME=cortinasbras
APP_MODULE=app:app   # app.py e a variável app do Flask

# Se a pasta do projeto não existir, clona o repositório
if [ ! -d "$PROJETO_DIR" ]; then
  echo "Clonando repositório..."
  git clone $REPO_URL $PROJETO_DIR
fi

cd $PROJETO_DIR

echo "Atualizando código..."
git pull origin main

# Criar ambiente virtual se não existir
if [ ! -d "$VENV_DIR" ]; then
  echo "Criando ambiente virtual..."
  python3 -m venv $VENV_DIR
fi

echo "Ativando ambiente virtual..."
source $VENV_DIR/bin/activate

echo "Instalando dependências..."
pip install -r requirements.txt

echo "Reiniciando serviço systemd..."
sudo systemctl restart $SERVICE_NAME

echo "Deploy finalizado com sucesso."
