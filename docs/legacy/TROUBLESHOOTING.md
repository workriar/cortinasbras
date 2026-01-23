# 🔍 GUIA FINAL DE TROUBLESHOOTING

## Status Atual (30/12/2025 11:53)

### ✅ Banco de Dados - PERFEITO
```sql
✓ Usuário: admin@cortinasbras.com.br
✓ Senha hash: $2b$10$h8mr.8lgW.L0/QqQUI2fFON42bs7PTgrop4TOb4tDfq7a4wK8hcwC
✓ Senha: admin123 (testado e válido)
✓ Role: ADMIN
```

### ✅ Código - ATUALIZADO
```
✓ Logo novo: public/static/logo-login.png
✓ Prisma schema: PostgreSQL
✓ NextAuth: Logs de debug adicionados
✓ Commits: 6a161d2 (último)
```

### ⏳ Deploy - AGUARDANDO
```
? Build pode estar em andamento
? Prisma Client precisa ser regenerado no servidor
```

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

### 1. Verificar Status do Deploy

No Easypanel, verifique:
- [ ] Build terminou com sucesso?
- [ ] Container está rodando?
- [ ] Não há erros nos logs?

### 2. Testar Endpoints

#### A. Health Check (simples)
```
GET https://cortinasbras.com.br/api/health
```

**Esperado:**
```json
{
  "status": "ok",
  "env": {
    "hasDatabase": true,
    "hasNextAuth": true
  }
}
```

#### B. Test Auth (completo)
```
GET https://cortinasbras.com.br/api/test-auth
```

**Esperado:**
```json
{
  "success": true,
  "tests": {
    "databaseConnection": true,
    "totalUsers": 1,
    "adminExists": true,
    "passwordValid": true
  }
}
```

### 3. Testar Login

1. Acesse: `https://cortinasbras.com.br/login`
2. Limpe cache: **Ctrl + Shift + R**
3. Credenciais:
   ```
   Email: admin@cortinasbras.com.br
   Senha: admin123
   ```

### 4. Verificar Logs

Nos logs do Easypanel, procure por:

**✅ Sucesso:**
```
🔐 [NextAuth] Tentativa de login: admin@cortinasbras.com.br
👤 [NextAuth] Usuário encontrado: SIM
🔑 [NextAuth] Testando senha...
✅ [NextAuth] Senha válida: true
🎉 [NextAuth] Login bem-sucedido
```

**❌ Erro comum:**
```
Error: @prisma/client did not initialize yet
```
**Solução:** Aguardar build terminar (Prisma está sendo gerado)

---

## 🐛 PROBLEMAS CONHECIDOS E SOLUÇÕES

### Problema 1: "404 - Page not found" em /api/test-auth
**Causa:** Deploy ainda não terminou ou build falhou
**Solução:** 
1. Verificar logs do build no Easypanel
2. Aguardar deploy completo
3. Testar `/api/health` primeiro

### Problema 2: "Credenciais inválidas"
**Causa:** Prisma Client não foi regenerado
**Solução:**
1. Verificar logs: procurar por "prisma generate"
2. Force rebuild no Easypanel
3. Verificar se DATABASE_URL está correta

### Problema 3: Logo não aparece
**Causa:** Cache do navegador ou build incompleto
**Solução:**
1. Ctrl + Shift + R (hard refresh)
2. Testar em aba anônima
3. Verificar se arquivo existe: `https://cortinasbras.com.br/static/logo-login.png`

### Problema 4: "Server error" do NextAuth
**Causa:** NEXTAUTH_SECRET ou NEXTAUTH_URL faltando
**Solução:**
1. Verificar variáveis de ambiente no Easypanel:
   - NEXTAUTH_URL=https://cortinasbras.com.br
   - NEXTAUTH_SECRET=diNoE59ufbd+4XI/A1MPQ657t216G3WTT3Ok4B3ktEo=

---

## 📊 VARIÁVEIS DE AMBIENTE (Checklist)

Confirme que TODAS estão no Easypanel:

```bash
✓ NEXTAUTH_URL=https://cortinasbras.com.br
✓ NEXTAUTH_SECRET=diNoE59ufbd+4XI/A1MPQ657t216G3WTT3Ok4B3ktEo=
✓ DATABASE_URL=postgresql://cortinas_admin:xLS7817%2B%23u%22%7B@cortinasbras_cortinas-db:5432/cortinas_leads?sslmode=disable
✓ MAIL_SERVER=smtp.hostinger.com
✓ MAIL_PORT=465
✓ MAIL_USE_SSL=true
✓ MAIL_USERNAME=loja@cortinasbras.com.br
✓ MAIL_PASSWORD=4LuZr4hrFqeTsrZ@
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Aguarde o deploy terminar** (pode levar 2-5 minutos)
2. **Teste `/api/health`** para confirmar que o servidor está respondendo
3. **Teste `/api/test-auth`** para verificar autenticação
4. **Tente fazer login**
5. **Me envie:**
   - Resultado de `/api/health`
   - Resultado de `/api/test-auth`
   - Logs do container (se houver erro)

---

## 📞 INFORMAÇÕES PARA DEBUG

Se precisar de ajuda, me envie:

1. **Status do deploy:** Sucesso ou erro?
2. **Logs do build:** Últimas 50 linhas
3. **Logs do container:** Últimas 50 linhas
4. **Resultado dos endpoints:**
   - `/api/health`
   - `/api/test-auth`
5. **Screenshot da tela de login** (se possível)

---

## ✅ QUANDO TUDO FUNCIONAR

Você verá:
1. ✅ Logo "Cortinas Brás" na tela de login
2. ✅ Login bem-sucedido
3. ✅ Redirecionamento para `/dashboard`
4. ✅ Dashboard funcionando normalmente

**Credenciais:**
```
Email: admin@cortinasbras.com.br
Senha: admin123
```

**⚠️ IMPORTANTE:** Altere a senha após o primeiro login!

---

Última atualização: 30/12/2025 11:53
Commit atual: 6a161d2
