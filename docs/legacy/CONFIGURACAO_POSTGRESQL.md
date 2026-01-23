# 🔐 Configuração PostgreSQL - Easypanel

## Connection String Recebida:
```
postgres://cortinas_admin:xLS7817+#u"{@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

## ⚠️ Problema: Caracteres Especiais na Senha

A senha contém caracteres especiais que precisam ser URL-encoded:
- `+` → `%2B`
- `#` → `%23`
- `"` → `%22`
- `{` → `%7B`

## ✅ Connection String Corrigida:

```env
DATABASE_URL=postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

## 📋 Passo a Passo para Configurar

### 1. No Easypanel (PRODUÇÃO)

1. Acesse: **Easypanel** → **Services** → **cortinas-app**
2. Vá em: **Environment Variables**
3. Adicione/Edite a variável:
   ```
   Nome: DATABASE_URL
   Valor: postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
   ```
4. Clique em **Save**
5. Clique em **Restart** para aplicar

### 2. Local (DESENVOLVIMENTO)

Edite o arquivo `.env.local`:

```env
# Desenvolvimento - manter SQLite
DATABASE_URL=sqlite:./leads.db

# Ou testar PostgreSQL localmente
# DATABASE_URL=postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

## 🔄 Ativar Arquivos PostgreSQL

Execute estes comandos no PowerShell:

```powershell
# Fazer backup dos arquivos SQLite
Copy-Item src/services/db.ts src/services/db-sqlite.ts.bak
Copy-Item src/app/api/leads/route.ts src/app/api/leads/route-sqlite.ts.bak

# Ativar arquivos PostgreSQL
Copy-Item src/services/db-postgres.ts src/services/db.ts -Force
Copy-Item src/app/api/leads/route-postgres.ts src/app/api/leads/route.ts -Force
```

## 📝 Verificar Conexão

Após ativar os arquivos, teste localmente:

```bash
npm run dev
```

Procure nos logs:
```
✅ PostgreSQL conectado com sucesso
✅ Tabela leads verificada/criada
```

## 🚀 Deploy

Quando tudo estiver funcionando:

```bash
git add .
git commit -m "feat: migração PostgreSQL + formulário 2 etapas"
git push origin main
```

## 🔍 Troubleshooting

### Erro: "password authentication failed"
- Verificar se a senha foi URL-encoded corretamente
- Verificar se copiou a connection string completa

### Erro: "could not connect to server"
- Verificar se o host está correto: `cortinasbras_cortinas-db`
- Verificar se o PostgreSQL está rodando no Easypanel

### Erro: "database does not exist"
- Verificar se o database name está correto: `cortinas_leads`
- Criar database manualmente se necessário

## 📊 Testar com pgAdmin

**Host:** IP público do Easypanel (verificar no dashboard)  
**Port:** 5432  
**Database:** cortinas_leads  
**Username:** cortinas_admin  
**Password:** `xLS7817+#u"{` (sem encoding no pgAdmin)

---

**Próximo Passo:** Execute os comandos PowerShell acima para ativar os arquivos PostgreSQL!
