# 🔧 Troubleshooting e Otimização - EasyPanel

## 🚨 Problemas Comuns e Soluções

### 1. Container não inicia

#### Sintomas:
- Status: "Exited" ou "Error"
- Container reinicia constantemente
- Build falha

#### Diagnóstico:
```bash
# Ver logs do container
docker logs [container-id]

# Ver últimas 100 linhas
docker logs --tail 100 [container-id]

# Seguir logs em tempo real
docker logs -f [container-id]
```

#### Soluções:

**a) Erro de dependências:**
```bash
# Verificar se todas dependências estão no requirements.txt
pip freeze > requirements.txt
```

**b) Porta já em uso:**
- Altere a porta pública no EasyPanel
- Ou mate o processo que está usando a porta

**c) Variáveis de ambiente faltando:**
- Verifique se TODAS as variáveis estão configuradas
- Principalmente: `SECRET_KEY`, `MAIL_USERNAME`, `MAIL_PASSWORD`

---

### 2. Erro 502 Bad Gateway

#### Sintomas:
- Ao acessar o site: "502 Bad Gateway"
- EasyPanel mostra container "Running"

#### Causas Comuns:
1. Aplicação não está escutando na porta correta
2. Health check falhando
3. Aplicação crashando após iniciar

#### Soluções:

**Verificar se a aplicação está rodando:**
```bash
# Entrar no container
docker exec -it [container-id] bash

# Testar internamente
curl http://localhost:8000

# Ver processos
ps aux | grep gunicorn
```

**Verificar configuração de porta:**
- Container Port: `8000` (no EasyPanel)
- Gunicorn bind: `0.0.0.0:8000` (no Dockerfile)

**Desabilitar health check temporariamente:**
- Para testar se o problema é o health check
- No EasyPanel → Service → Health Check → Desabilitar

---

### 3. Build está lento ou trava

#### Sintomas:
- Build demora mais de 10 minutos
- Build trava em alguma etapa
- Timeout no build

#### Soluções:

**Otimizar Dockerfile:**
```dockerfile
# Adicionar cache de pip
RUN pip install --no-cache-dir -r requirements.txt

# Usar multi-stage build
FROM python:3.11-slim as builder
# ... build steps

FROM python:3.11-slim
COPY --from=builder /app /app
```

**Verificar .dockerignore:**
- Adicionar pastas grandes (venv, node_modules)
- Verificar se está excluindo arquivos desnecessários

**Aumentar timeout:**
- No EasyPanel → Service → Settings → Build Timeout

---

### 4. Email não está sendo enviado

#### Sintomas:
- Formulário funciona mas email não chega
- Sem erros visíveis

#### Diagnóstico:
```bash
# Ver logs específicos de email
docker logs [container-id] | grep -i mail
docker logs [container-id] | grep -i email
docker logs [container-id] | grep -i smtp
```

#### Soluções:

**a) Verificar variáveis de ambiente:**
```env
PRODUCTION=true  # IMPORTANTE! Email só envia em produção
MAIL_USERNAME=seu-email@dominio.com
MAIL_PASSWORD=sua-senha-correta
MAIL_DEFAULT_SENDER=contato@cortinasbras.com.br
```

**b) Verificar servidor SMTP:**
- Hostinger: `smtp.hostinger.com`
- Porta: `587`
- TLS: `True`

**c) Testar credenciais SMTP:**
```python
# Script de teste (execute no container)
from flask_mail import Mail, Message
import os

app.config['MAIL_SERVER'] = 'smtp.hostinger.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'seu-email@dominio.com'
app.config['MAIL_PASSWORD'] = 'sua-senha'

mail = Mail(app)
msg = Message('Teste', recipients=['test@example.com'])
msg.body = 'Email de teste'
mail.send(msg)
```

**d) Verificar firewall:**
- Porta 587 deve estar aberta no VPS
- Verificar se a Hostinger não está bloqueando

---

### 5. Banco de dados perdendo dados

#### Sintomas:
- Após rebuild, dados desaparecem
- Leads não persistem

#### Causa:
- Volume não configurado corretamente

#### Solução:

**Configurar volume persistente:**

No EasyPanel:
1. Service → Volumes → Add Volume
2. Configurações:
   - Nome: `cortinas-data`
   - Mount Path: `/app/instance`
   - Type: **Persistent** (não "Temporary")

**Verificar volume:**
```bash
# Listar volumes
docker volume ls

# Inspecionar volume
docker volume inspect [volume-name]

# Ver conteúdo
docker run --rm -v cortinas-data:/data alpine ls -la /data
```

---

### 6. SSL/HTTPS não funciona

#### Sintomas:
- Domínio funciona via HTTP mas não HTTPS
- Certificado não é emitido
- Erro "Not Secure" no navegador

#### Soluções:

**a) Verificar DNS:**
```bash
# Verificar se o domínio aponta para o IP correto
nslookup cortinasbras.com.br

# Ou
dig cortinasbras.com.br
```

**b) Aguardar propagação:**
- DNS pode demorar até 48h (normalmente 1-2h)
- Use `https://dnschecker.org` para verificar propagação

**c) Forçar renovação de certificado:**
- No EasyPanel → Domains → Disable SSL
- Aguardar 1 minuto
- Enable SSL novamente

**d) Verificar porta 443:**
```bash
# No VPS, verificar se porta está aberta
netstat -tlnp | grep :443

# Verificar firewall
sudo ufw status
```

---

### 7. Alta Latência / Lentidão

