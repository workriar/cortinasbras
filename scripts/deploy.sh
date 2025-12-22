#!/bin/bash

# Script de Deploy para Produção - Cortinas Brás
# Este script atualiza o código e reinicia a aplicação

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy da aplicação Cortinas Brás..."
echo ""

# 1. Pull das alterações
echo "📥 1. Baixando alterações do GitHub..."
git pull origin main
echo "✅ Código atualizado"
echo ""

# 2. Parar containers
echo "🛑 2. Parando containers..."
docker-compose down
echo "✅ Containers parados"
echo ""

# 3. Rebuild (sem cache para garantir que usa o código mais recente)
echo "🔨 3. Reconstruindo imagem Docker..."
docker-compose build --no-cache
echo "✅ Imagem reconstruída"
echo ""

# 4. Iniciar containers
echo "▶️  4. Iniciando containers..."
docker-compose up -d
echo "✅ Containers iniciados"
echo ""

# 5. Aguardar alguns segundos
echo "⏳ Aguardando inicialização..."
sleep 10
echo ""

# 6. Verificar status
echo "📊 5. Verificando status..."
docker-compose ps
echo ""

# 7. Mostrar logs
echo "📋 6. Últimas linhas do log:"
docker-compose logs --tail=50
echo ""

echo "✅ Deploy concluído!"
echo ""
echo "📝 Próximos passos:"
echo "   - Verifique os logs: docker-compose logs -f"
echo "   - Teste o site: https://cortinasbras.com.br"
echo "   - Teste o formulário"
echo ""
