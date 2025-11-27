# 🚀 Guia de Deploy - EasyPanel (Hostinger VPS)

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Preparação do Projeto](#preparação-do-projeto)
3. [Configuração do EasyPanel](#configuração-do-easypanel)
4. [Deploy da Aplicação](#deploy-da-aplicação)
5. [Configuração de Domínio e SSL](#configuração-de-domínio-e-ssl)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Monitoramento e Logs](#monitoramento-e-logs)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Pré-requisitos

### 1. VPS Hostinger Configurado
- ✅ VPS ativo na Hostinger
- ✅ EasyPanel instalado (https://easypanel.io/)
- ✅ Acesso ao painel do EasyPanel
- ✅ Domínio configurado (opcional, mas recomendado)

### 2. Repositório Git
Seu código precisa estar em um repositório Git (GitHub, GitLab, Bitbucket):
- GitHub: https://github.com/seu-usuario/cortinas-app
- Ou repositório privado com acesso configurado

---

## 📦 Preparação do Projeto

### 1. Verifique os Arquivos Criados
Certifique-se de que os seguintes arquivos estão no projeto:
```
cortinas-app/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .env.example
├── app.py
├── requirements.txt
└── templates/
```

### 2. Crie o arquivo .gitignore
Se ainda não existe, crie um arquivo `.gitignore`:

```bash
# Python
__pycache__/
*.py[cod]
venv/
*.db
*.sqlite

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# Hostinger/Produção antiga
passenger_wsgi.py
.htaccess
public_html/
```

### 3. Faça Push para o Git

```bash
# Inicialize o repositório (se ainda não foi feito)
git init

# Adicione todos os arquivos
git add .

# Commit
git commit -m "Preparado para deploy no EasyPanel"

# Adicione o remote (substitua pela URL do seu repo)
git remote add origin https://github.com/seu-usuario/cortinas-app.git

# Push para o repositório
git push -u origin main
```

---

## ⚙️ Configuração do EasyPanel

### 1. Acesse o EasyPanel
1. Acesse o painel: `https://seu-ip-vps:3000` ou `https://easypanel.seu-dominio.com`
2. Faça login com suas credenciais

### 2. Crie um Novo Projeto
1. Clique em **"Create Project"** ou **"New Project"**
2. Nome do projeto: `cortinas-bresser` (ou outro nome de sua preferência)
3. Clique em **"Create"**

### 3. Adicione um Novo Serviço

#### Opção A: Deploy via GitHub (Recomendado)
1. Dentro do projeto, clique em **"Add Service"**
2. Selecione **"GitHub"** ou **"Git Repository"**
3. Conecte sua conta do GitHub (authorize o EasyPanel)
4. Selecione o repositório: `cortinas-app`
5. Branch: `main` (ou `master`)

#### Opção B: Deploy via Docker Compose
1. Clique em **"Add Service"**
2. Selecione **"Docker Compose"**
3. Cole o conteúdo do arquivo `docker-compose.yml`

---

## 🚀 Deploy da Aplicação

### 1. Configurações Básicas do Serviço

**Nome do Serviço:** `cortinas-web`

**Build Settings:**
- Build Context: `/` (raiz do repositório)
- Dockerfile Path: `./Dockerfile`
- Build Command: (deixe em branco, usa o Dockerfile)

**Port Mapping:**
- Container Port: `8000`
- Public Port: `80` (ou outra porta disponível)

### 2. Configure as Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `PRODUCTION` | `true` | Modo produção |
| `SECRET_KEY` | `[gere uma chave segura]` | Chave secreta do Flask |
| `DATABASE_URL` | `sqlite:///leads.db` | URL do banco (SQLite inicial) |
| `MAIL_USERNAME` | `seu-email@dominio.com` | Email SMTP |
| `MAIL_PASSWORD` | `sua-senha` | Senha do email |
| `MAIL_DEFAULT_SENDER` | `contato@cortinasbras.com.br` | Email remetente |

**💡 Dica:** Para gerar uma SECRET_KEY segura:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Volumes (Persistência de Dados)

Para manter os dados do SQLite entre deploys:

1. Vá em **"Volumes"**
2. Adicione um volume:
   - **Nome:** `cortinas-data`
   - **Mount Path:** `/app/instance`
   - **Type:** Persistent

### 4. Health Check (Opcional mas Recomendado)

- **Endpoint:** `/`
- **Interval:** 30s
- **Timeout:** 10s
- **Retries:** 3

### 5. Inicie o Deploy

1. Revise todas as configurações
2. Clique em **"Deploy"** ou **"Save & Deploy"**
3. Aguarde o build e deploy (pode levar 2-5 minutos)

---

## 🌐 Configuração de Domínio e SSL

### 1. Adicionar Domínio Personalizado

**No EasyPanel:**
1. Vá para o serviço `cortinas-web`
2. Clique em **"Domains"**
3. Adicione seu domínio: `cortinasbras.com.br` ou `www.cortinasbras.com.br`

**Na Hostinger (DNS):**
1. Acesse o painel da Hostinger
2. Vá em **"Domains"** → Seu domínio → **"DNS"**
3. Adicione/Edite os registros:

```
Tipo: A
Nome: @ (ou www)
Valor: [IP do seu VPS]
TTL: 3600
```

### 2. Configurar SSL (HTTPS)

O EasyPanel usa Let's Encrypt automaticamente:

1. No EasyPanel, vá em **"Domains"** do seu serviço
2. Clique em **"Enable SSL"** ou **"Request Certificate"**
3. Aguarde a emissão do certificado (1-2 minutos)
4. ✅ Seu site estará com HTTPS ativo!

---

## 🔐 Variáveis de Ambiente

### Configurações de Email (Hostinger)

Se estiver usando email da Hostinger:

```env
MAIL_USERNAME=contato@cortinasbras.com.br
MAIL_PASSWORD=sua_senha_email
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
```

**Configurações SMTP** (já estão no `app.py`):
- Server: `smtp.hostinger.com`
- Port: `587`
- TLS: `True`

> ⚠️ **Nota:** Você pode precisar ajustar o servidor SMTP no `app.py` de `smtplw.com.br` para `smtp.hostinger.com`

### MySQL (Opcional - Para Produção)

Se quiser usar MySQL em vez de SQLite:

**Opção 1: MySQL no mesmo VPS**
```env
DATABASE_URL=mysql://cortinas_user:senha_forte@localhost/cortinas_db
```

**Opção 2: MySQL em Container (descomente no docker-compose.yml)**
```env
DATABASE_URL=mysql://cortinas_user:cortinas_password@db/cortinas_db
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_USER=cortinas_user
MYSQL_PASSWORD=cortinas_password
```

---

## 📊 Monitoramento e Logs

### Visualizar Logs

**No EasyPanel:**
1. Vá para o serviço `cortinas-web`
2. Clique em **"Logs"**
3. Visualize os logs em tempo real

**Via SSH (alternativa):**
```bash
# Conecte ao VPS
ssh usuario@seu-vps-ip

# Liste os containers
docker ps

# Veja os logs do container
docker logs -f [container-id]
```

### Monitoramento de Status

O EasyPanel mostra automaticamente:
- ✅ Status do container (Running/Stopped)
- 📊 Uso de CPU e Memória
- 🌐 Health checks
- 📈 Uptime

---

## 🧪 Testes Após Deploy

### 1. Teste de Conexão
```bash
curl https://cortinasbras.com.br
```

### 2. Teste de Formulário
1. Acesse: `https://cortinasbras.com.br`
2. Preencha o formulário de orçamento
3. Envie e verifique se recebe a confirmação

### 3. Teste de Email
- Verifique se o email foi recebido em `contato@cortinasbras.com.br`
- Confira se o PDF está anexado

### 4. Teste de Banco de Dados
- Acesse: `https://cortinasbras.com.br/admin/leads`
- Verifique se os leads estão sendo salvos

---

## 🔧 Troubleshooting

### Problema: Container não inicia

**Solução:**
1. Veja os logs no EasyPanel
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Teste o build localmente:
```bash
docker build -t cortinas-test .
docker run -p 8000:8000 cortinas-test
```

### Problema: Erro 502 Bad Gateway

**Possíveis causas:**
- Container não está rodando
- Porta incorreta configurada
- Health check falhando

**Solução:**
1. Verifique se a porta `8000` está exposta
2. Teste o health check manualmente:
```bash
curl http://localhost:8000/
```

### Problema: Email não está sendo enviado

**Soluções:**
1. Verifique as variáveis de ambiente de email
2. Teste as credenciais SMTP
3. Verifique os logs para erros específicos
4. Confirme que `PRODUCTION=true` está setado

### Problema: Banco de dados perdendo dados

**Solução:**
- Certifique-se de que o volume está configurado corretamente:
  - Mount Path: `/app/instance`
  - Type: Persistent

### Problema: Build muito lento

**Solução:**
1. Verifique o `.dockerignore`
2. Otimize o Dockerfile (camadas de cache)
3. Use multi-stage builds se necessário

---

## 🔄 Atualizações e Manutenção

### Deploy de Atualizações

**1. Via Git (Deploy Automático):**
```bash
# Faça suas alterações
git add .
git commit -m "Atualização: descrição da mudança"
git push origin main
```

O EasyPanel detecta automaticamente o push e refaz o deploy!

**2. Deploy Manual:**
1. Acesse o EasyPanel
2. Vá para o serviço
3. Clique em **"Rebuild"** ou **"Redeploy"**

### Backup do Banco de Dados

**SQLite:**
```bash
# Conecte ao VPS via SSH
ssh usuario@vps-ip

# Entre no container
docker exec -it [container-id] bash

# Copie o banco
cp /app/instance/leads.db /app/instance/leads.db.backup
```

**Download do backup:**
No EasyPanel, use o File Manager ou via SSH:
```bash
docker cp [container-id]:/app/instance/leads.db ./backup-leads.db
```

---

## 📞 Suporte

### Recursos
- **EasyPanel Docs:** https://easypanel.io/docs
- **Hostinger Support:** https://www.hostinger.com.br/suporte
- **Flask Docs:** https://flask.palletsprojects.com/
- **Docker Docs:** https://docs.docker.com/

### Comandos Úteis

```bash
# Reiniciar container
docker restart [container-id]

# Parar container
docker stop [container-id]

# Iniciar container
docker start [container-id]

# Ver uso de recursos
docker stats

# Limpar containers antigos
docker system prune -a
```

---

## ✅ Checklist Final

Antes de ir para produção:

- [ ] Código no repositório Git
- [ ] Dockerfile e docker-compose.yml criados
- [ ] Variáveis de ambiente configuradas
- [ ] SECRET_KEY gerada e segura
- [ ] Configurações de email corretas
- [ ] Domínio apontando para o VPS
- [ ] SSL configurado (HTTPS)
- [ ] Volume para persistência de dados
- [ ] Testes de formulário funcionando
- [ ] Emails sendo enviados
- [ ] Banco de dados salvando leads
- [ ] Backup configurado

---

## 🎉 Pronto!

Sua aplicação Cortinas Bresser está agora rodando no EasyPanel!

**URL de Produção:** https://cortinasbras.com.br

Bom deploy! 🚀
