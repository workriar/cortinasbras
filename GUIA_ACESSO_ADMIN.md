# 🔑 Guia de Acesso ao Sistema Admin - Cortinas Brás

## 📋 CREDENCIAIS DE ACESSO

### 👤 **Usuários Disponíveis**

#### **1. ADMINISTRADOR** (Acesso Total)
```
Email: admin@cortinasbras.com.br
Senha: (precisa ser resetada - veja instruções abaixo)
Role: ADMIN
```

**Permissões:**
- ✅ Dashboard
- ✅ CRM (Kanban)
- ✅ Chat
- ✅ WhatsApp
- ✅ Relatórios
- ✅ **Usuários** (gerenciar usuários)
- ✅ **Configurações** (manutenção do sistema)

---

#### **2. VENDEDOR** (Acesso Limitado)
```
Email: vendedor@cortinasbras.com.br
Senha: (precisa ser resetada - veja instruções abaixo)
Role: USER
```

**Permissões:**
- ✅ Dashboard
- ✅ CRM (Kanban)
- ✅ Chat
- ✅ WhatsApp
- ✅ Relatórios
- ❌ Usuários (bloqueado)
- ❌ Configurações (bloqueado)

---

## 🔧 RESETAR SENHA (PRIMEIRA VEZ)

Como as senhas estão em hash bcrypt no banco, você precisa resetá-las primeiro.

### **Opção 1: Via API (Recomendado)**

Aguarde o deploy completar (~10 minutos) e execute:

#### **Resetar senha do Admin:**
```bash
curl -X POST https://cortinasbras.com.br/api/setup/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cortinasbras.com.br",
    "newPassword": "SuaSenhaSegura123"
  }'
```

#### **Resetar senha do Vendedor:**
```bash
curl -X POST https://cortinasbras.com.br/api/setup/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@cortinasbras.com.br",
    "newPassword": "OutraSenha456"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Senha atualizada com sucesso",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@cortinasbras.com.br",
    "role": "ADMIN"
  }
}
```

---

### **Opção 2: Via Banco de Dados**

Se preferir, pode atualizar diretamente no PostgreSQL:

```bash
# Conectar ao container do banco
docker exec -it cortinasbras_cortinas-db.1.qzkigso1ul41drjevcjwvd688 psql -U cortinas_admin -d cortinas_leads

# Gerar hash bcrypt (use um gerador online ou Node.js)
# Exemplo de hash para senha "admin123":
# $2a$10$abcdefghijklmnopqrstuvwxyz...

# Atualizar senha
UPDATE "User" 
SET "passwordHash" = '$2a$10$SEU_HASH_AQUI' 
WHERE email = 'admin@cortinasbras.com.br';
```

---

## 🚀 COMO ACESSAR

### **1. Acesse o Dashboard**
```
https://cortinasbras.com.br/dashboard
```

### **2. Faça Login**
- Será redirecionado automaticamente para a tela de login
- Digite o email e senha
- Clique em "Iniciar Sessão"

### **3. Navegue pelo Sistema**
- Como **Admin**: Verá todas as opções no menu lateral
- Como **Vendedor**: Verá apenas opções básicas

---

## 🧪 TESTAR PERMISSÕES

### **Como Administrador:**

1. Faça login com `admin@cortinasbras.com.br`
2. Verifique o menu lateral - deve mostrar:
   - Dashboard
   - CRM
   - Chat
   - WhatsApp
   - Relatórios
   - **Usuários** ✨
   - **Configurações** ✨

3. Clique em "Usuários"
   - Deve abrir a página de gestão de usuários
   - Pode criar novos usuários
   - Pode excluir usuários

4. Clique em "Configurações"
   - Deve abrir a página de configurações
   - Pode acessar manutenção do sistema

---

### **Como Vendedor:**

1. Faça login com `vendedor@cortinasbras.com.br`
2. Verifique o menu lateral - deve mostrar:
   - Dashboard
   - CRM
   - Chat
   - WhatsApp
   - Relatórios
   - ❌ Usuários (não aparece)
   - ❌ Configurações (não aparece)

3. Tente acessar diretamente:
   ```
   https://cortinasbras.com.br/dashboard/users
   ```
   - Deve mostrar: **"Acesso Negado"**
   - Mensagem: "Você não tem permissão para acessar esta página"
   - Botão para voltar ao Dashboard

---

