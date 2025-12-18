# Plano de Correção - Deploy no EasyPanel

## Problema Identificado

O EasyPanel está falhando ao fazer **pull do repositório GitHub**:
```
Pulling data from origin/main
Error: Failed to pull changes
```

## Causa Raiz

O EasyPanel não consegue autenticar com o GitHub via SSH. Possíveis causas:
1. Chave SSH não configurada no EasyPanel
2. Repositório privado sem permissões
3. Deploy key não adicionada ao GitHub

---

## Soluções Propostas

### Solução 1: Configurar Deploy Key no GitHub (Recomendado)

#### No EasyPanel:
1. Acesse seu projeto no EasyPanel
2. Vá em **Settings** → **Git**
3. Copie a **Deploy Key** pública (SSH key)

#### No GitHub:
1. Acesse: https://github.com/workriar/cortinasbras/settings/keys
2. Clique em **Add deploy key**
3. Cole a chave pública do EasyPanel
4. ✅ Marque **Allow write access** (se necessário)
5. Salve

#### No EasyPanel:
1. Clique em **Rebuild** ou **Redeploy**

---

### Solução 2: Usar HTTPS em vez de SSH

Se o repositório for público ou você preferir usar token:

#### Atualizar Remote para HTTPS:
```bash
git remote set-url origin https://github.com/workriar/cortinasbras.git
git push origin main
```

#### No EasyPanel:
1. Vá em **Settings** → **Git**
2. Altere a URL do repositório para: `https://github.com/workriar/cortinasbras.git`
3. Se privado, adicione um **Personal Access Token**

---

### Solução 3: Deploy Manual via Docker Hub

Se as soluções acima não funcionarem:

#### 1. Build e Push para Docker Hub:
```bash
# Login no Docker Hub
docker login

# Build da imagem
docker build -t seu-usuario/cortinasbras:latest .

# Push para Docker Hub
docker push seu-usuario/cortinasbras:latest
```

#### 2. No EasyPanel:
1. Mude o tipo de deploy para **Docker Image**
2. Use a imagem: `seu-usuario/cortinasbras:latest`

---

### Solução 4: Verificar Configurações do EasyPanel

Verificar se:
- ✅ Branch correta está configurada (`main`)
- ✅ URL do repositório está correta
- ✅ Permissões de acesso estão configuradas
- ✅ Não há conflitos de merge no servidor

---

## Próximos Passos

1. **Verificar qual solução você prefere**
2. **Configurar Deploy Key** (mais simples e seguro)
3. **Testar deploy novamente**

---

## Informações Adicionais

**Repositório:** `git@github.com:workriar/cortinasbras.git`  
**Branch:** `main`  
**Último commit:** `80775cc - Atualizar .gitignore`

---

## Comandos Úteis

### Verificar conectividade SSH no servidor:
```bash
ssh -T git@github.com
```

### Forçar pull no servidor:
```bash
cd /caminho/do/projeto
git fetch origin
git reset --hard origin/main
```
