# 🚀 Guia Rápido - Trabalhar com Múltiplos Projetos

## ✅ **Estrutura Criada!**

Agora você tem acesso organizado a todos os 3 projetos:

```
📁 /root/projects/
├── 🏢 cortinasbras/   → Sistema principal (CRM + Landing)
├── 🎨 bresser/        → Landing page Bresser
└── 🏛️ relluarte/      → Site institucional
```

---

## 🎯 **Comandos Rápidos**

### **Carregar Helper (primeira vez)**
```bash
source /root/project-helper.sh
```

### **Navegar Entre Projetos**
```bash
cb    # Ir para Cortinas Brás
br    # Ir para Bresser
rl    # Ir para Relluarte
```

### **Ver Informações**
```bash
projects    # Listar todos os projetos
current     # Ver projeto atual
project_help    # Ver ajuda completa
```

---

## 📝 **Fluxo de Trabalho**

### **Exemplo: Editar Cortinas Brás**
```bash
# 1. Ir para o projeto
cb

# 2. Verificar status
git status
current

# 3. Fazer alterações
nano src/app/page.tsx

# 4. Commitar
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### **Exemplo: Editar Bresser**
```bash
# 1. Ir para o projeto
br

# 2. Verificar que está no projeto correto
current

# 3. Fazer alterações
# (editar arquivos)

# 4. Deploy
# (conforme configuração do projeto)
```

---

## ⚠️ **Regras de Ouro**

### **Sempre Verifique Antes de Editar:**

1. ✅ **Confirme o diretório:**
   ```bash
   pwd    # Deve mostrar o diretório correto
   ```

2. ✅ **Confirme o repositório:**
   ```bash
   git remote -v    # Deve mostrar o repo correto
   ```

3. ✅ **Use o helper:**
   ```bash
   current    # Mostra projeto atual
   ```

---

## 🎨 **Visual dos Projetos**

```
┌─────────────────────────────────────────────────────┐
│  🏢 CORTINAS BRÁS                                   │
├─────────────────────────────────────────────────────┤
│  📂 /root                                           │
│  🌐 cortinasbras.com.br                            │
│  🔧 Next.js 16 + PostgreSQL                        │
│  📦 Container: cortinasbras_cortinasbras           │
│  ⚡ Comando: cb                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🎨 BRESSER                                         │
├─────────────────────────────────────────────────────┤
│  📂 /root/projects/bresser                         │
│  🌐 cortinasbresser.com.br                         │
│  🔧 Next.js (standalone)                           │
│  📦 Container: bresser_app_cortinas-bresser        │
│  ⚡ Comando: br                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🏛️ RELLUARTE                                       │
├─────────────────────────────────────────────────────┤
│  📂 /root/projects/relluarte                       │
│  🌐 relluarte.com.br                               │
│  🔧 Nginx + HTML                                   │
│  📦 Container: relluarte_relluarte                 │
│  ⚡ Comando: rl                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🛡️ **Isolamento Garantido**

### **Como Funciona:**

1. **Diretórios Separados**: Cada projeto em sua pasta
2. **Git Independente**: Cada um com seu repositório
3. **Redes Docker Isoladas**: Comunicação separada
4. **Deploy Independente**: Mudanças não afetam outros

### **Benefícios:**

- ✅ Edite um projeto sem medo de quebrar outros
- ✅ Commits vão para o repositório correto
- ✅ Deploys são isolados
- ✅ Fácil navegação com comandos curtos

---

## 📚 **Documentação Completa**

- **Estrutura Geral**: `/root/PROJECTS-STRUCTURE.md`
- **Cortinas Brás**: `/root/projects/cortinasbras/README.md`
- **Bresser**: `/root/projects/bresser/README.md`
- **Relluarte**: `/root/projects/relluarte/README.md`

---

## 🆘 **Troubleshooting**

### **Problema: Comandos não funcionam**
```bash
source /root/project-helper.sh
```

### **Problema: Não sei em qual projeto estou**
```bash
current
```

### **Problema: Editei o arquivo errado**
```bash
git status    # Ver mudanças
git restore <arquivo>    # Desfazer
```

---

## ✨ **Dicas Pro**

1. **Sempre use `current` antes de editar**
2. **Use `cb`, `br`, `rl` para navegar rapidamente**
3. **Verifique `git remote -v` antes de push**
4. **Faça commits descritivos**
5. **Teste localmente antes do deploy**

---

**Agora você pode trabalhar com segurança em cada projeto sem afetar os outros!** 🎉
