# 🚨 URGENTE: Configurar DATABASE_URL no Easypanel

## ❌ Problema Atual

Os logs mostram que o Easypanel ainda está usando SQLite:

```
DATABASE_URL inválido: sqlite:////opt/meu-projeto/leads.db
EXCEÇÃO NA API DE LEADS: SQLITE_CANTOPEN: unable to open database file
```

**Resultado:** Todos os leads estão sendo perdidos! ⚠️

---

## ✅ Solução: Atualizar DATABASE_URL

### 📋 Passo a Passo DETALHADO

#### 1. Acesse o Easypanel
- URL: https://easypanel.io
- Faça login com suas credenciais

#### 2. Navegue até o Projeto
```
Dashboard
  → Projects (menu lateral)
    → cortinasbras (seu projeto)
      → Services
        → cortinas-app (clique nele)
```

#### 3. Vá para Environment Variables
Procure por uma das opções:
- **Environment** (tab/aba)
- **Environment Variables**
- **Variables**
- **Settings** → **Environment**

#### 4. Encontre DATABASE_URL
Você verá algo assim:
```
DATABASE_URL = sqlite:////opt/meu-projeto/leads.db
```

#### 5. Edite o Valor
**Clique em "Edit" ou no ícone de lápis**

**APAGUE** o valor antigo e **COLE** exatamente:
```
postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

⚠️ **IMPORTANTE:** 
- Copie EXATAMENTE como está acima
- Não adicione espaços no início ou fim
- Não quebre em múltiplas linhas

#### 6. Salve as Mudanças
- Clique em **Save** ou **Update**
- Aguarde confirmação

#### 7. Restart o Serviço
**CRÍTICO:** Você DEVE fazer restart para aplicar!

Opções:
- Botão **Restart**
- Botão **Redeploy**
- Menu → **Restart Service**

Aguarde ~1-2 minutos para o serviço reiniciar.

---

## 🔍 Verificação

### 1. Verifique os Logs

Após restart, vá em **Logs** e procure por:

✅ **Sucesso:**
```
✅ PostgreSQL conectado com sucesso
✅ Tabela leads verificada/criada
```

❌ **Ainda com erro:**
```
DATABASE_URL inválido: sqlite://
```
→ Volte e verifique se salvou corretamente

### 2. Teste o Formulário

1. Acesse: https://cortinasbras.com.br
2. Preencha o formulário
3. Envie um lead de teste
4. Verifique se não aparece erro

### 3. Verifique no Banco

Use pgAdmin para conectar e executar:
```sql
SELECT * FROM leads ORDER BY criado_em DESC LIMIT 5;
```

Você deve ver os leads de teste!

---

## 🎯 Checklist Rápido

- [ ] 1. Login no Easypanel
- [ ] 2. Navegar: Projects → cortinasbras → Services → cortinas-app
- [ ] 3. Ir em Environment Variables
- [ ] 4. Editar DATABASE_URL
- [ ] 5. Colar: `postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable`
- [ ] 6. Salvar
- [ ] 7. **Restart** o serviço
- [ ] 8. Aguardar 1-2 minutos
- [ ] 9. Verificar logs (deve aparecer "PostgreSQL conectado")
- [ ] 10. Testar formulário

---

## 🆘 Troubleshooting

### Não encontro "Environment Variables"
**Tente:**
- Tab "Settings"
- Tab "Configuration"
- Botão "⚙️" (configurações)
- Menu lateral "Variables"

### Salvei mas ainda aparece SQLite nos logs
**Causa:** Não fez restart  
**Solução:** Clique em "Restart" ou "Redeploy"

### Erro: "password authentication failed"
**Causa:** Copiou errado a connection string  
**Solução:** Copie novamente, exatamente como está:
```
postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

### Erro: "could not connect to server"
**Causa:** PostgreSQL não está rodando  
**Solução:**
1. Vá em Services → cortinas-db
2. Verifique se está "Running"
3. Se não, clique "Start"

---

## 📸 Exemplo Visual

**Antes (ERRADO):**
```
DATABASE_URL = sqlite:////opt/meu-projeto/leads.db
```

**Depois (CORRETO):**
```
DATABASE_URL = postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
```

---

## ⚠️ IMPORTANTE

**Leads sendo perdidos agora!**

Cada tentativa de envio do formulário está falhando:
- Sanchez
- Kleber (múltiplas tentativas)
- Rogerio Marcellino
- Adriana

**Todos esses leads foram PERDIDOS** porque o banco SQLite não consegue ser criado no container.

**Configure AGORA para não perder mais leads!**

---

## 🎉 Após Configurar

Você terá:
- ✅ Leads salvos no PostgreSQL
- ✅ Backup automático
- ✅ Gestão profissional
- ✅ Formulário 2 etapas funcionando
- ✅ Nenhum lead perdido

---

**Tempo estimado:** 5 minutos  
**Urgência:** 🔴 ALTA - Leads sendo perdidos!

---

**Criado em:** 23/12/2025 15:03  
**Status:** ⚠️ AÇÃO NECESSÁRIA URGENTE
