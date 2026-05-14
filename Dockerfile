# Dockerfile para Next.js - Cortinas Brás
# Usando Debian (slim) para melhor compatibilidade com Prisma e Puppeteer
FROM node:20-slim AS base

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  chromium \
  chromium-common \
  fonts-liberation \
  fonts-noto-color-emoji \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  procps \
  python3 \
  make \
  g++ \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar o Chromium do sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROMIUM_PATH=/usr/bin/chromium

WORKDIR /app

# ─── Instalar dependências ───────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# ─── Build da aplicação ──────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Gerar Prisma Client
RUN npx prisma generate

# Cache bust para forçar rebuild dos assets
ARG CACHE_BUST=1

# Build Next.js (gera .next/ com todos os assets estáticos)
RUN npm run build

# ─── Runner (produção) ───────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_CACHE=/tmp/.npm

# Criar usuário não-root
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Criar diretório de dados e cache do Puppeteer
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data
RUN mkdir -p /home/nextjs/.cache && chown -R nextjs:nodejs /home/nextjs

# Dar permissão ao chromium para rodar sem sandbox (necessário em containers)
RUN chmod 4755 /usr/bin/chromium || true

# Copiar tudo necessário para produção
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=deps    --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Usar npm start contorna problemas com symlinks quebrados no .bin/next pelo Docker COPY
CMD ["npm", "start"]
