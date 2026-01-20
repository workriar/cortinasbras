# ✅ Checklist Pré-Deploy - Cortinas Brás

## 📋 Verificação Realizada em: 2026-01-20 13:43

### ✅ Código
- [x] ContactForm.tsx - Melhorado com logs e fallback
- [x] API /api/leads/route.ts - Logging detalhado adicionado
- [x] Tratamento de erros aprimorado
- [x] Commit realizado (56b70b3)
- [x] Push para main concluído

### ⚠️ Configuração de Email
- [ ] **AÇÃO NECESSÁRIA**: Variáveis de email no .env local
- [ ] **AÇÃO NECESSÁRIA**: Variáveis de email configuradas no EasyPanel/Produção

**Arquivo atual `/root/.env`:**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=supersecretkey123456789abcdef
DATABASE_URL="file:./leads.db"
```

**Variáveis que precisam ser adicionadas:**
```env
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USE_SSL=true
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=<senha_que_você_configurou>
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=cortinasbras@gmail.com
```

### 📚 Documentação
- [x] GUIA_CORRECAO_FORMULARIO.md criado
- [x] RESUMO_CORRECAO.md criado
- [x] DIAGNOSTICO_FORMULARIO.md criado
- [x] .env.production.example criado

### 🚀 Deploy
- [ ] Configurar variáveis de ambiente no EasyPanel
- [ ] Trigger deploy
- [ ] Verificar logs após deploy
- [ ] Testar formulário em produção

---

## 🎯 Próximos Passos

### 1. Configurar Email no EasyPanel

Acesse o painel do EasyPanel e adicione estas variáveis de ambiente:

```
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USE_SSL=true
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=<sua_senha>
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=cortinasbras@gmail.com
```

### 2. Fazer Deploy

Após configurar as variáveis, execute:
```bash
curl -X POST "http://31.97.247.205:3000/api/deploy/e92f59e147a5ea18038547a3e9499c8c8d3bc6f0b2879b9a"
```

### 3. Verificar

- [ ] Logs do container
- [ ] Teste do formulário
- [ ] Email recebido
- [ ] WhatsApp abrindo

---

## ⚠️ IMPORTANTE

**O deploy só deve ser feito APÓS configurar as variáveis de email no EasyPanel!**

Caso contrário, o email continuará não funcionando em produção.
