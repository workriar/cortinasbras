# 🚨 Correção para Produção - DATABASE_URL

## Problema

O erro `EACCES: permission denied, mkdir '////opt/meu-projeto'` está ocorrendo em **produção**, mas não localmente.

## Causa

A variável `DATABASE_URL` no servidor de produção está com valor incorreto ou não está configurada.

## Solução Rápida

### Opção 1: Via SSH (Recomendado)

```bash
# 1. Conectar ao servidor
ssh usuario@seu-servidor

# 2. Ir para o diretório do projeto
cd /caminho/para/cortinas-app

# 3. Editar o .env
nano .env

# 4. Adicionar ou corrigir a linha:
DATABASE_URL=sqlite:/app/data/leads.db

# 5. Salvar (Ctrl+O, Enter, Ctrl+X)

# 6. Reiniciar o container Docker
docker-compose restart

# 7. Verificar logs
docker-compose logs -f
```

### Opção 2: Via Docker Compose (Se usar .env no docker-compose.yml)

Edite o arquivo `docker-compose.yml` e adicione:

```yaml
services:
  web:
    environment:
      - DATABASE_URL=sqlite:/app/data/leads.db
```

Depois:

```bash
docker-compose down
docker-compose up -d
```

### Opção 3: Rebuild Completo

```bash
# Pull das alterações
git pull origin main

# Rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Verificar
docker-compose logs -f
```

## Verificação

Após aplicar a correção, você deve ver nos logs:

```
📁 Usando banco de dados: /app/data/leads.db
📂 Criando diretório: /app/data
```

E **NÃO** deve ver mais:

```
Error: EACCES: permission denied, mkdir '////opt/meu-projeto'
```

## Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver variáveis de ambiente do container
docker exec cortinas-app env | grep DATABASE

# Entrar no container para debug
docker exec -it cortinas-app sh

# Verificar se o banco existe
docker exec cortinas-app ls -la /app/data/

# Testar o formulário
curl -X POST https://cortinasbras.com.br/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","telefone":"11999999999","largura_parede":"3","altura_parede":"2.5","tecido":"Teste"}'
```

## Checklist

- [ ] Conectar ao servidor de produção
- [ ] Verificar/corrigir DATABASE_URL no .env
- [ ] Reiniciar container ou fazer rebuild
- [ ] Verificar logs (deve mostrar caminho correto)
- [ ] Testar formulário
- [ ] Confirmar que não há mais erro EACCES

## Nota Importante

O código já foi corrigido e está no GitHub. Você só precisa:

1. **Fazer pull** das alterações no servidor
2. **Configurar** a variável DATABASE_URL corretamente
3. **Reiniciar** o container

---

**Última atualização:** 2025-12-22 11:43 AM
