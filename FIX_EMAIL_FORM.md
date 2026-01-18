# 🔧 Correção: Formulário não Enviava Emails

## 📋 Problema Identificado

O formulário de contato do site **cortinasbras.com.br** não estava enviando emails porque:

### 1. **Erro no Schema do Prisma**
- O schema do Prisma tinha campos que não existiam no banco de dados PostgreSQL
- Especificamente, o campo `ownerId` e outros campos novos (`tipo_cortina`, `espaco_cortina`, `translucidez`, `forro`, `endereco`)
- Isso causava erro ao tentar salvar leads: `The column 'leads.ownerId' does not exist in the current database`

### 2. **Consequência**
- O processo de criação de lead falhava **antes** de chegar na parte de envio de email
- Portanto, nenhum email era enviado, mesmo com as credenciais SMTP corretas

## ✅ Solução Aplicada

### 1. **Adicionadas Colunas Faltantes no Banco de Dados**
```sql
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS "ownerId" INTEGER,
ADD COLUMN IF NOT EXISTS tipo_cortina VARCHAR(100),
ADD COLUMN IF NOT EXISTS espaco_cortina VARCHAR(100),
ADD COLUMN IF NOT EXISTS translucidez VARCHAR(100),
ADD COLUMN IF NOT EXISTS forro VARCHAR(100),
ADD COLUMN IF NOT EXISTS endereco VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_leads_ownerid ON leads("ownerId");
CREATE INDEX IF NOT EXISTS idx_leads_origem ON leads(origem);
```

### 2. **Criada Migração do Prisma**
- Arquivo: `prisma/migrations/20260106130117_add_missing_columns/migration.sql`
- Esta migração será aplicada automaticamente no próximo deploy

### 3. **Deploy Automático**
- Código enviado para GitHub (commit `9d9a1f1`)
- EasyPanel detectará as mudanças e fará rebuild automático
- O Prisma Client será regenerado com o schema correto

## 🔑 Configurações de Email (Já Configuradas no EasyPanel)

As seguintes variáveis de ambiente estão configuradas corretamente no container:

```bash
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=4LuZr4hrFqeTsrZ@
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=vendas@cortinasbras.com.br
MAIL_USE_SSL=true
MAIL_USE_TLS=false
```

## 📊 Fluxo Correto Após a Correção

1. **Usuário preenche formulário** → Dados enviados para `/api/leads`
2. **API cria lead no banco** → Prisma salva com sucesso (agora que as colunas existem)
3. **PDF é gerado** → `generateOrcamentoPdf()` cria PDF do orçamento
4. **Email é enviado** → `sendEmailWithPdf()` envia email com PDF anexado
5. **Redirecionamento WhatsApp** → Usuário é redirecionado para WhatsApp

## 🧪 Como Testar

1. Aguardar o rebuild do EasyPanel (5-10 minutos)
2. Acessar https://cortinasbras.com.br
3. Preencher o formulário de contato
4. Verificar se o email chega em `vendas@cortinasbras.com.br`

## 📝 Logs para Monitoramento

```bash
# Ver logs do container
docker logs -f cortinasbras_cortinasbras.1.thtngnat9n5ivzwcj0zhcsiln

# Verificar se há erros de email
docker logs --tail 100 cortinasbras_cortinasbras.1.thtngnat9n5ivzwcj0zhcsiln 2>&1 | grep -i "mail\|email\|smtp"

# Verificar status do container
docker ps | grep cortinasbras
```

## ⚠️ Observações Importantes

- **Não** é necessário alterar variáveis de ambiente no EasyPanel
- **Não** é necessário fazer alterações manuais no banco de dados (já feitas)
- O próximo deploy aplicará a migração automaticamente
- Se houver problemas, verificar logs do container para erros específicos

## 📅 Data da Correção

- **Data**: 06/01/2026
- **Commit**: `9d9a1f1`
- **Migração**: `20260106130117_add_missing_columns`

---

**Status**: ✅ Correção aplicada, aguardando rebuild automático do EasyPanel
