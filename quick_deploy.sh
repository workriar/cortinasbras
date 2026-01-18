#!/bin/bash
# Quick Deploy Script - Cortinas Brás Next.js
# Este script faz deploy rápido da aplicação Next.js

set -e

echo "🚀 Iniciando deploy rápido do Cortinas Brás Next.js..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se está no diretório correto
if [ ! -d "/root/next-app" ]; then
    echo -e "${RED}❌ Diretório /root/next-app não encontrado${NC}"
    exit 1
fi

# 1. Pull do código mais recente
echo -e "${BLUE}📥 Fazendo pull do código mais recente...${NC}"
cd /root/next-app
git pull origin main

# 2. Criar diretório de dados
echo -e "${BLUE}📁 Preparando diretório de dados...${NC}"
mkdir -p /root/data
if [ -f "/root/next-app/leads.db" ]; then
    cp /root/next-app/leads.db /root/data/leads.db
    echo -e "${GREEN}✅ Banco de dados copiado${NC}"
fi

# 3. Build da imagem Docker
echo -e "${BLUE}🐳 Buildando imagem Docker...${NC}"
cd /root
docker build -t cortinasbras-next:production -f Dockerfile . || {
    echo -e "${RED}❌ Erro no build da imagem${NC}"
    exit 1
}
echo -e "${GREEN}✅ Imagem buildada com sucesso${NC}"

# 4. Parar container antigo (se existir)
echo -e "${BLUE}🛑 Parando container antigo...${NC}"
docker stop cortinas-next-prod 2>/dev/null || echo "Nenhum container antigo encontrado"
docker rm cortinas-next-prod 2>/dev/null || true

# 5. Iniciar novo container
echo -e "${BLUE}🚀 Iniciando novo container...${NC}"
docker run -d \
  --name cortinas-next-prod \
  --restart unless-stopped \
  -p 3001:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e MAIL_SERVER=mail.cronos-painel.com \
  -e MAIL_PORT=465 \
  -e MAIL_USERNAME=loja@cortinasbras.com.br \
  -e MAIL_PASSWORD="${MAIL_PASSWORD:-4LuZr4hrFqeTsrZ@}" \
  -e MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br \
  -e PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
  -e PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  -e DATABASE_URL=sqlite:///data/leads.db \
  -v /root/data:/app/data \
  --health-cmd="node -e \"require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))\"" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  --health-start-period=60s \
  cortinasbras-next:production

echo ""
echo -e "${GREEN}✅ Container iniciado com sucesso!${NC}"
echo ""

# 6. Aguardar inicialização
echo -e "${BLUE}⏳ Aguardando inicialização (10 segundos)...${NC}"
sleep 10

# 7. Testar
echo -e "${BLUE}🧪 Testando aplicação...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>&1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Aplicação respondendo corretamente (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Aplicação retornou HTTP $HTTP_CODE${NC}"
    echo -e "${YELLOW}Verificando logs...${NC}"
    docker logs --tail 20 cortinas-next-prod
fi

echo ""
echo -e "${GREEN}🎉 Deploy concluído!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "1. Verificar logs: docker logs -f cortinas-next-prod"
echo "2. Acessar site: http://localhost ou https://www.cortinasbras.com.br"
echo "3. Testar formulário de contato"
echo "4. Verificar admin: /admin/leads"
echo ""
