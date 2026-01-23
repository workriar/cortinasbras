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
  python3 \
  make \
  g++ \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
FROM base AS deps
WORKDIR /app
COPY prisma ./prisma
RUN npm install

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria
ENV NEXT_TELEMETRY_DISABLED=1

# Gerar Prisma Client
# O schema agora tem binaryTargets que vão funcionar com Debian (debian-openssl-3.0.x ou rhel-openssl-1.0.x dependendo da distro, mas o auto-detect do slim funciona bem)
RUN npx prisma generate

# Build da aplicação
RUN npm run build

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

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]
