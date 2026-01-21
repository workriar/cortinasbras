#!/bin/bash
set -e

# Ensure data directory exists
mkdir -p /root/data

echo "🚀 Building Docker image..."
docker build -t cortinasbras-next:production .

echo "🛑 Stopping old container..."
docker stop cortinas-next-prod || true
docker rm cortinas-next-prod || true

echo "🚀 Starting new container..."
docker run -d \
  --name cortinas-next-prod \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="file:/app/data/leads.db" \
  -e NEXTAUTH_URL="https://www.cortinasbras.com.br" \
  -e NEXTAUTH_SECRET="supersecretkey123456789abcdef" \
  -e NEXT_PUBLIC_SITE_URL="https://www.cortinasbras.com.br" \
  -e MAIL_SERVER="smtp.hostinger.com" \
  -e MAIL_PORT=465 \
  -e MAIL_USE_SSL="true" \
  -e MAIL_USERNAME="loja@cortinasbras.com.br" \
  -e MAIL_PASSWORD="4LuZr4hrFqeTsrZ@" \
  -e MAIL_DEFAULT_SENDER="loja@cortinasbras.com.br" \
  -e MAIL_NOTIFICATION_TO="cortinasbras@gmail.com" \
  -e PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium" \
  -e PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true" \
  -v /root/data:/app/data \
  cortinasbras-next:production

echo "✅ Deployment successful!"
