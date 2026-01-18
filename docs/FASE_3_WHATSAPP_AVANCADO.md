# 📱 FASE 3: WhatsApp Avançado - Plano de Implementação

## 📊 STATUS ATUAL

### ✅ O que já está implementado:

#### 1. **Infraestrutura Base**
- ✅ Socket.IO Server configurado (`server.ts`)
- ✅ Socket Provider para React (`socket-provider.tsx`)
- ✅ Chat interno em tempo real funcionando
- ✅ Webhook WhatsApp básico (`/api/webhooks/whatsapp/route.ts`)
- ✅ WhatsApp Service com Twilio (`whatsapp.service.ts`)
- ✅ Schema Prisma com modelos Message, Lead, Activity

#### 2. **Funcionalidades Básicas**
- ✅ Recebimento de mensagens do WhatsApp via webhook
- ✅ Criação automática de leads via WhatsApp
- ✅ Auto-resposta básica (bot simples)
- ✅ Persistência de mensagens no banco
- ✅ Chat interno entre usuários

### 🚧 O que falta implementar (Fase 3):

#### 1. **Sincronização WhatsApp ↔ CRM**
- ❌ Dashboard de conversas do WhatsApp
- ❌ Visualização de histórico completo de conversas
- ❌ Integração do chat WhatsApp com o CRM Kanban
- ❌ Indicador visual de mensagens não lidas
- ❌ Notificações em tempo real de novas mensagens WhatsApp

#### 2. **Templates de Mensagens**
- ❌ CRUD de templates de mensagens
- ❌ Sistema de variáveis dinâmicas ({{nome}}, {{produto}}, etc.)
- ❌ Templates pré-aprovados pelo WhatsApp Business
- ❌ Interface para envio rápido de templates

#### 3. **Bot Avançado**
- ❌ Fluxo conversacional inteligente
- ❌ Respostas automáticas fora do horário comercial
- ❌ Menu interativo de opções
- ❌ Detecção de intenção (orçamento, dúvida, reclamação)
- ❌ Escalação para atendente humano

#### 4. **Dashboard de Métricas WhatsApp**
- ❌ Taxa de resposta
- ❌ Tempo médio de resposta
- ❌ Conversas ativas vs resolvidas
- ❌ Origem dos leads (WhatsApp vs outros canais)
- ❌ Gráficos de volume de mensagens por período

#### 5. **Automações**
- ❌ Follow-up automático após X dias sem resposta
- ❌ Envio de orçamento via WhatsApp
- ❌ Confirmação de agendamento
- ❌ Pesquisa de satisfação pós-venda

---

## 🎯 ROADMAP DE IMPLEMENTAÇÃO

### **Etapa 1: Dashboard de Conversas WhatsApp** (Prioridade Alta)

**Objetivo:** Criar uma interface para visualizar e gerenciar todas as conversas do WhatsApp.

**Tarefas:**
1. Criar página `/dashboard/whatsapp`
2. Componente de lista de conversas ativas
3. Componente de visualização de mensagens por lead
4. Integração com Socket.IO para atualizações em tempo real
5. Filtros: não lidas, ativas, arquivadas
6. Busca por nome/telefone

**Arquivos a criar:**
- `src/app/dashboard/whatsapp/page.tsx`
- `src/components/whatsapp/conversation-list.tsx`
- `src/components/whatsapp/message-thread.tsx`
- `src/app/api/whatsapp/conversations/route.ts`

---

### **Etapa 2: Templates de Mensagens** (Prioridade Alta)

**Objetivo:** Sistema de templates para envio rápido de mensagens padronizadas.

**Tarefas:**
1. Criar model `MessageTemplate` no Prisma
2. CRUD de templates no dashboard
3. Sistema de variáveis dinâmicas
4. Interface de seleção de template ao enviar mensagem
5. Preview de template com variáveis preenchidas

