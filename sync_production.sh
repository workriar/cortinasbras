#!/bin/bash

# Script de Sincronização - Produção
# Sincroniza alterações locais com o ambiente de produção

set -e

echo "🔄 Iniciando sincronização com produção..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está em um repositório git
if [ ! -d .git ]; then
    echo -e "${RED}❌ Erro: Não é um repositório git${NC}"
    exit 1
fi

# Mostrar status atual
echo -e "${BLUE}📊 Status atual:${NC}"
git status --short
echo ""

# Verificar se há alterações
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Não há alterações para sincronizar${NC}"
    echo ""
    echo -e "${BLUE}📋 Verificando se há commits para enviar...${NC}"
    
    # Verificar se há commits não enviados
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
    
    if [ -z "$REMOTE" ]; then
        echo -e "${YELLOW}⚠️  Não foi possível verificar o remote${NC}"
    elif [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}✅ Tudo sincronizado com o remote!${NC}"
        exit 0
    else
        echo -e "${YELLOW}📤 Há commits locais para enviar${NC}"
        git log @{u}..@ --oneline
        echo ""
        read -p "Deseja enviar estes commits? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            git push origin main
            echo -e "${GREEN}✅ Commits enviados com sucesso!${NC}"
        fi
        exit 0
    fi
fi

# Mostrar arquivos modificados
echo -e "${YELLOW}📝 Arquivos modificados:${NC}"
git status --short
echo ""

# Perguntar se deseja continuar
read -p "Deseja adicionar estas alterações? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Sincronização cancelada${NC}"
    exit 0
fi

# Adicionar arquivos
echo -e "${BLUE}📦 Adicionando arquivos...${NC}"
git add .

# Solicitar mensagem de commit
echo ""
echo -e "${YELLOW}💬 Digite a mensagem do commit:${NC}"
read -p "> " commit_msg

# Se não forneceu mensagem, usar padrão
if [ -z "$commit_msg" ]; then
    commit_msg="Sincronização com produção - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Fazer commit
echo -e "${BLUE}💾 Criando commit...${NC}"
git commit -m "$commit_msg"

# Verificar remote
if ! git remote | grep -q origin; then
    echo -e "${RED}❌ Remote 'origin' não configurado${NC}"
    exit 1
fi

# Push para o repositório
echo -e "${BLUE}🌐 Enviando para GitHub...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✅ Sincronização concluída com sucesso!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "1. ✅ Alterações enviadas para GitHub"
echo "2. 🔄 EasyPanel detectará automaticamente as mudanças"
echo "3. 🚀 Deploy automático será iniciado"
echo ""
echo -e "${YELLOW}💡 Dica: Monitore o deploy no painel do EasyPanel${NC}"
echo ""
