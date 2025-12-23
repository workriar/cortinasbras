# ✅ Checklist: Setup PostgreSQL no Easypanel

## 📋 Pré-Requisitos
- [ ] Acesso ao Easypanel Dashboard
- [ ] Projeto Cortinas Brás ativo
- [ ] Acesso SSH/terminal (opcional)

---

## 🗄️ ETAPA 1: Criar Banco de Dados (5 min)

### No Easypanel Dashboard:

- [ ] **1.1** Login no Easypanel
- [ ] **1.2** Selecionar projeto "Cortinas Brás"
- [ ] **1.3** Ir em **Services** → **Create Service**
- [ ] **1.4** Selecionar **PostgreSQL**
- [ ] **1.5** Preencher configurações:
  ```
  Service Name: cortinas-db
  Version: 16
  Database Name: cortinas_leads
  Username: cortinas_admin
  Password: [GERAR E ANOTAR]
  ```
- [ ] **1.6** Configurar recursos:
  ```
  CPU: 0.5 vCPU
  RAM: 512MB (ou 1GB se tiver budget)
  Storage: 5GB
  ```
- [ ] **1.7** Clicar em **Create**
- [ ] **1.8** Aguardar provisionamento (~2 min)

### Anotar Credenciais:

- [ ] **1.9** Copiar connection string:
  ```
  postgresql://cortinas_admin:[SENHA]@cortinas-db:5432/cortinas_leads
  ```
- [ ] **1.10** Salvar em local seguro (1Password, LastPass, etc.)

---

## 💻 ETAPA 2: Atualizar Aplicação (10 min)

### No seu computador local:

- [ ] **2.1** Abrir terminal no projeto
  ```bash
  cd e:\CB\www\cortinas-app
  ```

- [ ] **2.2** Instalar dependência PostgreSQL
  ```bash
  npm install pg
  ```
  ✅ **Status:** Concluído

- [ ] **2.3** Fazer backup dos arquivos atuais
  ```bash
  cp src/services/db.ts src/services/db-sqlite.ts.bak
  cp src/app/api/leads/route.ts src/app/api/leads/route-sqlite.ts.bak
  ```

- [ ] **2.4** Ativar arquivos PostgreSQL
  ```bash
  # Windows PowerShell
  Copy-Item src/services/db-postgres.ts src/services/db.ts -Force
  Copy-Item src/app/api/leads/route-postgres.ts src/app/api/leads/route.ts -Force
  ```

- [ ] **2.5** Verificar arquivos atualizados
  ```bash
  ls src/services/db.ts
  ls src/app/api/leads/route.ts
  ```

---

## 🔧 ETAPA 3: Configurar Variáveis de Ambiente

### No Easypanel (Produção):

- [ ] **3.1** Ir em **Services** → **cortinas-app** → **Environment**
- [ ] **3.2** Adicionar/Atualizar variável:
  ```
  DATABASE_URL=postgresql://cortinas_admin:[SENHA]@cortinas-db:5432/cortinas_leads
  ```
- [ ] **3.3** Salvar mudanças

### Local (Opcional - para testes):

- [ ] **3.4** Editar `.env.local`:
  ```env
  # Manter SQLite para dev local
  DATABASE_URL=sqlite:./leads.db
  
  # Ou testar com PostgreSQL local
  # DATABASE_URL=postgresql://postgres:dev123@localhost:5432/cortinas_leads
  ```

---

## 📦 ETAPA 4: Migrar Dados (Opcional)

### Se você já tem leads no SQLite:

- [ ] **4.1** Verificar se tem arquivo `leads.db`
- [ ] **4.2** Adicionar variável temporária no `.env.local`:
  ```env
  DATABASE_URL_POSTGRES=postgresql://cortinas_admin:[SENHA]@[IP]:5432/cortinas_leads
  ```
- [ ] **4.3** Executar script de migração:
  ```bash
  node scripts/migrate-sqlite-to-postgres.js
  ```
- [ ] **4.4** Verificar logs de migração
- [ ] **4.5** Confirmar dados no PostgreSQL (via pgAdmin)

### Se NÃO tem dados para migrar:

- [ ] **4.6** Pular esta etapa ✅

---

## 🚀 ETAPA 5: Deploy

### Commit e Push:

- [ ] **5.1** Verificar mudanças:
  ```bash
  git status
  ```

- [ ] **5.2** Adicionar arquivos:
  ```bash
  git add .
  ```

- [ ] **5.3** Commit:
  ```bash
  git commit -m "feat: migração para PostgreSQL + formulário 2 etapas"
  ```

- [ ] **5.4** Push:
  ```bash
  git push origin main
  ```

### No Easypanel:

- [ ] **5.5** Aguardar deploy automático (se webhook configurado)
  
  **OU**
  
- [ ] **5.6** Deploy manual: **Services** → **cortinas-app** → **Deploy**

- [ ] **5.7** Aguardar build (~2-3 min)

---

## ✅ ETAPA 6: Verificação

### Verificar Logs:

- [ ] **6.1** Easypanel → **Services** → **cortinas-app** → **Logs**
- [ ] **6.2** Procurar por:
  ```
  ✅ PostgreSQL conectado com sucesso
  ✅ Tabela leads verificada/criada
  ```

### Testar Aplicação:

- [ ] **6.3** Acessar site: `https://cortinasbras.com.br`
- [ ] **6.4** Rolar até formulário de orçamento
- [ ] **6.5** Testar Etapa 1:
  - [ ] Preencher Nome
  - [ ] Preencher WhatsApp
  - [ ] Preencher Cidade/Bairro
  - [ ] Clicar "Continuar"
- [ ] **6.6** Testar Etapa 2:
  - [ ] Verificar barra de progresso (100%)
  - [ ] Verificar microtexto das medidas
  - [ ] Preencher campos (opcional)
  - [ ] Clicar "Enviar Solicitação"
- [ ] **6.7** Verificar redirecionamento WhatsApp
- [ ] **6.8** Confirmar lead salvo no banco

### Verificar Banco de Dados:

- [ ] **6.9** Conectar via pgAdmin (próxima etapa)
- [ ] **6.10** Executar query:
  ```sql
  SELECT * FROM leads ORDER BY criado_em DESC LIMIT 5;
  ```
- [ ] **6.11** Confirmar lead de teste aparece

---

## 🛠️ ETAPA 7: Configurar pgAdmin (Opcional)

### Instalação:

- [ ] **7.1** Baixar pgAdmin: https://www.pgadmin.org/download/
- [ ] **7.2** Instalar no computador

### Configuração:

- [ ] **7.3** Abrir pgAdmin
- [ ] **7.4** Clicar em **Add New Server**
- [ ] **7.5** Aba **General**:
  ```
  Name: Cortinas Brás - Produção
  ```
- [ ] **7.6** Aba **Connection**:
  ```
  Host: [IP_PUBLICO_EASYPANEL]
  Port: 5432
  Database: cortinas_leads
  Username: cortinas_admin
  Password: [SUA_SENHA]
  ```
- [ ] **7.7** Clicar **Save**
- [ ] **7.8** Conectar ao banco
- [ ] **7.9** Navegar: **Servers** → **Cortinas Brás** → **Databases** → **cortinas_leads** → **Schemas** → **public** → **Tables** → **leads**
- [ ] **7.10** Clicar com botão direito → **View/Edit Data** → **All Rows**

---

## 📊 ETAPA 8: Configurar Backup (Recomendado)

### No Easypanel:

- [ ] **8.1** Ir em **Services** → **cortinas-db** → **Backups**
- [ ] **8.2** Ativar backup automático
- [ ] **8.3** Configurar:
  ```
  Frequência: Diário
  Horário: 03:00 AM
  Retenção: 7 dias
  ```
- [ ] **8.4** Salvar configuração
- [ ] **8.5** Testar backup manual (opcional)

---

## 🎉 CONCLUSÃO

### Checklist Final:

- [ ] ✅ PostgreSQL criado e rodando
- [ ] ✅ Aplicação atualizada e deployada
- [ ] ✅ Formulário 2 etapas funcionando
- [ ] ✅ Leads sendo salvos no PostgreSQL
- [ ] ✅ pgAdmin configurado (opcional)
- [ ] ✅ Backup automático ativo

### Próximos Passos:

- [ ] Monitorar leads nos primeiros dias
- [ ] Criar queries personalizadas para relatórios
- [ ] Configurar alertas (opcional)
- [ ] Integrar com CRM (futuro)

---

## 📞 Suporte

### Documentação Criada:

1. **`RECOMENDACAO_POSTGRESQL.md`** - Resumo executivo
2. **`docs/MIGRACAO_POSTGRESQL.md`** - Guia completo
3. **`scripts/migrate-sqlite-to-postgres.js`** - Script de migração

### Arquivos Prontos:

1. **`src/services/db-postgres.ts`** - Conexão PostgreSQL
2. **`src/app/api/leads/route-postgres.ts`** - API atualizada

### Em Caso de Problemas:

- Verificar logs no Easypanel
- Consultar `docs/MIGRACAO_POSTGRESQL.md` → Troubleshooting
- Verificar credenciais no `.env`

---

**Data:** 23/12/2025  
**Status:** ✅ Pronto para executar  
**Tempo estimado:** ~30 minutos total