## 🔐 CRIAR NOVOS USUÁRIOS

### **Via Interface (Recomendado)**

1. Faça login como **Admin**
2. Vá em **Usuários** no menu
3. Clique em **"Novo Usuário"**
4. Preencha:
   - Nome completo
   - E-mail de acesso
   - Senha inicial
   - Nível de acesso (Vendedor ou Admin)
5. Clique em **"Criar Usuário"**

---

### **Via API**

```bash
curl -X POST https://cortinasbras.com.br/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@cortinasbras.com.br",
    "password": "senha123",
    "role": "USER"
  }'
```

**Roles disponíveis:**
- `USER` - Vendedor (acesso limitado)
- `ADMIN` - Administrador (acesso total)
- `SUPER_ADMIN` - Super Admin (mesmo que ADMIN, preparado para futuro)

---

## 📊 VERIFICAR USUÁRIOS NO BANCO

```bash
# Conectar ao banco
docker exec -it cortinasbras_cortinas-db.1.qzkigso1ul41drjevcjwvd688 psql -U cortinas_admin -d cortinas_leads

# Listar todos os usuários
SELECT id, name, email, role, "createdAt" FROM "User";

# Atualizar role de um usuário
UPDATE "User" SET role = 'ADMIN' WHERE email = 'email@exemplo.com';

# Sair
\q
```

---

## ⚠️ SEGURANÇA

### **Boas Práticas:**

1. **Senhas Fortes**
   - Use senhas com pelo menos 8 caracteres
   - Combine letras, números e símbolos

2. **Limite de Admins**
   - Crie apenas os admins necessários
   - A maioria dos usuários deve ser `USER` (vendedor)

3. **Revise Acessos**
   - Periodicamente, revise quem tem acesso admin
   - Remova usuários que não precisam mais de acesso

4. **Logs**
   - Monitore acessos às páginas de configuração
   - Verifique quem está criando/excluindo usuários

---

## 🔄 FLUXO COMPLETO DE ACESSO

```
1. Aguardar deploy completar (~10 min)
   ↓
2. Resetar senha do admin via API
   ↓
3. Acessar https://cortinasbras.com.br/dashboard
   ↓
4. Fazer login com admin@cortinasbras.com.br
   ↓
5. Verificar que vê "Usuários" e "Configurações" no menu
   ↓
6. Criar outros usuários conforme necessário
   ↓
7. Testar login com usuário vendedor
   ↓
8. Confirmar que vendedor NÃO vê opções admin
```

---

## 📞 TROUBLESHOOTING

### **Problema: "Credenciais inválidas"**
- Verifique se resetou a senha via API
- Confirme que está usando o email correto
- Tente resetar a senha novamente

### **Problema: "Acesso Negado" mesmo sendo admin**
- Verifique o role no banco de dados:
  ```sql
  SELECT email, role FROM "User" WHERE email = 'seu@email.com';
  ```
- Se estiver como `USER`, atualize para `ADMIN`:
  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'seu@email.com';
  ```
- Faça logout e login novamente

### **Problema: Menu não mostra opções admin**
- Limpe o cache do navegador
- Faça logout completo
- Faça login novamente
- Verifique o console do navegador (F12) para erros

---

## ✅ CHECKLIST DE ACESSO

- [ ] Deploy completado
- [ ] Senha do admin resetada via API
- [ ] Login como admin funcionando
- [ ] Menu mostra "Usuários" e "Configurações"
- [ ] Página de Usuários acessível
- [ ] Página de Configurações acessível
- [ ] Criado usuário vendedor de teste
- [ ] Login como vendedor funcionando
- [ ] Vendedor NÃO vê opções admin
- [ ] Vendedor bloqueado ao tentar acessar /users
- [ ] Vendedor bloqueado ao tentar acessar /settings

---

## 🎯 RESUMO RÁPIDO

**Para começar agora:**

1. Aguarde deploy (~10 min)
2. Execute:
   ```bash
   curl -X POST https://cortinasbras.com.br/api/setup/reset-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@cortinasbras.com.br","newPassword":"Admin@2026"}'
   ```
3. Acesse: https://cortinasbras.com.br/dashboard
4. Login: `admin@cortinasbras.com.br` / `Admin@2026`
5. Pronto! ✅

---

**Última atualização**: 2026-01-20 16:26 UTC  
**Deploy status**: Em andamento  
**ETA**: ~10 minutos
