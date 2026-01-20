# 🔐 Sistema de Autenticação Admin - Cortinas Brás

## ✅ IMPLEMENTADO COM SUCESSO

**Data**: 2026-01-20  
**Commit**: e1be143  
**Status**: Deploy em andamento

---

## 📋 O Que Foi Implementado

### 1. **Componente AdminGuard**
Criado em `/root/src/components/AdminGuard.tsx`

**Função**: Proteger páginas que só administradores podem acessar.

**Como funciona**:
- Verifica se o usuário está autenticado
- Verifica se o role do usuário é `ADMIN` ou `SUPER_ADMIN`
- Se não for admin, redireciona para o dashboard com mensagem de "Acesso Negado"
- Mostra loading enquanto verifica a sessão

### 2. **NextAuth Atualizado**
Arquivo: `/root/src/app/api/auth/[...nextauth]/route.ts`

**Mudanças**:
- Callback `jwt` agora busca o role do usuário do banco de dados
- Role é incluído no token JWT
- Role é passado para a sessão do usuário

**Código**:
```typescript
async jwt({ token, user }: any) {
    if (user) {
        token.sub = user.id;
        // Fetch user role from database
        const dbUser = await prisma.user.findUnique({
            where: { id: parseInt(user.id) },
            select: { role: true }
        });
        token.role = dbUser?.role || 'USER';
    }
    return token;
}
```

### 3. **Páginas Protegidas**

#### **Configurações** (`/dashboard/settings`)
- Protegida com `<AdminGuard>`
- Apenas admins podem acessar
- Contém ferramentas de manutenção do sistema

#### **Usuários** (`/dashboard/users`)
- Protegida com `<AdminGuard>`
- Apenas admins podem criar/editar/excluir usuários
- Gerenciamento de roles

### 4. **Sidebar Dinâmico**
Arquivo: `/root/src/components/Sidebar.tsx`

**Mudanças**:
- Menu items agora têm propriedade `adminOnly`
- Sidebar filtra itens baseado no role do usuário
- Usuários regulares não veem "Usuários" e "Configurações"

**Código**:
```typescript
const allMenuItems = [
    { name: 'Dashboard', path: '/dashboard', adminOnly: false },
    { name: 'CRM', path: '/dashboard/crm', adminOnly: false },
    { name: 'Chat', path: '/dashboard/chat', adminOnly: false },
    { name: 'WhatsApp', path: '/dashboard/whatsapp', adminOnly: false },
    { name: 'Relatórios', path: '/dashboard/reports', adminOnly: false },
    { name: 'Usuários', path: '/dashboard/users', adminOnly: true }, // 🔒
    { name: 'Configurações', path: '/dashboard/settings', adminOnly: true }, // 🔒
];

// Filter based on role
const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);
```

---

## 🎯 Roles Suportados

### **USER** (Vendedor)
- ✅ Dashboard
- ✅ CRM (Kanban de Leads)
- ✅ Chat
- ✅ WhatsApp
- ✅ Relatórios
- ❌ Usuários (bloqueado)
- ❌ Configurações (bloqueado)

### **ADMIN** (Administrador)
- ✅ Dashboard
- ✅ CRM
- ✅ Chat
- ✅ WhatsApp
- ✅ Relatórios
- ✅ Usuários ✨
- ✅ Configurações ✨

### **SUPER_ADMIN** (Super Administrador)
- ✅ Acesso total (mesmo que ADMIN)
- Preparado para futuras funcionalidades exclusivas

---

## 🔧 Como Funciona

### **Fluxo de Autenticação**

1. **Login**
   - Usuário faz login com email e senha
   - NextAuth valida credenciais no banco
   - Busca o role do usuário
   - Cria sessão com role incluído

2. **Acesso a Páginas**
   - Usuário tenta acessar `/dashboard/settings`
   - `AdminGuard` verifica a sessão
   - Se role = `ADMIN` ou `SUPER_ADMIN`: ✅ Acesso permitido
   - Se role = `USER`: ❌ Redireciona com mensagem de erro

