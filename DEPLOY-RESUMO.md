# 🎉 PREPARAÇÃO COMPLETA PARA DEPLOY - EASYPANEL

## ✅ Status: PRONTO PARA DEPLOY!

Sua aplicação **Cortinas Bresser** está completamente preparada para deploy no EasyPanel (Hostinger VPS).

---

## 📦 Arquivos Criados

### Configuração Docker
- ✅ `Dockerfile` - Container da aplicação
- ✅ `docker-compose.yml` - Orquestração de containers
- ✅ `.dockerignore` - Otimização do build

### Ambiente e Configuração
- ✅ `.env.example` - Template de variáveis de ambiente
- ✅ `.gitignore` - Exclusão de arquivos sensíveis

### Documentação Completa
- ✅ `README.md` - Visão geral do projeto
- ✅ `DEPLOY-EASYPANEL.md` - Guia passo a passo completo (⭐ PRINCIPAL)
- ✅ `CHECKLIST-DEPLOY.md` - Checklist interativo
- ✅ `TROUBLESHOOTING.md` - Solução de problemas e otimizações

### Scripts Auxiliares
- ✅ `deploy.sh` - Script de deploy para Linux/Mac
- ✅ `deploy.ps1` - Script de deploy para Windows

### Código Atualizado
- ✅ `app.py` - SMTP atualizado para Hostinger (smtp.hostinger.com)
- ✅ `requirements.txt` - Dependências atualizadas

---

## 🚀 Próximos Passos (Ordem de Execução)

### 1️⃣ Preparar Repositório Git

```bash
# Se ainda não tem repositório
git init
git branch -M main

# Adicionar arquivos
git add .

# Commit
git commit -m "Preparado para deploy no EasyPanel"

# Adicionar remote (substitua pela URL do seu repositório)
git remote add origin https://github.com/seu-usuario/cortinas-app.git

# Push
git push -u origin main
```

**Ou use o script:**
```powershell
# Windows
.\deploy.ps1
```

---

### 2️⃣ Configurar EasyPanel

#### a) Acesse o EasyPanel
- URL: `https://seu-vps-ip:3000` ou `https://easypanel.seu-dominio.com`
- Faça login

#### b) Crie um Projeto
- Nome: `cortinas-bresser` (ou o que preferir)

#### c) Adicione um Serviço
- Tipo: **GitHub** (recomendado) ou **Git Repository**
- Repositório: `cortinas-app`
- Branch: `main`

#### d) Configure o Serviço
- Nome: `cortinas-web`
- Build Context: `/`
- Dockerfile: `./Dockerfile`
- Container Port: `8000`
- Public Port: `80`

---

### 3️⃣ Configurar Variáveis de Ambiente

**IMPORTANTE:** Configure TODAS estas variáveis no EasyPanel:

```env
PRODUCTION=true
SECRET_KEY=[GERAR UMA CHAVE SEGURA]
DATABASE_URL=sqlite:///leads.db
MAIL_USERNAME=seu-email@dominio.com
MAIL_PASSWORD=sua-senha-email
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
```

**💡 Gerar SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

### 4️⃣ Configurar Volume (Persistência)

No EasyPanel → Volumes:
- Nome: `cortinas-data`
- Mount Path: `/app/instance`
- Type: **Persistent**

---

### 5️⃣ Deploy!

1. Revise todas as configurações
2. Clique em **"Deploy"** ou **"Save & Deploy"**
3. Aguarde 2-5 minutos
4. ✅ Aplicação rodando!

---

### 6️⃣ Configurar Domínio e SSL

#### No DNS (Hostinger):
```
Tipo: A
Nome: @ (ou www)
Valor: [IP do seu VPS]
```

#### No EasyPanel:
1. Service → Domains
2. Adicionar: `cortinasbras.com.br`
3. Enable SSL (certificado automático)

---

## 📚 Documentação Detalhada

### 📖 Guia Principal
**[DEPLOY-EASYPANEL.md](./DEPLOY-EASYPANEL.md)** - Leia este primeiro!
- Pré-requisitos
- Configuração completa
- Testes e validação
- Monitoramento

### ✅ Checklist
**[CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md)**
- Checklist completo com todos os passos
- Marque conforme avança
- Não esqueça nenhum item importante

