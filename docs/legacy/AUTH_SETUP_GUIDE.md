# 🔐 Guia de Configuração de Autenticação

## Problema: "Server error" ou "Credenciais inválidas"

Este guia resolve os dois problemas principais de autenticação.

---

## 1️⃣ Configurar Variáveis de Ambiente no Easypanel

### Passo 1: Adicionar NEXTAUTH_URL
1. Acesse: **Easypanel** → **Services** → **cortinasbras** → **Environment**
2. Adicione a variável:
```
NEXTAUTH_URL=https://cortinasbras.com.br
```

### Passo 2: Adicionar NEXTAUTH_SECRET
Adicione a variável com o secret gerado:
```
NEXTAUTH_SECRET=diNoE59ufbd+4XI/A1MPQ657t216G3WTT3Ok4B3ktEo=
```

### Passo 3: Salvar e Fazer Deploy
1. Clique em **Save**
2. Aguarde o deploy automático ou force um novo deploy

---

## 2️⃣ Criar Usuário Admin no PostgreSQL

### Opção A: Usando pgAdmin (Recomendado)

1. Abra o **pgAdmin** e conecte ao banco `cortinas_leads`
2. Abra o **Query Tool**
3. Execute o script `create-admin-user.sql`:

```sql
-- Criar tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário admin
INSERT INTO "User" (email, name, "passwordHash", role)
VALUES (
    'admin@cortinasbras.com.br',
    'Administrador',
    '$2b$10$S.7Z7DqV8SNqkxP4rgY7XuCQ1TOZgodRX77ZojBsV5aw.aCKuCvd.',
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE
SET 
    name = EXCLUDED.name,
    "passwordHash" = EXCLUDED."passwordHash",
    role = EXCLUDED.role,
    "updatedAt" = CURRENT_TIMESTAMP;

-- Verificar se o usuário foi criado
SELECT id, email, name, role, "createdAt" FROM "User" WHERE email = 'admin@cortinasbras.com.br';
```

### Opção B: Usando Console do Easypanel

1. Acesse: **Easypanel** → **Databases** → **cortinas-db** → **Console**
2. Execute os comandos SQL acima

---

## 3️⃣ Credenciais de Acesso

Após executar o script SQL, use estas credenciais para fazer login:

```
Email: admin@cortinasbras.com.br
Senha: admin123
```

**⚠️ IMPORTANTE:** Altere a senha após o primeiro login!

---

## 4️⃣ Verificação

### Teste 1: Acessar o Site
1. Acesse: https://cortinasbras.com.br
2. O site deve carregar normalmente (sem "Server error")

### Teste 2: Fazer Login
1. Acesse: https://cortinasbras.com.br/login
2. Use as credenciais acima
3. Você deve ser redirecionado para o dashboard

---

## 🔧 Troubleshooting

### Erro: "Server error"
**Causa:** Falta `NEXTAUTH_URL` ou `NEXTAUTH_SECRET`  
**Solução:** Siga o **Passo 1** acima

### Erro: "Credenciais inválidas"
**Causa:** Usuário admin não existe no banco  
**Solução:** Siga o **Passo 2** acima

### Erro: "Database connection failed"
**Causa:** PostgreSQL não está rodando ou URL incorreta  
**Solução:** Verifique se o serviço `cortinas-db` está ativo no Easypanel

### Erro: "Table User does not exist"
**Causa:** Tabela não foi criada  
**Solução:** Execute o script SQL completo do **Passo 2**

---

## 📝 Notas Importantes

1. **Segurança:** O `NEXTAUTH_SECRET` deve ser mantido em segredo
2. **Senha Padrão:** Altere `admin123` após o primeiro login
3. **Backup:** Faça backup do banco antes de executar scripts SQL
4. **Produção:** Estas configurações são para o ambiente de produção

---

## 🆘 Precisa de Ajuda?

Se ainda houver problemas:
1. Verifique os logs do container no Easypanel
2. Confirme que todas as variáveis de ambiente estão corretas
3. Teste a conexão com o PostgreSQL usando pgAdmin
