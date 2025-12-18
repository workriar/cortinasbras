# Build Stage
FROM node:20-slim AS builder
WORKDIR /app
COPY next-app/package*.json ./
RUN npm install
COPY next-app/ .
RUN npm run build

# Production Stage
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
