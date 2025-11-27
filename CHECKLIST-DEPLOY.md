# ✅ Checklist de Deploy - EasyPanel

## 📋 Preparação (Antes do Deploy)

### Arquivos do Projeto
- [ ] `Dockerfile` criado e testado
- [ ] `docker-compose.yml` configurado
- [ ] `.dockerignore` criado
- [ ] `.env.example` criado
- [ ] `.gitignore` configurado
- [ ] `requirements.txt` atualizado
- [ ] `README.md` criado

### Repositório Git
- [ ] Repositório criado no GitHub/GitLab
- [ ] Código commitado localmente
- [ ] Remote configurado (`git remote add origin <url>`)
- [ ] Código enviado para o repositório (`git push -u origin main`)

### Configurações de Segurança
- [ ] SECRET_KEY gerada (não use a padrão!)
- [ ] Arquivo `.env` NÃO está no Git
- [ ] Credenciais de email preparadas
- [ ] Senhas fortes definidas

---

## 🚀 Deploy no EasyPanel

### 1. Acesso ao EasyPanel
- [ ] VPS da Hostinger ativo
- [ ] EasyPanel instalado
- [ ] Login no EasyPanel realizado (`https://seu-ip:3000`)

### 2. Criação do Projeto
- [ ] Projeto criado no EasyPanel
- [ ] Nome do projeto definido (ex: `cortinas-bresser`)

### 3. Configuração do Serviço
- [ ] Serviço adicionado (GitHub/Git)
- [ ] Repositório conectado
- [ ] Branch selecionada (`main` ou `master`)
- [ ] Nome do serviço definido (ex: `cortinas-web`)

### 4. Build Settings
- [ ] Build Context: `/` (raiz)
- [ ] Dockerfile Path: `./Dockerfile`
- [ ] Auto Deploy ativado (opcional)

### 5. Port Mapping
- [ ] Container Port: `8000`
- [ ] Public Port: `80` (ou porta disponível)

### 6. Variáveis de Ambiente
Configure TODAS estas variáveis no EasyPanel:

- [ ] `PRODUCTION=true`
- [ ] `SECRET_KEY=[sua-chave-gerada]`
- [ ] `DATABASE_URL=sqlite:///leads.db`
- [ ] `MAIL_USERNAME=[seu-email@dominio.com]`
- [ ] `MAIL_PASSWORD=[senha-do-email]`
- [ ] `MAIL_DEFAULT_SENDER=[contato@cortinasbras.com.br]`

**Gerar SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 7. Volumes (Persistência)
- [ ] Volume criado: `cortinas-data`
- [ ] Mount Path: `/app/instance`
- [ ] Type: Persistent

### 8. Health Check
- [ ] Endpoint: `/`
- [ ] Interval: `30s`
- [ ] Timeout: `10s`
- [ ] Retries: `3`

### 9. Deploy Inicial
- [ ] Revisar todas configurações
- [ ] Clicar em "Deploy" ou "Save & Deploy"
- [ ] Aguardar build (2-5 minutos)
- [ ] Verificar status: **Running** ✅

---

## 🌐 Configuração de Domínio

### DNS (Hostinger)
- [ ] Acessar painel da Hostinger
- [ ] Ir em Domains → [seu-dominio] → DNS
- [ ] Adicionar/editar registro A:
  - Tipo: `A`
  - Nome: `@` (ou `www`)
  - Valor: `[IP-do-VPS]`
  - TTL: `3600`

### EasyPanel
- [ ] Acessar serviço no EasyPanel
- [ ] Ir em "Domains"
- [ ] Adicionar domínio: `cortinasbras.com.br`
- [ ] Aguardar propagação DNS (5-30 minutos)

### SSL/HTTPS
- [ ] No EasyPanel → Domains → "Enable SSL"
- [ ] Aguardar emissão do certificado (1-2 minutos)
- [ ] Verificar HTTPS funcionando ✅

---

## 🧪 Testes de Produção

### Teste de Conectividade
- [ ] Site acessível via HTTP
- [ ] Site acessível via HTTPS
- [ ] Redirecionamento HTTP → HTTPS funcionando

