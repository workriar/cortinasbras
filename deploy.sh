#!/bin/bash

echo "Iniciando deploy..."

# Ativa o ambiente virtual
source /opt/meu-projeto/venv/bin/activate

# Atualiza o código (substitua conforme seu controle de versão)
git pull origin main

# Instala dependências
pip install -r /opt/meu-projeto/requirements.txt

# Testa configuração Nginx
sudo nginx -t

# Reinicia serviços
sudo systemctl restart cortinas-bras.service
sudo systemctl restart nginx

echo "Deploy finalizado com sucesso!"
