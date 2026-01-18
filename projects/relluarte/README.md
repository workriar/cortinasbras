# 🏛️ Relluarte - Site Institucional

## 📋 Informações do Projeto

- **Nome**: Relluarte
- **Domínio**: https://relluarte.com.br
- **Tipo**: Nginx + HTML estático
- **Container**: `relluarte_relluarte`
- **Porta**: 8080
- **Repositório**: (a configurar)

---

## 🚀 Como Trabalhar Neste Projeto

### **1. Acessar o Diretório**
```bash
cd /root/projects/relluarte
```

### **2. Clonar Repositório (se necessário)**
```bash
# Se o código ainda não estiver aqui
git clone <URL_DO_REPOSITORIO> .
```

### **3. Fazer Alterações**
```bash
# Editar arquivos HTML/CSS
nano index.html

# Ver mudanças
git diff

# Adicionar mudanças
git add .

# Commitar
git commit -m "feat: descrição da mudança"

# Enviar
git push origin main
```

---

## 📁 Estrutura (Estimada)

```
/root/projects/relluarte/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── images/
└── nginx.conf
```

---

## 🛠️ Comandos Úteis

### **Ver Container**
```bash
docker ps | grep relluarte
docker logs -f relluarte_relluarte.1.<ID>
```

### **Testar Site**
```bash
curl -I https://relluarte.com.br
```

### **Copiar Arquivos para Container (se necessário)**
```bash
docker cp index.html <container-id>:/usr/share/nginx/html/
docker exec <container-id> nginx -s reload
```

---

## ⚠️ **IMPORTANTE - Isolamento**

### **Este Projeto É Independente:**
- ✅ Edições aqui **NÃO** afetam Cortinas Brás
- ✅ Edições aqui **NÃO** afetam Bresser
- ✅ Sempre confirme: `pwd` → deve mostrar `/root/projects/relluarte`

### **Não Edite:**
- ❌ Arquivos em `/root` (Cortinas Brás)
- ❌ Arquivos em `/root/projects/bresser`

---

## 📊 Status

- ✅ Container rodando
- ✅ Site acessível
- ⏳ Código fonte a ser organizado neste diretório

---

## 🆘 Suporte

- Documentação geral: `/root/PROJECTS-STRUCTURE.md`

---

**Este projeto é INDEPENDENTE. Edições aqui são isoladas.**