### 🔧 Troubleshooting
**[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
- Problemas comuns e soluções
- Otimizações de performance
- Segurança e hardening
- Monitoramento avançado

---

## ⚠️ PONTOS DE ATENÇÃO

### 🔴 CRÍTICO - Faça Antes do Deploy:

1. **Gere uma SECRET_KEY forte**
   - ❌ NÃO use a padrão do código
   - ✅ Use: `python -c "import secrets; print(secrets.token_hex(32))"`

2. **Verifique credenciais de email**
   - Servidor: `smtp.hostinger.com`
   - Porta: `587`
   - TLS: `True`
   - Teste suas credenciais antes

3. **Configure o volume persistente**
   - Sem isso, dados serão perdidos a cada deploy

4. **Não commite o arquivo `.env`**
   - Já está no `.gitignore`
   - Use apenas `.env.example`

---

## 🧪 Testes Pós-Deploy

Após o deploy, teste:

### ✅ Conectividade
```bash
curl https://cortinasbras.com.br
```

### ✅ Funcionalidades
1. Acesse o site
2. Preencha o formulário
3. Envie um orçamento de teste
4. Verifique:
   - WhatsApp redirecionamento funciona
   - Email chegou
   - PDF está anexado
   - Lead foi salvo no banco

### ✅ Admin
```
https://cortinasbras.com.br/admin/leads
```
> ⚠️ Adicione autenticação antes de produção!

---

## 🔒 Checklist de Segurança

Antes de ir para produção:

- [ ] SECRET_KEY forte e única
- [ ] HTTPS configurado (SSL)
- [ ] Senhas de email seguras
- [ ] `.env` não está no Git
- [ ] Admin protegido (ou desabilitado)
- [ ] Redirecionamento HTTP → HTTPS
- [ ] Firewall configurado no VPS
- [ ] Backups configurados

---

## 📊 Estrutura de Arquivos Finais

```
cortinas-app/
├── 📄 Arquivos de Configuração
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .dockerignore
│   ├── .gitignore
│   └── .env.example
│
├── 🐍 Aplicação
│   ├── app.py (✅ SMTP atualizado)
│   ├── requirements.txt (✅ atualizado)
│   ├── templates/
│   └── static/
│
├── 📚 Documentação
│   ├── README.md
│   ├── DEPLOY-EASYPANEL.md ⭐
│   ├── CHECKLIST-DEPLOY.md
│   ├── TROUBLESHOOTING.md
│   └── DEPLOY-RESUMO.md (este arquivo)
│
└── 🛠️ Scripts
    ├── deploy.sh
    └── deploy.ps1
```

---

## 🎯 Fluxo de Deploy Rápido

```
1. Git → Push código para GitHub
         ↓
2. EasyPanel → Conectar repositório
         ↓
3. Config → Variáveis de ambiente + Volume
         ↓
4. Deploy → Aguardar build (2-5 min)
         ↓
5. DNS → Apontar domínio para VPS
         ↓
6. SSL → Ativar certificado (automático)
         ↓
7. Teste → Validar funcionalidades
         ↓
8. ✅ PRODUÇÃO!
```

---

## 💡 Dicas Finais

### Para Deploy Rápido:
1. Use o script `deploy.ps1` (Windows) ou `deploy.sh` (Linux/Mac)
2. Siga o checklist em `CHECKLIST-DEPLOY.md`
3. Em caso de problemas, consulte `TROUBLESHOOTING.md`

### Para Primeira Vez:
1. Leia completamente `DEPLOY-EASYPANEL.md`
2. Não pule nenhum passo do checklist
3. Teste tudo localmente antes

### Para Atualização:
1. Apenas faça `git push`
2. EasyPanel fará rebuild automático
3. Volume mantém os dados

---

## 📞 Suporte

### Recursos:
- 📖 [DEPLOY-EASYPANEL.md](./DEPLOY-EASYPANEL.md) - Guia completo
- ✅ [CHECKLIST-DEPLOY.md](./CHECKLIST-DEPLOY.md) - Checklist
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problemas e soluções
- 🌐 [EasyPanel Docs](https://easypanel.io/docs)
- 🐳 [Docker Docs](https://docs.docker.com/)

### Comandos Úteis:
```bash
# Ver logs
docker logs -f [container-id]

# Reiniciar
docker restart [container-id]

# Status
docker ps

# Entrar no container
docker exec -it [container-id] bash
```

---

## 🎉 TUDO PRONTO!

Sua aplicação está **100% preparada** para deploy.

**Tempo estimado de deploy:** 15-30 minutos (primeira vez)

**Próximo passo:** Abra o arquivo `DEPLOY-EASYPANEL.md` e siga o guia!

---

**Boa sorte com o deploy! 🚀**

**Data de preparação:** 24/11/2025
**Versão:** 1.0
**Status:** ✅ PRONTO PARA PRODUÇÃO
