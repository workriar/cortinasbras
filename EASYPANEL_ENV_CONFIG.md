# Configuração de Variáveis de Ambiente - Easypanel

## ⚠️ IMPORTANTE: NextAuth Configuration

O erro "Server error" que você está vendo é causado pela falta das variáveis de ambiente do NextAuth no Easypanel.

## Variáveis Obrigatórias

Adicione as seguintes variáveis no painel do Easypanel:

### 1. NEXTAUTH_URL
```
NEXTAUTH_URL=https://cortinasbras.com.br
```
**Importante:** Use a URL completa do seu domínio em produção.

### 2. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET=<gere-um-secret-aleatorio>
```

**Como gerar o secret:**
```bash
openssl rand -base64 32
```

Ou use um gerador online: https://generate-secret.vercel.app/32

### 3. DATABASE_URL (já configurada)
```
DATABASE_URL=postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

## Variáveis Completas para Easypanel

Aqui está a lista completa de variáveis que devem estar configuradas:

```bash
# NextAuth
NEXTAUTH_URL=https://cortinasbras.com.br
NEXTAUTH_SECRET=<seu-secret-gerado>

# Database
DATABASE_URL=postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable

# Email
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USE_SSL=true
MAIL_USE_TLS=false
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=4LuZr4hrFqeTsrZ@
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=vendas@cortinasbras.com.br

# Site
NEXT_PUBLIC_SITE_URL=https://cortinasbras.com.br

# Node
NODE_ENV=production
PORT=3000

# Puppeteer (já configurado no Dockerfile)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Como Adicionar no Easypanel

1. Acesse o painel do Easypanel
2. Vá em **Services** → **cortinasbras** → **Environment**
3. Adicione as variáveis `NEXTAUTH_URL` e `NEXTAUTH_SECRET`
4. Clique em **Save**
5. Faça um novo deploy (ou aguarde o deploy automático)

## Verificação

Após adicionar as variáveis e fazer o deploy, o site deve funcionar normalmente. Se ainda houver erro, verifique os logs do container no Easypanel.

## Troubleshooting

### Erro: "Server error"
- **Causa:** Falta `NEXTAUTH_URL` ou `NEXTAUTH_SECRET`
- **Solução:** Adicione as variáveis conforme acima

### Erro: "Database connection failed"
- **Causa:** `DATABASE_URL` incorreta
- **Solução:** Verifique se o PostgreSQL está rodando e a URL está correta

### Erro: "Failed to send email"
- **Causa:** Credenciais de email incorretas
- **Solução:** Verifique `MAIL_USERNAME` e `MAIL_PASSWORD`
