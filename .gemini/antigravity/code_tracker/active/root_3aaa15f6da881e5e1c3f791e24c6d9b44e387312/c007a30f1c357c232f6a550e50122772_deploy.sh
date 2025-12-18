�#!/bin/bash

# Script de Deploy Rápido - Cortinas Bresser
# Para uso no EasyPanel via GitHub

echo "🚀 Preparando deploy para EasyPanel..."

# Verificar se está em um repositório git
if [ ! -d .git ]; then
    echo "❌ Não é um repositório git. Inicializando..."
    git init
    git branch -M main
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# Commit
echo "💾 Criando commit..."
read -p "Mensagem do commit: " commit_msg
git commit -m "$commit_msg"

# Verificar se tem remote
if ! git remote | grep -q origin; then
    echo "❌ Remote 'origin' não configurado."
    read -p "URL do repositório GitHub: " repo_url
    git remote add origin $repo_url
fi

# Push
echo "🌐 Enviando para GitHub..."
git push -u origin main

echo "✅ Deploy enviado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse seu EasyPanel"
echo "2. O deploy será automático se configurado"
echo "3. Ou clique em 'Rebuild' no serviço"
echo ""
echo "📖 Guia completo: DEPLOY-EASYPANEL.md"
�"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122file:///root/deploy.sh:file:///root