**Schema Prisma:**
```prisma
model MessageTemplate {
  id          Int      @id @default(autoincrement())
  name        String
  content     String   @db.Text
  category    String   // GREETING, FOLLOW_UP, QUOTE, CLOSING
  variables   Json?    // ["nome", "produto", "valor"]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Arquivos a criar:**
- `src/app/dashboard/whatsapp/templates/page.tsx`
- `src/components/whatsapp/template-editor.tsx`
- `src/app/api/whatsapp/templates/route.ts`
- `src/services/template.service.ts`

---

### **Etapa 3: Bot Avançado com Fluxo Conversacional** (Prioridade Média)

**Objetivo:** Melhorar o bot para responder de forma mais inteligente.

**Tarefas:**
1. Criar sistema de estados de conversa
2. Implementar menu interativo
3. Detecção de palavras-chave
4. Horário comercial configurável
5. Escalação para atendente humano

**Schema Prisma (adicionar ao Lead):**
```prisma
model Lead {
  // ... campos existentes
  botState    String?   // MENU, AWAITING_NAME, AWAITING_ADDRESS, etc.
  lastBotInteraction DateTime?
}
```

**Arquivos a modificar/criar:**
- `src/app/api/webhooks/whatsapp/route.ts` (melhorar lógica)
- `src/services/whatsapp-bot.service.ts` (novo)
- `src/lib/whatsapp-flows.ts` (novo - definir fluxos)

---

### **Etapa 4: Dashboard de Métricas** (Prioridade Média)

**Objetivo:** Visualizar estatísticas de desempenho do WhatsApp.

**Tarefas:**
1. Criar queries agregadas no Prisma
2. Componentes de gráficos (Recharts)
3. Métricas em tempo real
4. Exportação de relatórios

**Métricas a implementar:**
- Total de conversas ativas
- Taxa de conversão WhatsApp → Lead → Venda
- Tempo médio de primeira resposta
- Tempo médio de resolução
- Volume de mensagens por hora/dia

**Arquivos a criar:**
- `src/app/dashboard/whatsapp/analytics/page.tsx`
- `src/app/api/whatsapp/metrics/route.ts`
- `src/services/whatsapp-analytics.service.ts`

---

### **Etapa 5: Automações** (Prioridade Baixa)

**Objetivo:** Automatizar tarefas repetitivas.

**Tarefas:**
1. Cron job para follow-ups automáticos
2. Envio de orçamento em PDF via WhatsApp
3. Lembretes de agendamento
4. Pesquisa de satisfação

**Tecnologias:**
- `node-cron` ou `bull` (queue system)
- Integração com PDF service existente

**Arquivos a criar:**
- `src/jobs/whatsapp-follow-up.ts`
- `src/jobs/whatsapp-scheduler.ts`

---

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### **Melhorias no Webhook WhatsApp**

O webhook atual (`/api/webhooks/whatsapp/route.ts`) precisa ser expandido:

```typescript
// Melhorias necessárias:
1. Validação de assinatura Twilio (segurança)
2. Tratamento de diferentes tipos de mensagem (texto, imagem, áudio)
3. Detecção de contexto da conversa
4. Integração com bot service
5. Notificação em tempo real via Socket.IO
6. Logging estruturado
```

### **Integração Socket.IO + WhatsApp**

Quando uma mensagem WhatsApp chega:
1. Webhook recebe e persiste no banco
2. Emite evento Socket.IO para sala `whatsapp-{leadId}`
3. Dashboard atualiza em tempo real
4. Notificação visual para atendentes

```typescript
// No webhook:
io.to(`whatsapp-${lead.id}`).emit("new-whatsapp-message", savedMessage);
io.to("admins").emit("notification", {
  type: "WHATSAPP_MESSAGE",
  leadId: lead.id,
  preview: content.substring(0, 50)
});
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Sprint 1: Dashboard de Conversas** (1-2 dias)
- [ ] Criar página `/dashboard/whatsapp`
- [ ] API para listar conversas
- [ ] Componente de lista de conversas
- [ ] Componente de thread de mensagens
- [ ] Integração Socket.IO
- [ ] Testes básicos

### **Sprint 2: Templates** (1 dia)
- [ ] Adicionar model `MessageTemplate` ao Prisma
- [ ] Migração do banco
- [ ] CRUD de templates
- [ ] Interface de seleção de template
- [ ] Sistema de variáveis

### **Sprint 3: Bot Avançado** (2-3 dias)
- [ ] Refatorar webhook
- [ ] Criar `whatsapp-bot.service.ts`
- [ ] Implementar fluxos conversacionais
- [ ] Menu interativo
- [ ] Horário comercial
- [ ] Escalação para humano

### **Sprint 4: Métricas** (1-2 dias)
- [ ] Queries de analytics
- [ ] Dashboard de métricas
- [ ] Gráficos com Recharts
- [ ] Exportação de relatórios

### **Sprint 5: Automações** (2 dias)
- [ ] Setup de cron jobs
- [ ] Follow-up automático
- [ ] Envio de PDF via WhatsApp
- [ ] Pesquisa de satisfação

---

## 🎨 DESIGN DA INTERFACE

### **Dashboard WhatsApp - Layout Proposto**

```
┌─────────────────────────────────────────────────────────┐
│  📱 WhatsApp Business                    [Métricas] [⚙️] │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  Conversas   │  Chat com João Silva                     │
│  ────────    │  ──────────────────                      │
│              │                                          │
│  🟢 João     │  [Mensagens aqui]                        │
│  Silva       │                                          │
│  2 min       │                                          │
│              │                                          │
│  🔴 Maria    │                                          │
│  Santos      │  ┌────────────────────────────────────┐  │
│  1h          │  │ [Template ▼] [📎] [Emoji]         │  │
│              │  │ Digite sua mensagem...        [→] │  │
│              │  └────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────┘
```

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

### **Começar agora:**

1. **Criar página do Dashboard WhatsApp**
   - Estrutura básica da interface
   - Lista de conversas
   - Thread de mensagens

2. **Melhorar o Webhook**
   - Adicionar validação de segurança
   - Melhorar detecção de contexto
   - Integrar com Socket.IO

3. **Implementar Templates**
   - Model no Prisma
   - CRUD básico
   - Interface de seleção

---

## 📚 REFERÊNCIAS

- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

**Última atualização:** 2026-01-17
**Status:** Em Desenvolvimento - Fase 3
**Responsável:** Equipe de Desenvolvimento