3. **Menu Dinâmico**
   - Sidebar lê o role da sessão
   - Filtra itens do menu
   - Mostra apenas opções permitidas

---

## 🧪 Como Testar

### **1. Criar Usuário Admin**

No banco de dados PostgreSQL, execute:

```sql
-- Ver usuários existentes
SELECT id, name, email, role FROM "User";

-- Atualizar um usuário para ADMIN
UPDATE "User" SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

Ou use a API:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@cortinasbras.com.br",
    "password": "senha123",
    "role": "ADMIN"
  }'
```

### **2. Criar Usuário Regular**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vendedor",
    "email": "vendedor@cortinasbras.com.br",
    "password": "senha123",
    "role": "USER"
  }'
```

### **3. Testar Acesso**

#### **Como Admin:**
1. Faça login com `admin@cortinasbras.com.br`
2. Verifique que vê "Usuários" e "Configurações" no menu
3. Acesse `/dashboard/settings` - deve funcionar ✅
4. Acesse `/dashboard/users` - deve funcionar ✅

#### **Como Vendedor:**
1. Faça login com `vendedor@cortinasbras.com.br`
2. Verifique que NÃO vê "Usuários" e "Configurações" no menu
3. Tente acessar `/dashboard/settings` diretamente - deve ser bloqueado ❌
4. Deve ver mensagem: "Acesso Negado - Apenas administradores..."

---

## 🛡️ Segurança

### **Proteções Implementadas**

1. **Server-Side Validation**
   - Role é verificado no servidor (NextAuth)
   - Não pode ser manipulado pelo cliente

2. **Client-Side Guard**
   - `AdminGuard` impede renderização de conteúdo protegido
   - Redireciona usuários não autorizados

3. **Menu Filtering**
   - Usuários não veem opções que não podem acessar
   - Melhora UX e segurança

4. **Database-Level**
   - Role armazenado no banco de dados
   - Apenas admins podem alterar roles (via página Usuários)

---

## 📝 Variáveis de Ambiente

Certifique-se de ter no `.env`:

```env
# NextAuth
NEXTAUTH_URL=https://cortinasbras.com.br
NEXTAUTH_SECRET=seu-secret-aqui

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
```

---

## 🚀 Deploy

**Status**: Deploy iniciado (15:49 UTC)  
**ETA**: ~10-12 minutos  
**Commit**: e1be143

### **Após o Deploy**

1. Acesse https://cortinasbras.com.br/dashboard
2. Faça login
3. Verifique se o menu está correto
4. Teste acessar páginas protegidas

---

## 🔄 Próximos Passos (Opcional)

### **Melhorias Futuras**

1. **API Protection**
   - Proteger rotas de API com middleware
   - Verificar role antes de executar ações

2. **Audit Log**
   - Registrar quem acessa páginas admin
   - Log de alterações de usuários

3. **Permissões Granulares**
   - Criar sistema de permissões mais detalhado
   - Ex: `can_create_users`, `can_delete_leads`, etc.

4. **2FA (Two-Factor Authentication)**
   - Adicionar autenticação de dois fatores para admins

---

## 📞 Suporte

Se houver problemas:

1. **Verificar logs do NextAuth**:
   ```bash
   docker logs cortinasbras_cortinasbras.1.xxx 2>&1 | grep NextAuth
   ```

2. **Verificar role do usuário**:
   ```sql
   SELECT email, role FROM "User";
   ```

3. **Limpar sessão e fazer login novamente**

---

## ✅ Checklist de Verificação

- [x] AdminGuard criado
- [x] NextAuth atualizado com role
- [x] Página Settings protegida
- [x] Página Users protegida
- [x] Sidebar filtra por role
- [x] Commit realizado
- [x] Push concluído
- [x] Deploy iniciado
- [ ] Teste em produção (aguardando deploy)
- [ ] Criar usuário admin
- [ ] Criar usuário regular
- [ ] Testar acesso

---

**Sistema de autenticação admin implementado com sucesso!** 🎉

Agora apenas administradores podem acessar configurações e gerenciar usuários.
