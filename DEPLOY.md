# 🚀 Deploy Rápido - Cortinas Brás

Guia rápido para fazer deploy da aplicação em produção.

## ⚡ TL;DR (Resumo Executivo)

```bash
# 1. Clone e configure
git clone <repo-url> cortinas-app
cd cortinas-app
cp .env.example .env
nano .env  # Configure as variáveis

# 2. Deploy com Docker
docker-compose build --no-cache
docker-compose up -d

# 3. Verifique
docker-compose logs -f
curl http://localhost:3000
```

## 📋 Pré-requisitos

- ✅ Docker 20.10+ e Docker Compose 2.0+
- ✅ Servidor Linux (Ubuntu/Debian recomendado)
- ✅ Credenciais SMTP (Hostinger ou outro)
- ✅ Domínio configurado (opcional, mas recomendado)

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e edite:

```bash
cp .env.example .env
```

**Variáveis obrigatórias:**

```env
# Site
NEXT_PUBLIC_SITE_URL=https://cortinasbras.com.br

# Email (Hostinger)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=sua-senha-aqui
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br

# Database (já configurado no Docker)
DATABASE_URL=sqlite:/app/data/leads.db
```

### 2. Build e Deploy

```bash
# Build da imagem
docker-compose build --no-cache

# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 3. Verificação

```bash
# Verificar status
docker-compose ps

# Testar endpoint
curl http://localhost:3000

# Verificar saúde do container
docker inspect --format='{{json .State.Health}}' cortinas-app | jq
```

## 🔍 Verificação Completa

Execute o script de verificação:

```bash
# Dentro do container
docker exec -it cortinas-app npm run verify

# Ou localmente
npm run verify
```

Este script verifica:
- ✅ Variáveis de ambiente
- ✅ Chromium instalado
- ✅ Banco de dados
- ✅ Geração de PDF
- ✅ Servidor HTTP

## 🐛 Troubleshooting

### Erro: "Could not find Chrome"

**Solução:** Reconstrua a imagem Docker

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Erro: "PDF generation failed"

**Verificar Chromium no container:**

```bash
docker exec -it cortinas-app which chromium-browser
# Deve retornar: /usr/bin/chromium-browser
```

**Se não encontrar:**

```bash
docker exec -it cortinas-app apk add --no-cache chromium
docker-compose restart
```

### Erro: "Database locked"

**Solução:** Reinicie o container

```bash
docker-compose restart
```

### Logs com erros

**Ver logs completos:**

```bash
docker-compose logs --tail=500 cortinas-app
```

## 📊 Monitoramento

### Logs em tempo real

```bash
docker-compose logs -f
```

### Uso de recursos

```bash
docker stats cortinas-app
```

### Backup do banco

```bash
# Criar backup
docker exec cortinas-app cp /app/data/leads.db /app/data/leads.db.backup
docker cp cortinas-app:/app/data/leads.db.backup ./backup-$(date +%Y%m%d).db

# Restaurar backup
docker cp ./backup-20251222.db cortinas-app:/app/data/leads.db
docker-compose restart
```

## 🔄 Atualização

```bash
# Pull das alterações
git pull origin main

# Rebuild e restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar
docker-compose logs -f
```

## 🌐 Nginx Reverse Proxy

Se estiver usando Nginx:

```nginx
server {
    listen 80;
    server_name cortinasbras.com.br www.cortinasbras.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL com Certbot

```bash
sudo certbot --nginx -d cortinasbras.com.br -d www.cortinasbras.com.br
```

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build Docker concluído sem erros
- [ ] Containers rodando (`docker-compose ps`)
- [ ] Logs sem erros críticos
- [ ] Teste de formulário OK
- [ ] Geração de PDF OK
- [ ] Envio de e-mail OK
- [ ] WhatsApp redirect OK
- [ ] SSL configurado (produção)
- [ ] Backup configurado

## 🆘 Suporte

### Documentação Completa

- [Deploy em Produção](./.agent/workflows/deploy_production.md)
- [Setup Local](./.agent/workflows/setup_local_development.md)
- [Geração de PDF](./docs/PDF_GENERATION.md)

### Comandos Úteis

```bash
# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild completo
docker-compose down -v && docker-compose build --no-cache && docker-compose up -d

# Entrar no container
docker exec -it cortinas-app sh

# Ver variáveis de ambiente
docker exec cortinas-app env | grep -E 'MAIL|PUPPETEER|DATABASE'
```

---

**Última atualização:** 2025-12-22  
**Versão:** 2.0.0
