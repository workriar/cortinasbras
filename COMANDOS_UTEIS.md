# 🛠️ Comandos Úteis - Cortinas Brás

Referência rápida de comandos para desenvolvimento e deploy.

---

## 🏠 Desenvolvimento Local

### Setup Inicial
```bash
# Instalar dependências (inclui Chromium automaticamente)
npm install

# Ou instalar Chromium manualmente
npm run setup:chromium

# Configurar ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### Executar
```bash
# Modo desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Verificar ambiente
npm run verify

# Lint
npm run lint
```

---

## 🐳 Docker

### Build e Deploy
```bash
# Build da imagem
docker-compose build --no-cache

# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Rebuild completo
docker-compose down -v && docker-compose build --no-cache && docker-compose up -d
```

### Logs e Monitoramento
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs específicos
docker-compose logs -f cortinas-app

# Ver últimas 100 linhas
docker-compose logs --tail=100

# Status dos containers
docker-compose ps

# Uso de recursos
docker stats cortinas-app

# Health check
docker inspect --format='{{json .State.Health}}' cortinas-app | jq
```

### Acesso ao Container
```bash
# Entrar no container
docker exec -it cortinas-app sh

# Executar comando no container
docker exec cortinas-app npm run verify

# Ver variáveis de ambiente
docker exec cortinas-app env | grep -E 'MAIL|PUPPETEER|DATABASE'

# Verificar Chromium
docker exec cortinas-app which chromium-browser
```

---

## 💾 Banco de Dados

### Backup
```bash
# Criar backup (local)
cp leads.db leads.db.backup-$(date +%Y%m%d)

# Criar backup (Docker)
docker exec cortinas-app cp /app/data/leads.db /app/data/leads.db.backup
docker cp cortinas-app:/app/data/leads.db.backup ./backup-$(date +%Y%m%d).db
```

### Restaurar
```bash
# Restaurar backup (local)
cp leads.db.backup-20251222 leads.db

# Restaurar backup (Docker)
docker cp ./backup-20251222.db cortinas-app:/app/data/leads.db
docker-compose restart
```

### Verificar
```bash
# Ver tamanho do banco
ls -lh leads.db

# Contar leads (requer sqlite3)
sqlite3 leads.db "SELECT COUNT(*) FROM leads;"

# Ver últimos 5 leads
sqlite3 leads.db "SELECT id, nome, telefone, created_at FROM leads ORDER BY id DESC LIMIT 5;"
```

---

## 🔍 Debugging

### Verificação Completa
```bash
# Executar script de verificação
npm run verify

# Verificar dentro do Docker
docker exec cortinas-app npm run verify
```

### Chromium
```bash
# Verificar instalação local
ls -la ~/.cache/puppeteer/chrome/

# Reinstalar Chromium
npm run setup:chromium

# Verificar no Docker
docker exec cortinas-app which chromium-browser
docker exec cortinas-app chromium-browser --version
```

### Testes Manuais
```bash
# Testar endpoint de saúde
curl http://localhost:3000

# Testar API de leads (POST)
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","telefone":"11999999999","largura_parede":"3","altura_parede":"2.5","tecido":"Teste"}'

# Testar PDF de um lead
curl http://localhost:3000/api/leads/1/pdf --output test.pdf
```

---

## 🔄 Git

### Commits
```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push origin main

# Pull
git pull origin main
```

### Branches
```bash
# Criar branch
git checkout -b feature/nova-funcionalidade

# Mudar de branch
git checkout main

# Merge
git merge feature/nova-funcionalidade

# Deletar branch
git branch -d feature/nova-funcionalidade
```

---

## 🌐 Nginx (Produção)

### Configuração
```bash
# Editar configuração
sudo nano /etc/nginx/sites-available/cortinasbras

# Testar configuração
sudo nginx -t

# Recarregar
sudo systemctl reload nginx

# Reiniciar
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### SSL/HTTPS
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d cortinasbras.com.br -d www.cortinasbras.com.br

# Renovar certificados
sudo certbot renew

# Testar renovação
sudo certbot renew --dry-run
```

---

## 📊 Monitoramento

### Logs da Aplicação
```bash
# Logs do Next.js (local)
npm run dev

# Logs do Docker
docker-compose logs -f

# Logs do sistema (Linux)
journalctl -u cortinas-app -f
```

### Performance
```bash
# Uso de CPU/Memória (Docker)
docker stats cortinas-app

# Uso de disco
df -h

# Processos Node
ps aux | grep node

# Portas em uso
netstat -tulpn | grep 3000
```

---

## 🧹 Limpeza

### Local
```bash
# Limpar node_modules
rm -rf node_modules
npm install

# Limpar cache do Next.js
rm -rf .next

# Limpar cache do npm
npm cache clean --force
```

### Docker
```bash
# Remover containers parados
docker container prune

# Remover imagens não usadas
docker image prune

# Remover volumes não usados
docker volume prune

# Limpeza completa (CUIDADO!)
docker system prune -a --volumes
```

---

## 🚀 Deploy Rápido

### Atualização Completa
```bash
# Pull das mudanças
git pull origin main

# Rebuild e restart (Docker)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar
docker-compose logs -f
```

### Rollback
```bash
# Voltar para commit anterior
git log --oneline  # Ver commits
git checkout <commit-hash>

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📱 WhatsApp

### Testar Link
```bash
# Gerar link de teste
echo "https://wa.me/5511992891070?text=Teste"

# Abrir no navegador
xdg-open "https://wa.me/5511992891070?text=Teste"  # Linux
open "https://wa.me/5511992891070?text=Teste"      # Mac
start "https://wa.me/5511992891070?text=Teste"     # Windows
```

---

## 🔐 Segurança

### Variáveis de Ambiente
```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep .env

# Nunca commitar .env
git rm --cached .env  # Se acidentalmente adicionado

# Usar .env.example como template
cp .env.example .env
```

### Permissões (Linux)
```bash
# Ajustar permissões do .env
chmod 600 .env

# Ajustar permissões do banco
chmod 644 leads.db

# Ajustar dono dos arquivos
chown -R www-data:www-data /app/data
```

---

## 📚 Documentação

### Visualizar
```bash
# README
cat README.md

# Deploy
cat DEPLOY.md

# Resumo
cat RESUMO_PREPARACAO.md

# Workflows
cat .agent/workflows/deploy_production.md
cat .agent/workflows/setup_local_development.md
```

---

**Dica:** Adicione este arquivo aos seus favoritos para acesso rápido! 📌
