# 🏢 Cortinas Brás - Sistema Principal

## 📋 Informações do Projeto

- **Nome**: Cortinas Brás
- **Domínio**: https://cortinasbras.com.br
- **Tipo**: Next.js 16 + PostgreSQL + Prisma
- **Container**: `cortinasbras_cortinasbras`
- **Porta**: 3000
- **Repositório**: https://github.com/workriar/cortinasbras.git

---

## 🚀 Como Trabalhar Neste Projeto

### **1. Acessar o Diretório**
```bash
cd /root
# ou
cd /root/projects/cortinasbras
```

### **2. Verificar Status**
```bash
git status
git remote -v  # Deve mostrar: workriar/cortinasbras.git
```

### **3. Fazer Alterações**
```bash
# Editar arquivos
nano src/app/page.tsx

# Ver mudanças
git diff

# Adicionar mudanças
git add .

# Commitar
git commit -m "feat: descrição da mudança"

# Enviar para GitHub
git push origin main
```

### **4. Deploy Automático**
O EasyPanel detecta mudanças no GitHub e faz rebuild automático.

---

## 📁 Estrutura do Projeto

```
/root/ (cortinasbras)
├── src/
│   ├── app/              → Rotas Next.js
│   │   ├── page.tsx      → Landing page
│   │   ├── admin/        → Área admin
│   │   ├── dashboard/    → Dashboard CRM
│   │   └── api/          → API routes
│   ├── components/       → Componentes React
│   ├── services/         → Serviços (DB, Email, PDF)
│   └── lib/              → Utilitários
├── public/               → Assets estáticos
├── prisma/               → Schema do banco
├── package.json          → Dependências
└── .env.local            → Variáveis de ambiente
```

---

## 🔑 Variáveis de Ambiente

Configuradas no EasyPanel:

```bash
# Database
DATABASE_URL=postgresql://...

# Email
MAIL_SERVER=smtp.hostinger.com
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=***

# Auth
NEXTAUTH_URL=https://cortinasbras.com.br
NEXTAUTH_SECRET=***
ADMIN_USERNAME=admin
ADMIN_PASSWORD=***
ADMIN_TOKEN_HASH=***
```

---

## 🛠️ Comandos Úteis

### **Desenvolvimento Local**
```bash
npm install
npm run dev  # http://localhost:3000
```

### **Build**
```bash
npm run build
npm start
```

### **Banco de Dados**
```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio  # Interface visual
```

### **Ver Logs do Container**
```bash
docker ps | grep cortinasbras
docker logs -f <container-id>
```

---

## ⚠️ **IMPORTANTE - Não Afetar Outros Projetos**

### **Antes de Editar:**
1. ✅ Confirme que está em `/root`
2. ✅ Verifique: `git remote -v` → deve mostrar `cortinasbras.git`
3. ✅ Nunca edite arquivos em `/root/projects/bresser` ou `/root/projects/relluarte`

### **Arquivos Específicos Deste Projeto:**
- ✅ `src/` - Código fonte
- ✅ `public/` - Assets
- ✅ `package.json` - Dependências
- ⚠️ **NÃO** edite arquivos de outros projetos!

---

## 📊 Funcionalidades

- ✅ Landing page moderna com animações
- ✅ Formulário de contato com validação
- ✅ Sistema de leads (captura e armazenamento)
- ✅ Dashboard CRM com visualização de leads
- ✅ Geração automática de PDF de orçamento
- ✅ Envio de email com PDF anexado
- ✅ Autenticação admin com middleware
- ✅ Integração Google Ads + Meta Pixel
- ✅ Redirecionamento para WhatsApp

---

## 🔐 Acesso Admin

- **URL**: https://cortinasbras.com.br/admin/login
- **Usuário**: `admin`
- **Senha**: `cortinas2024` (alterar em produção!)

---

## 📝 Changelog Recente

- **06/01/2026**: Implementada autenticação admin com middleware
- **18/12/2025**: Migração para Next.js 16
- **18/12/2025**: Implementado dashboard CRM

---

## 🆘 Suporte

- Documentação geral: `/root/PROJECTS-STRUCTURE.md`
- Documentação de segurança: `/root/SECURITY.md`
- Deploy: `/root/DEPLOY-AUTH.md`

---

**Este é o projeto PRINCIPAL. Edições aqui NÃO afetam Bresser ou Relluarte.**