#### Sintomas:
- Site demora para carregar
- Timeout em requisições

#### Diagnóstico:
```bash
# Verificar uso de recursos
docker stats [container-id]

# Verificar logs de performance
docker logs [container-id] | grep -i "timeout\|slow"
```

#### Soluções:

**a) Aumentar workers do Gunicorn:**

No `Dockerfile`, altere:
```dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "app:app"]
```

Para:
```dockerfile
# Fórmula: (2 x CPU cores) + 1
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "5", "--timeout", "120", "--threads", "2", "app:app"]
```

**b) Otimizar banco de dados:**

SQLite → MySQL para melhor performance:
```env
DATABASE_URL=mysql://usuario:senha@localhost/cortinas_db
```

**c) Adicionar cache:**
```python
# No app.py
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/')
@cache.cached(timeout=300)  # 5 minutos
def index():
    return render_template('index.html')
```

---

## 🚀 Otimizações de Performance

### 1. Configuração de Gunicorn

**Melhor configuração para VPS pequeno (1-2 CPU):**
```dockerfile
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--threads", "2", \
     "--worker-class", "sync", \
     "--timeout", "120", \
     "--keepalive", "5", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "50", \
     "app:app"]
```

**Para VPS médio (4 CPU):**
```dockerfile
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "9", \
     "--threads", "2", \
     "--timeout", "120", \
     "app:app"]
```

### 2. Otimizar Docker Image

**Reduzir tamanho da imagem:**
```dockerfile
# Multi-stage build
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]
```

### 3. Adicionar Proxy Reverso (Nginx)

**docker-compose.yml com Nginx:**
```yaml
version: '3.8'

services:
  web:
    build: .
    expose:
      - "8000"
    environment:
      - PRODUCTION=true
    volumes:
      - ./instance:/app/instance
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    restart: unless-stopped
```

### 4. Configurar Logs Estruturados

**No app.py:**
```python
import logging
from logging.handlers import RotatingFileHandler

if os.environ.get('PRODUCTION'):
    handler = RotatingFileHandler('logs/app.log', maxBytes=10000000, backupCount=3)
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    )
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
```

---

## 📊 Monitoramento Avançado

### 1. Health Checks Personalizados

**Criar endpoint de health:**
```python
@app.route('/health')
def health():
    # Verificar banco de dados
    try:
        db.session.execute('SELECT 1')
        db_status = 'ok'
    except:
        db_status = 'error'
    
    # Verificar email (opcional)
    mail_status = 'ok' if app.config.get('MAIL_USERNAME') else 'not_configured'
    
    return {
        'status': 'healthy',
        'database': db_status,
        'mail': mail_status
    }, 200
```

**Configurar no EasyPanel:**
- Health Check Endpoint: `/health`
- Expected Status: `200`

### 2. Métricas com Prometheus (Avançado)

```python
from prometheus_flask_exporter import PrometheusMetrics

metrics = PrometheusMetrics(app)

# Métricas automáticas
metrics.info('app_info', 'Application info', version='1.0.0')
```

---

## 🔒 Hardening de Segurança

### 1. Limitar Taxa de Requests (Rate Limiting)

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/enviar', methods=['POST'])
@limiter.limit("5 per minute")
def enviar():
    # ... seu código
```

### 2. Proteção do Admin

```python
from functools import wraps
from flask import request, abort

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_token = request.headers.get('Authorization')
        if auth_token != os.environ.get('ADMIN_TOKEN'):
            abort(401)
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/leads')
@require_auth
def admin_leads():
    # ... seu código
```

### 3. CORS Seguro

```python
from flask_cors import CORS

CORS(app, resources={
    r"/*": {
        "origins": ["https://cortinasbras.com.br"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## 🔄 CI/CD Automático

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EasyPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Trigger EasyPanel Deploy
        run: |
          curl -X POST https://easypanel.io/api/deploy \
            -H "Authorization: Bearer ${{ secrets.EASYPANEL_TOKEN }}" \
            -d '{"project": "cortinas-bresser"}'
```

---

## 📞 Comandos Úteis Rápidos

```bash
# Ver todos containers
docker ps -a

# Ver uso de recursos
docker stats

# Entrar no container
docker exec -it [container-id] bash

# Reiniciar container
docker restart [container-id]

# Ver logs das últimas 100 linhas
docker logs --tail 100 [container-id]

# Seguir logs em tempo real
docker logs -f [container-id]

# Backup do banco SQLite
docker cp [container-id]:/app/instance/leads.db ./backup.db

# Limpar images antigas
docker system prune -a

# Ver tamanho das images
docker images

# Rebuild forçado
docker build --no-cache -t cortinas-app .
```

---

## 🎯 Performance Benchmarks

### Testes de Carga

```bash
# Instalar Apache Bench
sudo apt-get install apache2-utils

# Teste simples
ab -n 1000 -c 10 https://cortinasbras.com.br/

# Teste com POST
ab -n 100 -c 10 -p post_data.txt -T application/x-www-form-urlencoded https://cortinasbras.com.br/enviar
```

### Resultados Esperados

| Métrica | Valor Ideal |
|---------|-------------|
| Response Time | < 200ms |
| Requests/sec | > 50 |
| Uptime | > 99.9% |
| Error Rate | < 0.1% |

---

**📖 Referências:**
- [Gunicorn Docs](https://docs.gunicorn.org/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Flask Production](https://flask.palletsprojects.com/en/2.3.x/deploying/)
