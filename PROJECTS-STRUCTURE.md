# 🗂️ Estrutura de Projetos - VPS Cortinas

## 📋 **Visão Geral**

Esta VPS hospeda 3 aplicações independentes:

1. **Cortinas Brás** - Sistema principal com CRM
2. **Bresser** - Landing page de cortinas
3. **Relluarte** - Site institucional

---

## 📁 **Estrutura de Diretórios**

```
/root/
├── projects/
│   ├── cortinasbras/     → Link simbólico para /root (repositório principal)
│   ├── bresser/          → Código da aplicação Bresser
│   └── relluarte/        → Código da aplicação Relluarte
│
├── src/                  → Código fonte do Cortinas Brás (atual)
├── public/               → Assets públicos
├── package.json          → Dependências
└── README.md             → Este arquivo
```

---

## 🎯 **Aplicações**

### **1. Cortinas Brás** 
- **Domínio**: `cortinasbras.com.br`
- **Tipo**: Next.js 16 + PostgreSQL
- **Repositório**: https://github.com/workriar/cortinasbras.git
- **Diretório**: `/root` (atual)
- **Container**: `cortinasbras_cortinasbras`
- **Porta**: 3000

**Funcionalidades:**
- ✅ Landing page moderna
- ✅ Sistema de leads
- ✅ Dashboard CRM
- ✅ Geração de PDF
- ✅ Envio de emails
- ✅ Autenticação admin

**Comandos:**
```bash
cd /root
git pull origin main
# Deploy automático via EasyPanel
```

---

### **2. Bresser**
- **Domínio**: `cortinasbresser.com.br`
- **Tipo**: Next.js (standalone)
- **Container**: `bresser_app_cortinas-bresser`
- **Porta**: 80
- **Diretório**: `/root/projects/bresser` (a criar)

**Status**: Container rodando, código fonte a ser clonado

**Comandos:**
```bash
cd /root/projects/bresser
# Comandos específicos do Bresser
```

---

### **3. Relluarte**
- **Domínio**: `relluarte.com.br`
- **Tipo**: Nginx + HTML estático
- **Container**: `relluarte_relluarte`
- **Porta**: 8080
- **Diretório**: `/root/projects/relluarte` (a criar)

**Status**: Container rodando, código fonte a ser clonado

**Comandos:**
```bash
cd /root/projects/relluarte
# Comandos específicos do Relluarte
```

---

## 🔐 **Repositórios Git**

### **Cortinas Brás**
```bash
cd /root
git remote -v
# origin  https://github.com/workriar/cortinasbras.git
```

### **Bresser** (a configurar)
```bash
cd /root/projects/bresser
git init
git remote add origin <URL_DO_REPOSITORIO>
```

### **Relluarte** (a configurar)
```bash
cd /root/projects/relluarte
git init
git remote add origin <URL_DO_REPOSITORIO>
```

---

## 🚀 **Deploy Individual**

### **Cortinas Brás**
```bash
cd /root
git add .
git commit -m "feat: descrição"
git push origin main
# EasyPanel faz rebuild automático
```

### **Bresser**
```bash
cd /root/projects/bresser
# Editar arquivos
# Deploy via EasyPanel ou manual
```

### **Relluarte**
```bash
cd /root/projects/relluarte
# Editar arquivos
# Deploy via EasyPanel ou manual
```

---

## 📊 **Monitoramento**

### **Ver containers rodando:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### **Ver logs:**
```bash
# Cortinas Brás
docker logs -f cortinasbras_cortinasbras.1.<ID>

# Bresser
docker logs -f bresser_app_cortinas-bresser.1.<ID>

# Relluarte
docker logs -f relluarte_relluarte.1.<ID>
```

### **Verificar saúde:**
```bash
curl -I https://cortinasbras.com.br
curl -I https://cortinasbresser.com.br
curl -I https://relluarte.com.br
```

---

## 🛡️ **Isolamento de Projetos**

### **Vantagens da Estrutura Atual:**

1. **Diretórios Separados**: Cada projeto em seu próprio diretório
2. **Git Independente**: Cada projeto com seu próprio repositório
3. **Deploy Isolado**: Mudanças em um não afetam os outros
4. **Redes Docker Separadas**: 
   - `easypanel-cortinasbras`
   - `easypanel-bresser_app`
   - `easypanel-relluarte`

### **Como Editar Sem Afetar Outros:**

1. **Sempre trabalhe no diretório correto:**
   ```bash
   # Para Cortinas Brás
   cd /root
   
   # Para Bresser
   cd /root/projects/bresser
   
   # Para Relluarte
   cd /root/projects/relluarte
   ```

2. **Verifique o repositório antes de commitar:**
   ```bash
   git remote -v  # Confirme que está no repo correto
   ```

3. **Use branches para testes:**
   ```bash
   git checkout -b feature/nova-funcionalidade
   # Teste
   git checkout main
   git merge feature/nova-funcionalidade
   ```

---

## 📝 **Checklist de Segurança**

Antes de fazer qualquer alteração:

- [ ] Confirmar diretório correto (`pwd`)
- [ ] Verificar repositório Git (`git remote -v`)
- [ ] Fazer backup se necessário
- [ ] Testar localmente antes do deploy
- [ ] Commitar com mensagem descritiva
- [ ] Verificar build no EasyPanel

---

## 🆘 **Troubleshooting**

### **Problema: Editei o arquivo errado**
```bash
git status  # Ver o que foi alterado
git diff    # Ver as mudanças
git restore <arquivo>  # Desfazer mudanças
```

### **Problema: Fiz commit no projeto errado**
```bash
git log -1  # Ver último commit
git reset --soft HEAD~1  # Desfazer commit (mantém mudanças)
git reset --hard HEAD~1  # Desfazer commit (remove mudanças)
```

### **Problema: Deploy quebrou**
```bash
# Ver logs do container
docker logs <container-id>

# Fazer rollback no EasyPanel
# Ou reverter commit:
git revert HEAD
git push origin main
```

---

## 📞 **Contatos e Links**

- **EasyPanel**: https://cortinasbresser.com.br:3000
- **GitHub Cortinas Brás**: https://github.com/workriar/cortinasbras
- **Documentação Next.js**: https://nextjs.org/docs

---

**Última atualização**: 06/01/2026  
**Versão**: 1.0.0
