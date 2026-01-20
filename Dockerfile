# Dockerfile para Next.js - Cortinas Brás
# Usando Debian (slim) para melhor compatibilidade com Prisma e Puppeteer
FROM node:20-slim AS base

# Instalar dependências do sistema
# openssl, ca-certificates para Prisma/NextAuth
# chromium para Puppeteer
# procps para monitoramento
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  chromium \
  procps \
  && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
FROM base AS deps
RUN npm ci

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria
ENV NEXT_TELEMETRY_DISABLED=1

# Otimização de memória para o build
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build da aplicação (o script build já inclui prisma generate)

# Build da aplicação
RUN npm run build
RUN ls -la /app/.next || echo ".next not found"
RUN ls -la /app/public || echo "public not found"

# Runner
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Criar diretório de dados
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs leads.db /app/leads.db.seed
COPY --chown=nextjs:nodejs scripts/start-production.sh /app/scripts/start-production.sh

USER root
RUN chmod +x /app/scripts/start-production.sh
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/leads.db"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["/app/scripts/start-production.sh"]