### Teste de Funcionalidades
- [ ] Página inicial carrega corretamente
- [ ] Formulário de orçamento visível
- [ ] Campos do formulário funcionam
- [ ] Validação de campos funciona

### Teste de Submissão
- [ ] Preencher formulário de teste
- [ ] Enviar orçamento
- [ ] Verificar mensagem de sucesso
- [ ] Confirmar redirecionamento WhatsApp (se aplicável)

### Teste de Email
- [ ] Email recebido em `contato@cortinasbras.com.br`
- [ ] PDF anexado ao email
- [ ] Dados do formulário corretos no email
- [ ] Dados do formulário corretos no PDF

### Teste de Banco de Dados
- [ ] Acessar `/admin/leads`
- [ ] Verificar que o lead foi salvo
- [ ] Dados corretos no banco

### Teste de Persistência
- [ ] Fazer um deploy/rebuild
- [ ] Verificar que dados antigos persistem
- [ ] Volume funcionando corretamente

---

## 📊 Monitoramento

### Logs
- [ ] Logs acessíveis no EasyPanel
- [ ] Sem erros críticos nos logs
- [ ] Aplicação iniciando corretamente

### Métricas
- [ ] Container em estado "Running"
- [ ] Health check: ✅ Healthy
- [ ] Uso de CPU normal
- [ ] Uso de memória normal

---

## 🔒 Segurança

### Checklist de Segurança
- [ ] HTTPS ativo (SSL configurado)
- [ ] Redirecionamento HTTP → HTTPS
- [ ] SECRET_KEY forte e única
- [ ] Senhas de email seguras
- [ ] `.env` não está no Git
- [ ] Credenciais não estão hardcoded
- [ ] Admin protegido (ou desabilitado)

---

## 📝 Documentação

### Arquivos Criados
- [ ] README.md completo
- [ ] DEPLOY-EASYPANEL.md detalhado
- [ ] .env.example com todas variáveis
- [ ] Comentários no código atualizados

### Informações Salvas
- [ ] URL de produção documentada
- [ ] Credenciais salvas em lugar seguro
- [ ] IPs e portas documentados
- [ ] Configurações de email documentadas

---

## 🎉 Finalização

### Validação Final
- [ ] Site em produção funcionando
- [ ] HTTPS ativo
- [ ] Formulários testados e funcionando
- [ ] Emails sendo enviados e recebidos
- [ ] Banco de dados persistindo dados
- [ ] Domínio personalizado ativo
- [ ] Monitoramento configurado
- [ ] Backups configurados (ou planejados)

### Comunicação
- [ ] Cliente/usuário informado
- [ ] URL compartilhada
- [ ] Treinamento realizado (se necessário)

---

## 📞 Suporte e Próximos Passos

### Melhorias Futuras
- [ ] Configurar backup automático do banco
- [ ] Adicionar autenticação no admin
- [ ] Configurar monitoramento avançado
- [ ] Otimizar performance (cache, CDN)
- [ ] Implementar analytics

### Recursos
- 📖 [Guia Completo: DEPLOY-EASYPANEL.md](./DEPLOY-EASYPANEL.md)
- 🌐 [EasyPanel Docs](https://easypanel.io/docs)
- 🐳 [Docker Docs](https://docs.docker.com/)
- 🐍 [Flask Docs](https://flask.palletsprojects.com/)

---

**Status do Deploy:** ⬜ Pendente | 🔄 Em Progresso | ✅ Completo

**Data do Deploy:** ___/___/______

**Responsável:** _________________

---

## 🚨 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Container não inicia | Verificar logs no EasyPanel |
| Erro 502 | Verificar porta e health check |
| Email não envia | Verificar variáveis MAIL_* |
| Dados perdidos | Verificar configuração do volume |
| SSL não funciona | Aguardar propagação DNS (30min) |

**Comandos Úteis:**
```bash
# Ver logs
docker logs -f [container-id]

# Reiniciar
docker restart [container-id]

# Status
docker ps
```

---

✅ **Ao completar todos os itens, seu deploy está pronto!**
