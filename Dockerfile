# Build Stage
FROM node:20-slim AS builder

# Instalar dependências do Puppeteer para build
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY next-app/package*.json ./
RUN npm ci --only=production
COPY next-app/ .
RUN npm run build

# Production Stage
FROM node:20-slim AS runner

# Instalar dependências do Puppeteer no runtime
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-dejavu-core \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
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
