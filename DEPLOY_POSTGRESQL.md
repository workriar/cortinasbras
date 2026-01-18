# 🚀 Deploy PostgreSQL - Guia Rápido

## ✅ Status Atual

- [x] PostgreSQL criado no Easypanel
- [x] Connection string recebida
- [x] Dependência `pg` instalada
- [x] Arquivos PostgreSQL ativados
- [x] Backup SQLite criado

## 🔐 Connection String

**Original:**
```
postgres://cortinas_admin:xLS7817+#u"{@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

**URL-Encoded (usar no .env):**
```
postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

## 📋 Próximos Passos

### 1. Configurar Variável de Ambiente no Easypanel

1. Acesse: https://easypanel.io
2. Login e selecione seu projeto
3. Vá em: **Services** → **cortinas-app** → **Environment**
4. Adicione ou edite:
   ```
   DATABASE_URL=postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
   ```
5. Clique em **Save**

### 2. Fazer Commit e Push

```bash
# Verificar mudanças
git status

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: migração PostgreSQL + formulário 2 etapas

- Implementado formulário em 2 etapas (Nome/WhatsApp/Cidade → Medidas/Detalhes)
- Adicionado campo cidade_bairro
- Microtexto explicativo para medidas opcionais
- Card de envio de foto via WhatsApp
- Migração de SQLite para PostgreSQL
- Backup automático e gestão profissional de leads"

# Push para produção
git push origin main
```

### 3. Deploy no Easypanel

**Opção A: Deploy Automático (se webhook configurado)**
- O push acima já vai disparar o deploy automaticamente
- Aguarde ~2-3 minutos

**Opção B: Deploy Manual**
1. Easypanel → **Services** → **cortinas-app**
2. Clique em **Deploy**
3. Aguarde build completar

### 4. Verificar Deploy

1. **Verificar Logs:**
   - Easypanel → **Services** → **cortinas-app** → **Logs**
   - Procure por:
     ```
     ✅ PostgreSQL conectado com sucesso
     ✅ Tabela leads verificada/criada
     ```

2. **Testar Site:**
   - Acesse: https://cortinasbras.com.br
   - Role até o formulário
   - Preencha Etapa 1 (Nome, WhatsApp, Cidade)
   - Clique "Continuar"
   - Verifique Etapa 2 (Medidas, Tecido)
   - Envie um teste

3. **Verificar Banco:**
   - Use pgAdmin para conectar
   - Execute: `SELECT * FROM leads ORDER BY criado_em DESC LIMIT 5;`
   - Confirme que o lead de teste aparece

## 🛠️ Configurar pgAdmin (Opcional)

### Download e Instalação
1. Baixe: https://www.pgadmin.org/download/
2. Instale no seu computador

### Configuração
1. Abra pgAdmin
2. **Add New Server**
3. **Aba General:**
   - Name: `Cortinas Brás - Produção`
4. **Aba Connection:**
   - Host: `[IP_PUBLICO_EASYPANEL]` (verificar no dashboard)
   - Port: `5432`
   - Database: `cortinas_leads`
   - Username: `cortinas_admin`
   - Password: `xLS7817+#u"{` (SEM encoding no pgAdmin)
5. **Save** e conectar

## 📊 Queries Úteis

### Ver últimos leads
```sql
SELECT id, nome, telefone, cidade_bairro, criado_em 
FROM leads 
ORDER BY criado_em DESC 
LIMIT 20;
```

### Leads por cidade
```sql
SELECT cidade_bairro, COUNT(*) as total 
FROM leads 
GROUP BY cidade_bairro 
ORDER BY total DESC;
```

### Leads de hoje
```sql
SELECT * FROM leads 
WHERE DATE(criado_em) = CURRENT_DATE 
ORDER BY criado_em DESC;
```

### Estatísticas
```sql
SELECT 
  COUNT(*) as total_leads,
  COUNT(CASE WHEN largura_parede IS NOT NULL THEN 1 END) as com_medidas,
  COUNT(CASE WHEN cidade_bairro IS NOT NULL THEN 1 END) as com_localizacao,
  COUNT(DISTINCT cidade_bairro) as cidades_diferentes
FROM leads;
```

## ⚠️ Troubleshooting

### Erro: "password authentication failed"
- Verifique se usou a connection string com URL-encoding
- Copie exatamente: `postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable`

### Erro: "could not connect to server"
- Verifique se PostgreSQL está rodando: Easypanel → Services → cortinas-db
- Verifique o host: `cortinasbras_cortinas-db`

### Erro: "relation leads does not exist"
- A tabela será criada automaticamente na primeira conexão
- Verifique os logs para ver se houve erro na criação

### Site não carrega após deploy
- Verifique logs do container
- Confirme que a variável DATABASE_URL foi salva
- Faça restart manual se necessário

## 🎉 Checklist Final

- [ ] Variável DATABASE_URL configurada no Easypanel
- [ ] Commit e push realizados
- [ ] Deploy concluído (automático ou manual)
- [ ] Logs verificados (PostgreSQL conectado)
- [ ] Formulário testado no site
- [ ] Lead de teste salvo no banco
- [ ] pgAdmin configurado (opcional)
- [ ] Backup automático ativado no Easypanel

## 📞 Próximos Passos

Após deploy bem-sucedido:

1. **Monitorar primeiros leads**
   - Verificar se estão sendo salvos corretamente
   - Validar campos cidade_bairro

2. **Configurar alertas** (futuro)
   - Notificação de novos leads
   - Relatórios diários

3. **Análises**
   - Leads por região
   - Taxa de conversão
   - Horários de pico

---

**Data:** 23/12/2025  
**Status:** ✅ Pronto para deploy  
**Tempo estimado:** 10-15 minutos
