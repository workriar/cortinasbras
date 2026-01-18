# 🚀 PLANO DE EVOLUÇÃO E ARQUITETURA - CORTINAS BRÁS

Este documento detalha o roadmap técnico, a arquitetura proposta e as diretrizes para a evolução do sistema Cortinas Brás.

## 📋 CONTEXTO DO PROJETO

O sistema atual é uma aplicação web moderna para gestão de leads, CRM e orçamentos.

### Stack Atual:
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v4 (Role-Based Access)
- **Funcionalidades:** Dashboard administrativo, CRM Kanban, gestão de leads, geração de PDFs, envio de emails
- **Deploy:** Docker + EasyPanel / VPS

---

## 🎯 OBJETIVOS DA EVOLUÇÃO

### 1. **Modernização da Arquitetura**
- Implementar **arquitetura modular e escalável** (design patterns: Repository, Service Layer)
- Separar responsabilidades (Frontend/Backend/Business Logic)
- Criar **API RESTful robusta** com documentação Swagger/OpenAPI
- Implementar **testes automatizados** (Jest, Testing Library, Playwright)

### 2. **Novas Funcionalidades - Sistema de Comunicação**
- **Chat Interno em Tempo Real:**
  - WebSocket com Socket.io ou Pusher
  - Chat entre vendedores e administradores
  - Notificações em tempo real de novos leads
  - Histórico de mensagens persistido no banco
  - Indicadores de "online/offline" e "digitando..."

- **Integração WhatsApp Business API Avançada:**
  - Webhook para receber mensagens do WhatsApp
  - Envio automatizado de follow-ups
  - Templates de mensagens pré-aprovadas
  - Histórico completo de conversas sincronizado com o CRM
  - Bot automático para responder fora do horário comercial
  - Dashboard de métricas do WhatsApp (taxa de resposta, tempo médio)

### 3. **Analytics e Relatórios Avançados**
- **Dashboard de Métricas em Tempo Real:**
  - Gráficos interativos (Recharts ou Chart.js)
  - Taxa de conversão por origem de lead (site, WhatsApp, indicação)
  - Funil de vendas visual com porcentagens
  - Relatório de desempenho por vendedor
  - Previsão de vendas com IA (opcional: integração com modelos preditivos)

- **Relatórios Exportáveis:**
  - Exportação em PDF, Excel (XLSX), CSV
  - Agendamento de relatórios automáticos por email
  - Comparativo de períodos (mês atual vs anterior)

### 4. **Melhorias de UX/UI**
- **Design System Consistente:**
  - Implementar Shadcn/ui ou Radix UI
  - Modo escuro/claro (theme switcher)
  - Componentes reutilizáveis e acessíveis (WCAG 2.1)
  - Animações suaves com Framer Motion

- **Mobile-First e Responsivo:**
  - Layout adaptativo para tablet e mobile
  - PWA (Progressive Web App) - funcionar offline
  - Notificações push do navegador

### 5. **Automações e Inteligência**
- **Automação de Processos:**
  - Envio automático de email de boas-vindas ao novo lead
  - Lembretes de follow-up se lead ficar X dias sem contato
  - Auto-atribuição de leads para vendedores (round-robin ou por região)
  - Integração com Google Calendar para agendamentos

- **IA Assistente (opcional):**
  - Análise de sentimento nas conversas do chat
  - Sugestões de respostas baseadas em histórico
  - Detecção de leads "quentes" com maior probabilidade de conversão

### 6. **Sistema de Permissões Granular**
- Expandir roles além de ADMIN/USER:
  - SUPER_ADMIN (configurações gerais)
  - MANAGER (visualiza todos leads, relatórios gerenciais)
  - SALES (apenas seus leads)
  - VIEWER (somente leitura)
- Controle de acesso por recurso (CRUD detalhado)

### 7. **Gestão de Produtos e Estoque (novo módulo)**
- Cadastro de produtos (cortinas, tecidos, acessórios)
- Controle de estoque básico
- Geração de orçamentos vinculando produtos
- Cálculo automático de preços com margem de lucro

### 8. **Melhorias de Performance**
- **Otimização de Queries:**
  - Implementar cache com Redis
  - Paginação e lazy loading em listas grandes
  - Índices otimizados no Prisma

- **SEO e Core Web Vitals:**
  - Server Components do Next.js para SSR
  - Image optimization automática
  - Code splitting inteligente

---

## 🏗️ ARQUITETURA PROPOSTA

### Estrutura de Pastas Recomendada:

```
/src
  /app                          # Next.js App Router
    /api
      /v1                       # Versionamento de API
        /leads
        /users
        /chat
        /whatsapp
        /analytics
        /products
    /dashboard
      /analytics
      /crm
      /chat
      /settings
      /products
    /(auth)
      /login
      /register
  
  /components
    /ui                         # Componentes base (Shadcn)
    /features                   # Componentes de funcionalidades
      /kanban
      /chat
      /analytics
    /layouts
    /forms
  
  /lib
    /api                        # Clients de API
    /hooks                      # Custom React Hooks
    /utils                      # Funções utilitárias
    /validators                 # Schemas Zod
  
  /services                     # Business Logic
    /lead.service.ts
    /email.service.ts
    /whatsapp.service.ts
    /chat.service.ts
    /analytics.service.ts
  
  /repositories                 # Data Access Layer
    /lead.repository.ts
    /user.repository.ts
    /message.repository.ts
  
  /types                        # TypeScript Definitions
  /config                       # Configurações centralizadas
  /middlewares                  # Auth, CORS, Rate Limiting
  
/prisma
  /schema.prisma
  /migrations
  /seeds                        # Dados iniciais

/tests
  /unit
  /integration
  /e2e

/docs
  /api                          # Documentação Swagger
  /architecture                 # Diagramas e decisões técnicas
```

