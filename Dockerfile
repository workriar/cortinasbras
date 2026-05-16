# Dockerfile para Next.js - Cortinas Brás
# PDF gerado com PDFKit (Node.js puro) — sem Chromium/Puppeteer
FROM node:20-slim AS base

# Dependências essenciais: OpenSSL (Prisma) + fontes Liberation (PDFKit TTF, sem AFM)
RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

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

# PDFKit resolve fontes .afm via __dirname do chunk bundlado.
# Como o Next.js bunda o código em .next/server/chunks/, o PDFKit
# vai procurar os dados lá. Copiamos explicitamente após o build.
RUN mkdir -p .next/server/chunks/data && \
    cp -r node_modules/pdfkit/js/data/. .next/server/chunks/data/

# ─── Runner (produção) ───────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NPM_CONFIG_CACHE=/tmp/.npm

# Criar usuário não-root
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Criar diretório de dados
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

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

CMD ["npm", "start"]
