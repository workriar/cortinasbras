# 🚀 Guia de Deploy em Produção

## Opção 1: Script Automatizado via PowerShell (Windows)

### Passo a Passo

1. **Abra o PowerShell** (como Administrador se necessário)

2. **Navegue até o diretório do projeto:**
   ```powershell
   cd e:\CB\www\cortinas-app
   ```

3. **Execute o script de deploy remoto:**
   ```powershell
   .\scripts\deploy-remote.ps1
   ```

4. **Forneça as informações quando solicitado:**
   - **IP/Domínio do servidor:** (ex: `cortinasbras.com.br` ou `123.456.789.0`)
   - **Usuário SSH:** (ex: `root`, `ubuntu`, ou seu usuário)
   - **Confirme o deploy:** Digite `S` e pressione Enter

5. **Aguarde o deploy completar** (pode levar alguns minutos)

6. **Verifique se deu certo:**
   - Acesse: https://cortinasbras.com.br
   - Teste o formulário
   - Verifique se não há mais erro `EACCES`

---

## Opção 2: Deploy Manual via SSH

Se preferir fazer manualmente:

1. **Conecte ao servidor:**
   ```powershell
   ssh usuario@cortinasbras.com.br
   ```

2. **Vá para o diretório do projeto:**
   ```bash
   cd /opt/cortinas-app
   # ou
   cd /caminho/para/seu/projeto
   ```

3. **Execute o script de deploy:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

   **OU execute os comandos manualmente:**
   ```bash
   git pull origin main
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   docker-compose logs -f
   ```

---

## Opção 3: Deploy via Painel de Controle

Se seu servidor tem um painel (como Portainer, cPanel, etc.):

1. Acesse o painel
2. Vá para a seção de containers/Docker
3. Pare o container `cortinas-app`
4. Faça pull da imagem ou rebuild
5. Inicie o container novamente

---

## ⚠️ Problemas Comuns

### "Permission denied" ao executar script PowerShell

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois execute o script novamente.

### "SSH não encontrado"

**Solução:**
- Instale o OpenSSH Client no Windows:
  - Configurações → Aplicativos → Recursos Opcionais → Adicionar → OpenSSH Client

### "Não consigo conectar ao servidor"

**Verifique:**
- IP/domínio está correto?
- Porta SSH está aberta? (padrão: 22)
- Você tem as credenciais corretas?
- Firewall não está bloqueando?

---

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

1. **Site está no ar:**
   ```powershell
   curl https://cortinasbras.com.br
   ```

2. **Formulário funciona:**
   - Acesse o site
   - Preencha o formulário
   - Envie
   - Deve redirecionar para WhatsApp

3. **Logs não mostram erro:**
   ```bash
   docker-compose logs --tail=100 | grep -i error
   ```

   Não deve aparecer: `EACCES: permission denied, mkdir '////opt/meu-projeto'`

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. **Verifique os logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Verifique o status:**
   ```bash
   docker-compose ps
   ```

3. **Entre no container para debug:**
   ```bash
   docker exec -it cortinas-app sh
   ls -la /app/data/
   env | grep DATABASE
   ```

---

**Última atualização:** 2025-12-22 11:51 AM
