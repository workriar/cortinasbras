# 🏠 Cortinas Brás - Sistema de Gestão & Orçamentos

Sistema web completo para gestão de leads, orçamentos e CRM da Cortinas Brás. Desenvolvido com **Next.js 16**, **React 19** e **PostgreSQL**, oferecendo uma interface moderna para clientes e um painel administrativo poderoso para gestão interna.

---

## 🚀 Tecnologias Integradas

### Core
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend:** React 19, TypeScript, TailwindCSS 4
- **Animações:** Framer Motion, Lucide React
- **Estado/Forms:** React Hook Form, Zod

### Backend & Dados
- **Database:** PostgreSQL (Hospedado via EasyPanel/Docker)
- **ORM:** Prisma (v5.22)
- **Auth:** NextAuth.js v4 (Credentials Provider com Role-Based Access)
- **API:** Next.js Route Handlers

### Serviços
- **E-mails:** Nodemailer (SMTP Hostinger)
- **PDFs:** Puppeteer (Geração dinâmica de orçamentos)
- **Deploy:** Docker, Docker Compose, EasyPanel

---

## 🛠️ Configuração Inicial

### Pré-requisitos
- Node.js 20+
- Docker & Docker Compose (para ambiente local completo)
- PostgreSQL (ou usar container docker incluso)

### 1. Clonar e Instalar
```bash
git clone https://github.com/workriar/cortinasbras.git
cd cortinasbras
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as chaves necessárias (baseado em `.env.example`):

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/cortinas_leads"

# Autenticação
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"

# Email (SMTP Hostinger)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=sua_senha
MAIL_USE_SSL=true

# Config Gerais
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Banco de Dados
Gere o cliente Prisma e execute as migrações (ou `db push` para dev):

```bash
npx prisma generate
npx prisma db push
```

### 4. Rodar a Aplicação
```bash
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔒 Painel Administrativo (/dashboard)

O sistema possui um painel completo para gestão do negócio.

### Acesso
- **URL:** `/dashboard`
- **Login:** Redireciona automaticamente se não autenticado.
- **Credenciais Padrão:**
  - Email: `admin@cortinasbras.com.br`
  - Senha: `admin123` *(Recomenda-se alterar após o primeiro acesso)*

### Funcionalidades do Dashboard
1.  **Visão Geral:** KPIs de vendas, leads recentes e gráficos de conversão.
2.  **CRM (Kanban):**
    - Quadro interativo (Drag & Drop) para mover leads entre status (Novos, Em Contato, Proposta, Fechados).
    - Edição rápida de leads e link direto para WhatsApp.
    - Filtros por data, status e origem.
3.  **Gestão de Usuários:** Cadastro de novos vendedores ou administradores (Apenas role ADMIN).

---

## 🗄️ Estrutura do Banco de Dados (Prisma)

Principais modelos definidos em `prisma/schema.prisma`:

- **User:** Usuários do sistema (Vendedores/Admins). Campos: `role` (ADMIN/USER), `passwordHash`, `email`.
- **Lead:** Clientes e orçamentos. Campos principais: `status` (Funil de vendas), `tipo` (Modelo da cortina), `medidas`, etc.

---

## 🐳 Deploy e Produção

O projeto é otimizado para deploy em containers (Docker).

### Comandos Docker
```bash
# Build e Subir Containers
docker-compose up -d --build

# Ver Logs
docker-compose logs -f web

# Parar
docker-compose down
```

### EasyPanel / VPS
O projeto contém configurações específicas para rodar em EasyPanel:
1.  Conecte o repositório GitHub.
2.  Nas configurações de "Build", defina o dockerfile como `Dockerfile`.
3.  Insira as variáveis de ambiente de produção.
4.  O script de start `npm start` cuidará de iniciar o servidor Next.js.

### Manutenção de Schema em Produção
Se houver alterações no schema do banco, certifique-se de rebuildar o container ou rodar `npx prisma migrate deploy` no ambiente produtivo.

---

## 📁 Estrutura de Pastas

```
/src
  /app
    /api           # Endpoints da API (Leads, Auth, Reports)
    /dashboard     # Páginas protegidas do Admin/CRM
    /public        # Imagens estáticas
  /components
    /KanbanBoard   # Lógica do quadro CRM
    /Sidebar       # Navegação do Dashboard
    /LeadForm      # Formulários de Cadastro
  /services
    email.ts       # Envio de e-mails transacionais
    pdf.ts         # Geração de orçamentos em PDF
  /middleware.ts   # Proteção de rotas e redirecionamentos
/prisma            # Schema e Migrations do DB
/scripts           # Scripts utilitários (Reset senha, check DB)
```

---

## 📄 Scripts Úteis

- `node scripts/reset-admin-password.js`: Reseta a senha do admin localmente.
- `node scripts/check-users.js`: Lista usuários cadastrados no banco.
- `npx prisma studio`: Abre interface visual para gerenciar o banco de dados.

---

&copy; 2026 Cortinas Brás. Todos os direitos reservados.
