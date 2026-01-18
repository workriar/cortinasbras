# 🚀 Deploy - Autenticação Admin

## ✅ Arquivos Enviados para o GitHub

- ✅ `src/middleware.ts` - Middleware de proteção
- ✅ `src/app/admin/login/page.tsx` - Página de login
- ✅ `src/app/api/admin/auth/login/route.ts` - API de login
- ✅ `src/app/api/admin/auth/logout/route.ts` - API de logout
- ✅ `.env.example` - Variáveis de ambiente atualizadas

## 📋 Próximos Passos no EasyPanel

### 1. **Fazer Rebuild da Aplicação**

No EasyPanel:
1. Acesse o projeto **cortinasbras**
2. Clique em **"Rebuild"** ou **"Deploy"**
3. Aguarde o build completar (pode levar 2-5 minutos)

### 2. **Configurar Variáveis de Ambiente**

No EasyPanel, adicione as seguintes variáveis de ambiente:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cortinas2024
ADMIN_TOKEN_HASH=admin-secret-2024
```

**⚠️ IMPORTANTE**: Altere estas credenciais em produção!

### 3. **Testar o Login**

Após o rebuild:
1. Acesse: `https://cortinasbras.com.br/admin/login`
2. Entre com:
   - Usuário: `admin`
   - Senha: `cortinas2024`
3. Deve redirecionar para `/dashboard/crm`

## 🔐 Segurança

### **Alterar Credenciais em Produção**

Gere credenciais seguras:

```bash
# Gerar senha forte
openssl rand -base64 32

# Gerar token hash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Atualize no EasyPanel:
- `ADMIN_USERNAME`: Escolha um nome de usuário único
- `ADMIN_PASSWORD`: Use a senha gerada acima
- `ADMIN_TOKEN_HASH`: Use o hash gerado acima

## 📝 Troubleshooting

### Problema: 404 na página de login

**Solução**: Aguarde o rebuild completar no EasyPanel

### Problema: Credenciais não funcionam

**Solução**: Verifique se as variáveis de ambiente estão configuradas corretamente no EasyPanel

### Problema: Redirecionamento infinito

**Solução**: Limpe os cookies do navegador e tente novamente

## ✅ Checklist de Deploy

- [ ] Código enviado para o GitHub
- [ ] Rebuild iniciado no EasyPanel
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de login realizado
- [ ] Credenciais alteradas para produção
- [ ] Documentação revisada

---

**Data**: 06/01/2026  
**Versão**: 1.0.0  
**Status**: Aguardando rebuild no EasyPanel