### Novo Schema Prisma (Proposta):

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  role          Role      @default(SALES)
  avatar        String?
  isActive      Boolean   @default(true)
  lastSeen      DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  leads         Lead[]
  sentMessages  Message[] @relation("SentMessages")
  notifications Notification[]
}

enum Role {
  SUPER_ADMIN
  ADMIN
  MANAGER
  SALES
  VIEWER
}

model Lead {
  id              String     @id @default(cuid())
  name            String
  email           String?
  phone           String
  status          LeadStatus @default(NEW)
  source          LeadSource @default(WEBSITE)
  tipo            String?
  medidas         String?
  observacoes     String?
  estimatedValue  Decimal?   @db.Decimal(10, 2)
  
  assignedTo      User?      @relation(fields: [assignedToId], references: [id])
  assignedToId    String?
  
  messages        Message[]
  activities      Activity[]
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  convertedAt     DateTime?
  
  @@index([status])
  @@index([assignedToId])
  @@index([createdAt])
}

enum LeadStatus {
  NEW
  CONTACTED
  PROPOSAL
  NEGOTIATION
  WON
  LOST
}

enum LeadSource {
  WEBSITE
  WHATSAPP
  REFERRAL
  INSTAGRAM
  GOOGLE
  OTHER
}

model Message {
  id          String      @id @default(cuid())
  content     String      @db.Text
  type        MessageType @default(INTERNAL)
  
  sender      User        @relation("SentMessages", fields: [senderId], references: [id])
  senderId    String
  
  lead        Lead?       @relation(fields: [leadId], references: [id])
  leadId      String?
  
  whatsappId  String?     @unique
  isRead      Boolean     @default(false)
  
  createdAt   DateTime    @default(now())
  
  @@index([leadId])
  @@index([createdAt])
}

enum MessageType {
  INTERNAL
  WHATSAPP
  EMAIL
}

model Activity {
  id          String       @id @default(cuid())
  type        ActivityType
  description String
  metadata    Json?
  
  lead        Lead         @relation(fields: [leadId], references: [id], onDelete: Cascade)
  leadId      String
  
  createdAt   DateTime     @default(now())
  
  @@index([leadId])
}

enum ActivityType {
  CREATED
  STATUS_CHANGED
  ASSIGNED
  NOTE_ADDED
  EMAIL_SENT
  WHATSAPP_SENT
  CALL_MADE
}

model Notification {
  id        String   @id @default(cuid())
  title     String
  message   String
  type      String
  isRead    Boolean  @default(false)
  
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  
  createdAt DateTime @default(now())
  
  @@index([userId, isRead])
}

model Product {
  id          String   @id @default(cuid())
  name        String
  category    String
  description String?  @db.Text
  price       Decimal  @db.Decimal(10, 2)
  cost        Decimal? @db.Decimal(10, 2)
  stock       Int      @default(0)
  imageUrl    String?
  isActive    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔧 STACK TECNOLÓGICA RECOMMENDADA

### Manter:
- ✅ Next.js 16 + React 19 + TypeScript
- ✅ PostgreSQL + Prisma
- ✅ TailwindCSS 4
- ✅ Framer Motion

### Adicionar:
- **UI Components:** Shadcn/ui (componentes modernos e acessíveis)
- **Real-time:** Socket.io ou Pusher
- **Gráficos:** Recharts ou Chart.js
- **Tabelas:** TanStack Table (React Table v8)
- **Forms:** React Hook Form + Zod (já tem)
- **Cache:** Redis (para performance)
- **Testes:**
  - Jest + Testing Library (unit/integration)
  - Playwright (E2E)
- **Documentação API:** Swagger UI + OpenAPI
- **Logs:** Pino
- **Monitoramento:** Sentry

---

## 📝 ROADMAP DE IMPLEMENTAÇÃO

### FASE 1: Fundação
1. Refatorar estrutura de pastas (Service Layer + Repository)
2. Implementar Shadcn/ui e criar Design System
3. Adicionar testes unitários básicos
4. Configurar Redis para cache
5. Atualizar schema Prisma

### FASE 2: Chat Interno
1. Implementar WebSocket (Socket.io)
2. Criar interface de chat
3. Notificações em tempo real
4. Indicadores de presença

### FASE 3: WhatsApp Avançado
1. Integrar WhatsApp Business API
2. Webhook para mensagens
3. Sincronizar conversas com CRM
4. Templates de mensagens + Bot

### FASE 4: Analytics e Relatórios
1. Dashboard de métricas interativo
2. Gráficos de funil de vendas
3. Relatórios exportáveis (PDF, Excel)

### FASE 5: Gestão de Produtos
1. CRUD de produtos
2. Controle de estoque básico
3. Vincular produtos aos orçamentos
4. Cálculo de preços

### FASE 6: Automações
1. Email de boas-vindas automatizado
2. Lembretes de follow-up
3. Auto-atribuição de leads

---

## 🚀 PWA (Progressive Web App)

Configuração sugerida para `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // configs
});
```

---

**Documento gerado como base para o desenvolvimento futuro.**
