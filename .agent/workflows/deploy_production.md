---
description: Guia completo para deploy em produção do projeto Cortinas Brás com Docker
---

# Deploy em Produção - Cortinas Brás

Este guia cobre o deploy da aplicação Next.js em produção usando Docker.

## Pré-requisitos

1. **Servidor com Docker instalado**
   - Docker Engine 20.10+
   - Docker Compose 2.0+

2. **Variáveis de ambiente configuradas**
   - Arquivo `.env` com todas as credenciais de produção

## Passos para Deploy

### 1. Preparar o ambiente

```bash
// turbo
cd /caminho/para/cortinas-app
```

### 2. Configurar variáveis de ambiente

```bash
// turbo
cp .env.example .env
nano .env  # ou vim .env
```

**Variáveis obrigatórias:**
- `DATABASE_URL` - Caminho para o banco SQLite em produção
- `SMTP_HOST` - Servidor SMTP para envio de e-mails
- `SMTP_PORT` - Porta SMTP (geralmente 587)
- `SMTP_USER` - Usuário SMTP
- `SMTP_PASS` - Senha SMTP
- `EMAIL_FROM` - E-mail remetente
- `EMAIL_TO` - E-mail destinatário (loja@cortinasbras.com.br)
- `NEXT_PUBLIC_SITE_URL` - URL do site em produção (https://cortinasbras.com.br)

### 3. Build da imagem Docker

```bash
// turbo
docker-compose build --no-cache
```

**O que acontece no build:**
- ✅ Instala Node.js 20 Alpine
- ✅ Instala Chromium (necessário para geração de PDF)
- ✅ Configura Puppeteer para usar Chromium do sistema
- ✅ Instala dependências do projeto
- ✅ Faz build otimizado do Next.js
- ✅ Cria imagem de produção minimalista

### 4. Iniciar os containers

```bash
// turbo
docker-compose up -d
```

### 5. Verificar status

```bash
// turbo
docker-compose ps
docker-compose logs -f --tail=100
```

### 6. Testar a aplicação

```bash
// turbo
curl http://localhost:3000
```

Ou acesse pelo navegador: `http://seu-servidor:3000`

## Configuração do Chromium

O Dockerfile já está configurado para instalar e usar o Chromium:

```dockerfile
# Instalar Chromium
RUN apk add --no-cache libc6-compat chromium

# Configurar Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Importante:** Não é necessário instalar o Chromium manualmente via `npx puppeteer browsers install chrome` no ambiente Docker, pois ele já vem instalado na imagem.

## Troubleshooting

### Erro: "Could not find Chrome"

Se você receber este erro, verifique:

1. **No Docker:** O Chromium deve estar instalado na imagem
   ```bash
   docker exec -it cortinas-app which chromium-browser
   ```

2. **Localmente (desenvolvimento):** Instale o Chromium do Puppeteer
   ```bash
   npx puppeteer browsers install chrome
   ```

### Erro: "ENOENT: no such file or directory, open '...Helvetica.afm'"

Este erro indica que o Puppeteer não está encontrando o Chromium. Solução:

1. **No Docker:** Reconstrua a imagem
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Localmente:** Instale o Chromium
   ```bash
   npx puppeteer browsers install chrome
   ```

### Verificar logs de erro

```bash
// turbo
docker-compose logs -f cortinas-app
```

### Reiniciar a aplicação

```bash
// turbo
docker-compose restart
```

### Rebuild completo

```bash
// turbo
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Atualização da aplicação

Quando houver novas alterações no código:

```bash
// turbo
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Backup do banco de dados

```bash
// turbo
docker exec cortinas-app cp /app/data/leads.db /app/data/leads.db.backup
docker cp cortinas-app:/app/data/leads.db.backup ./backup-$(date +%Y%m%d).db
```

## Monitoramento

### Ver logs em tempo real

```bash
// turbo
docker-compose logs -f
```

### Verificar uso de recursos

```bash
// turbo
docker stats cortinas-app
```

### Health check

```bash
// turbo
docker inspect --format='{{json .State.Health}}' cortinas-app | jq
```

## Nginx Reverse Proxy (Opcional)

Se você estiver usando Nginx como proxy reverso:

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

## SSL/HTTPS com Certbot

```bash
// turbo
sudo certbot --nginx -d cortinasbras.com.br -d www.cortinasbras.com.br
```

---

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no `.env`
- [ ] Build da imagem Docker concluído
- [ ] Containers iniciados e rodando
- [ ] Logs sem erros críticos
- [ ] Teste de formulário funcionando
- [ ] Geração de PDF funcionando
- [ ] Envio de e-mail funcionando
- [ ] Redirecionamento para WhatsApp funcionando
- [ ] SSL/HTTPS configurado (se aplicável)
- [ ] Backup do banco de dados configurado

**🚀 Deploy concluído com sucesso!**
