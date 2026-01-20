# Diagnóstico e Correção do Formulário

## Problemas Identificados

### 1. Email Não Está Funcionando ❌

**Causa**: As variáveis de ambiente para configuração de email não estão definidas no arquivo `.env`.

**Arquivo atual** (`/root/.env`):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecretkey123456789abcdef
DATABASE_URL="file:./leads.db"
```

**Variáveis faltando**:
- `MAIL_SERVER` ou `SMTP_HOST`
- `MAIL_PORT` ou `SMTP_PORT`
- `MAIL_USERNAME` ou `SMTP_USER`
- `MAIL_PASSWORD` ou `SMTP_PASS`
- `MAIL_DEFAULT_SENDER`
- `MAIL_NOTIFICATION_TO`

**Solução**: Adicionar as variáveis de email ao arquivo `.env`

### 2. WhatsApp Não Está Abrindo ⚠️

**Análise do código**:
- O formulário (`ContactForm.tsx` linha 60) faz POST para `/api/leads`
- A API (`/api/leads/route.ts` linha 19) retorna `whatsapp_url`
- O formulário (linha 73) tenta abrir o WhatsApp com `window.open(response.data.whatsapp_url, '_blank')`

**Possíveis causas**:
1. A URL do WhatsApp está sendo gerada corretamente, mas o navegador está bloqueando popups
2. O campo `whatsapp_url` não está sendo retornado na resposta
3. Erro no envio do formulário está impedindo o redirecionamento

## Soluções

### Solução 1: Configurar Email

Adicione as seguintes variáveis ao arquivo `.env` na raiz do projeto (`/root/.env`):

```env
# Email Configuration (Hostinger SMTP)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USE_SSL=true
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=4LuZr4hrFqeTsrZ@
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=cortinasbras@gmail.com
```

**Importante**: Substitua `SUA_SENHA_AQUI` pela senha real do email.

### Solução 2: Melhorar o Redirecionamento do WhatsApp

Vou criar uma versão melhorada do `ContactForm.tsx` que:
1. Adiciona logs para debug
2. Melhora o tratamento de erros
3. Garante que o WhatsApp seja aberto mesmo se houver bloqueio de popup

### Solução 3: Adicionar Fallback para Email

Se as credenciais de email não estiverem configuradas, o sistema já usa uma conta de teste (Ethereal), mas isso não envia emails reais. Vou adicionar uma mensagem de aviso mais clara.

## Próximos Passos

1. **Configure as variáveis de email** no arquivo `.env`
2. **Reinicie o servidor** Next.js para carregar as novas variáveis
3. **Teste o formulário** novamente
4. **Verifique os logs** no console do navegador e no terminal do servidor

## Comandos para Testar

```bash
# 1. Editar o arquivo .env
nano /root/.env

# 2. Reiniciar o servidor (se estiver rodando)
# Ctrl+C para parar, depois:
npm run dev

# 3. Testar o formulário
# Abra http://localhost:3000 e preencha o formulário
```

## Logs Importantes

Quando o formulário for enviado, você deve ver no console do servidor:
```
Recebendo lead (Service Layer): {...}
[LeadService] Gerando PDF para Lead #X...
[LeadService] Enviando email para Lead #X...
[Email] Enviado para cortinasbras@gmail.com. ID: <message-id>
```

Se o email falhar, você verá:
```
[LeadService] Falha no envio de email: Error: ...
```
