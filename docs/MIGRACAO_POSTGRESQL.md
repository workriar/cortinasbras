# Guia de Migração: SQLite → PostgreSQL no Easypanel

## 📋 Índice
1. [Por que PostgreSQL?](#por-que-postgresql)
2. [Criar Banco no Easypanel](#criar-banco-no-easypanel)
3. [Migrar Dados Existentes](#migrar-dados-existentes)
4. [Atualizar Aplicação](#atualizar-aplicação)
5. [Deploy](#deploy)
6. [Ferramentas de Administração](#ferramentas-de-administração)

---

## 🎯 Por que PostgreSQL?

| Recurso | SQLite | PostgreSQL |
|---------|--------|------------|
| **Produção** | ❌ Não recomendado | ✅ Ideal |
| **Backup** | Manual | ✅ Automático |
| **Múltiplos acessos** | ⚠️ Limitado | ✅ Excelente |
| **Escalabilidade** | ❌ Limitada | ✅ Alta |
| **Ferramentas Admin** | ⚠️ Poucas | ✅ Muitas (pgAdmin, DBeaver) |
| **Replicação** | ❌ Não | ✅ Sim |
| **Performance** | ⚠️ Boa para poucos dados | ✅ Excelente |

---

## 🚀 1. Criar Banco no Easypanel

### Passo 1: Acessar Dashboard
1. Login no Easypanel
2. Selecione seu projeto **Cortinas Brás**

### Passo 2: Criar Serviço PostgreSQL
1. Clique em **Services** → **Create Service**
2. Selecione **PostgreSQL**
3. Configure:
   ```
   Service Name: cortinas-db
   Version: 16 (recomendado)
   Database Name: cortinas_leads
   Username: cortinas_admin
   Password: [GERAR SENHA FORTE - ANOTAR!]
   ```
4. **Recursos recomendados:**
   ```
   CPU: 0.5 vCPU (pode aumentar depois)
   RAM: 512MB (mínimo) ou 1GB (recomendado)
   Storage: 5GB (suficiente para milhares de leads)
   ```
5. Clique em **Create**

### Passo 3: Anotar Credenciais
```env
# Conexão Interna (dentro do Easypanel)
DATABASE_URL=postgresql://cortinas_admin:[SUA_SENHA]@cortinas-db:5432/cortinas_leads

# Conexão Externa (para ferramentas locais)
DATABASE_URL=postgresql://cortinas_admin:[SUA_SENHA]@[IP_PUBLICO]:5432/cortinas_leads
```

⚠️ **IMPORTANTE:** Guarde essas credenciais em local seguro!

---

## 📦 2. Migrar Dados Existentes (Opcional)

Se você já tem leads no SQLite, vamos migrá-los:

### Opção A: Script de Migração Automático

```bash
# No seu ambiente local
cd e:\CB\www\cortinas-app

# Executar script de migração
node scripts/migrate-sqlite-to-postgres.js
```

### Opção B: Exportar/Importar Manual

**1. Exportar do SQLite:**
```bash
sqlite3 leads.db ".mode csv" ".output leads.csv" "SELECT * FROM leads;"
```

**2. Importar no PostgreSQL:**
```sql
-- Conectar ao PostgreSQL
psql -h [HOST] -U cortinas_admin -d cortinas_leads

-- Importar CSV
\COPY leads(id, nome, telefone, cidade_bairro, largura_parede, altura_parede, tecido, instalacao, observacoes, criado_em) 
FROM 'leads.csv' 
DELIMITER ',' 
CSV HEADER;
```

---

## 🔧 3. Atualizar Aplicação

### Passo 1: Instalar Dependência
```bash
npm install pg
```

### Passo 2: Substituir Arquivos

**Renomear arquivos antigos (backup):**
```bash
mv src/services/db.ts src/services/db-sqlite.ts.bak
mv src/app/api/leads/route.ts src/app/api/leads/route-sqlite.ts.bak
```

**Ativar novos arquivos:**
```bash
mv src/services/db-postgres.ts src/services/db.ts
mv src/app/api/leads/route-postgres.ts src/app/api/leads/route.ts
```

### Passo 3: Atualizar .env

**Local (.env.local):**
```env
# Manter SQLite para desenvolvimento local
DATABASE_URL=sqlite:./leads.db
```

**Produção (.env no Easypanel):**
```env
# Usar PostgreSQL em produção
DATABASE_URL=postgresql://cortinas_admin:[SENHA]@cortinas-db:5432/cortinas_leads
NODE_ENV=production
```

### Passo 4: Testar Localmente (Opcional)

Se quiser testar PostgreSQL localmente:

```bash
# Instalar PostgreSQL localmente ou usar Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=dev123 -p 5432:5432 -d postgres:16

# Atualizar .env.local
DATABASE_URL=postgresql://postgres:dev123@localhost:5432/cortinas_leads

# Testar
npm run dev
```

---

## 🚀 4. Deploy no Easypanel

### Opção A: Via Git (Recomendado)

```bash
# Commit das mudanças
git add .
git commit -m "feat: migração para PostgreSQL"
git push origin main

# Se tiver webhook configurado, deploy automático
# Caso contrário, fazer deploy manual no Easypanel
```

### Opção B: Deploy Manual

1. No Easypanel, vá em **Services** → **cortinas-app**
2. Clique em **Deploy**
3. Aguarde build e restart

### Verificar Deploy

1. Acesse logs do container:
   ```
   Easypanel → Services → cortinas-app → Logs
   ```

2. Procure por:
   ```
   ✅ PostgreSQL conectado com sucesso
   ✅ Tabela leads verificada/criada
   ```

3. Teste o formulário no site

---

## 🛠️ 5. Ferramentas de Administração

### pgAdmin (Recomendado)

**Instalação:**
- Download: https://www.pgadmin.org/download/

**Configuração:**
1. Abrir pgAdmin
2. **Add New Server**
   - Name: `Cortinas Brás - Produção`
   - Host: `[IP_PUBLICO_EASYPANEL]`
   - Port: `5432`
   - Database: `cortinas_leads`
   - Username: `cortinas_admin`
   - Password: `[SUA_SENHA]`
3. Conectar

**Funcionalidades:**
- ✅ Visualizar leads em tempo real
- ✅ Executar queries SQL
- ✅ Exportar relatórios (CSV, Excel)
- ✅ Backup/Restore
- ✅ Monitorar performance

### DBeaver (Alternativa)

- Download: https://dbeaver.io/download/
- Mais leve que pgAdmin
- Suporta múltiplos bancos

### Queries Úteis

**Ver últimos 10 leads:**
```sql
SELECT id, nome, telefone, cidade_bairro, criado_em 
FROM leads 
ORDER BY criado_em DESC 
LIMIT 10;
```

**Leads por cidade:**
```sql
SELECT cidade_bairro, COUNT(*) as total 
FROM leads 
GROUP BY cidade_bairro 
ORDER BY total DESC;
```

**Leads do dia:**
```sql
SELECT * FROM leads 
WHERE DATE(criado_em) = CURRENT_DATE 
ORDER BY criado_em DESC;
```

**Taxa de conversão (com medidas):**
```sql
SELECT 
  COUNT(*) as total_leads,
  COUNT(CASE WHEN largura_parede IS NOT NULL THEN 1 END) as com_medidas,
  ROUND(100.0 * COUNT(CASE WHEN largura_parede IS NOT NULL THEN 1 END) / COUNT(*), 2) as taxa_conversao
FROM leads;
```

---

## 📊 6. Backup e Manutenção

### Backup Automático (Easypanel)

O Easypanel já faz backup automático, mas você pode configurar:

1. **Easypanel** → **Services** → **cortinas-db** → **Backups**
2. Configurar frequência (diário recomendado)
3. Retenção: 7 dias

### Backup Manual

```bash
# Backup completo
pg_dump -h [HOST] -U cortinas_admin -d cortinas_leads > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -h [HOST] -U cortinas_admin -d cortinas_leads < backup_20251223.sql
```

### Monitoramento

**Queries de monitoramento:**

```sql
-- Tamanho do banco
SELECT pg_size_pretty(pg_database_size('cortinas_leads'));

-- Número de conexões ativas
SELECT count(*) FROM pg_stat_activity;

-- Tabelas e tamanhos
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ✅ Checklist de Migração

- [ ] PostgreSQL criado no Easypanel
- [ ] Credenciais anotadas em local seguro
- [ ] Dependência `pg` instalada
- [ ] Arquivos de conexão atualizados
- [ ] `.env` de produção configurado
- [ ] Dados migrados (se aplicável)
- [ ] Teste local realizado
- [ ] Deploy em produção
- [ ] Logs verificados
- [ ] Formulário testado no site
- [ ] pgAdmin configurado
- [ ] Backup automático ativado

---

## 🆘 Troubleshooting

### Erro: "Connection refused"
- Verificar se PostgreSQL está rodando no Easypanel
- Verificar credenciais no `.env`
- Verificar firewall/network no Easypanel

### Erro: "password authentication failed"
- Verificar senha no `.env`
- Resetar senha no Easypanel se necessário

### Erro: "database does not exist"
- Criar database manualmente:
  ```sql
  CREATE DATABASE cortinas_leads;
  ```

### Performance lenta
- Verificar índices criados
- Aumentar recursos (RAM/CPU) no Easypanel
- Analisar queries lentas com `EXPLAIN ANALYZE`

---

## 📞 Suporte

- **Easypanel Docs:** https://easypanel.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Criado em:** 23/12/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para uso
