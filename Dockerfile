# Build Stage
FROM node:20-slim AS builder

# Instalar dependências básicas para build
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Production Stage
FROM node:20-slim AS runner

# Instalar Chromium e dependências para Puppeteer
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  fonts-dejavu-core \
  fontconfig \
  ca-certificates \
  libnss3 \
  libatk-bridge2.0-0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libxshmfence1 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Configurar ambiente de produção
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copiar arquivos do build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Criar diretório para banco de dados
RUN mkdir -p /app/data && chown -R node:node /app

# Usar usuário não-root
USER node

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
