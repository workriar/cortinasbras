# 📱 Módulo WhatsApp Business

## 🎯 Visão Geral

O módulo WhatsApp Business integra completamente o sistema de CRM com a API do WhatsApp Business via Twilio, permitindo:

- 💬 Gerenciamento centralizado de conversas
- 🤖 Bot inteligente com respostas automáticas
- ⚡ Comunicação em tempo real via Socket.IO
- 📊 Rastreamento completo de interações
- 🔔 Notificações instantâneas

---

## 🚀 Como Usar

### 1. **Acessar o Dashboard**

Navegue para: `/dashboard/whatsapp`

### 2. **Visualizar Conversas**

- **Lista à esquerda:** Todas as conversas ativas
- **Buscar:** Digite nome ou telefone
- **Filtrar:**
  - **Todas:** Todas as conversas
  - **Não lidas:** Apenas com mensagens não lidas
  - **Ativas:** Conversas dos últimos 7 dias

### 3. **Enviar Mensagens**

1. Clique em uma conversa na lista
2. Digite sua mensagem no campo inferior
3. Pressione Enter ou clique no botão de envio
4. A mensagem será enviada via WhatsApp e salva no histórico

### 4. **Receber Mensagens**

- Mensagens chegam automaticamente via webhook
- Dashboard atualiza em tempo real (Socket.IO)
- Notificação visual de novas mensagens
- Badge com contador de não lidas

---

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# Site URL (para Socket.IO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Configurar Webhook no Twilio

1. Acesse: https://console.twilio.com/
2. Vá em: **Messaging** → **Settings** → **WhatsApp Sandbox**
3. Configure o webhook:
   ```
   URL: https://seu-dominio.com/api/webhooks/whatsapp
   Method: POST
   ```

---

## 🤖 Bot Inteligente

### Respostas Automáticas

O bot responde automaticamente em situações específicas:

#### 1. **Novo Lead (Primeira Mensagem)**
```
Olá! 👋 Bem-vindo à Cortinas Brás! 
Recebemos sua mensagem e em breve um de nossos 
consultores irá atendê-lo. Como podemos ajudá-lo hoje?
```

#### 2. **Orçamento/Preço**
Palavras-chave: `orçamento`, `preço`, `valor`
```
Olá! Para fazer um orçamento personalizado, 
por favor nos informe:

📏 Medidas da janela
🎨 Tipo de cortina desejada
📍 Localização

Ou acesse nosso site: https://cortinasbras.com.br/
```

#### 3. **Horário de Atendimento**
Palavras-chave: `horário`, `atendimento`
```
Nosso horário de atendimento é:
⏰ Segunda a Sexta: 8h às 18h
⏰ Sábado: 8h às 12h

Em breve retornaremos seu contato!
```

#### 4. **Localização**
Palavras-chave: `endereço`, `localização`, `onde`
```
📍 Estamos localizados no Brás, São Paulo.

Entre em contato para agendar uma visita 
ou receber um orçamento!
```

### Horário Comercial

- **Segunda a Sexta:** 8h às 18h
- **Sábado:** 8h às 12h
- **Fora do horário:** Mensagem automática informando

### Anti-Spam

- Não envia múltiplas respostas automáticas
- Aguarda 5 minutos entre mensagens automáticas
- Evita loops de conversação

---

## 📊 Funcionalidades

### ✅ Implementado

- [x] Lista de conversas com busca
- [x] Filtros (Todas, Não lidas, Ativas)
- [x] Thread de mensagens
- [x] Envio de mensagens
- [x] Recebimento via webhook
- [x] Bot inteligente
- [x] Criação automática de leads
- [x] Notificações em tempo real
- [x] Integração com CRM
- [x] Atividades registradas

### 🚧 Em Desenvolvimento

- [ ] Templates de mensagens
- [ ] Upload de imagens/arquivos
- [ ] Emoji picker
- [ ] Analytics e métricas
- [ ] Exportação de conversas
- [ ] Busca em mensagens

---

## 🔧 Arquitetura Técnica

### Fluxo de Mensagens

```
┌─────────────┐
│   Cliente   │
│  WhatsApp   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Twilio    │
│  WhatsApp   │
│     API     │
└──────┬──────┘
       │ POST
       ▼
┌─────────────────────┐
│  Webhook Handler    │
│  /api/webhooks/     │
│     whatsapp        │
└──────┬──────────────┘
       │
       ├─► Salva no Banco (Prisma)
       ├─► Emite Socket.IO
       └─► Bot Auto-Resposta
              │
              ▼
       ┌─────────────┐
       │  Dashboard  │
       │  Atualiza   │
       │  Real-time  │
       └─────────────┘
```

### Componentes

```
/dashboard/whatsapp
├── ConversationList
│   ├── Busca
│   ├── Filtros
│   └── Lista de Conversas
│
└── MessageThread
    ├── Header do Lead
    ├── Histórico de Mensagens
    └── Input de Envio
```

### APIs

```
GET  /api/whatsapp/conversations
     ?filter=all|unread|active
     &search=termo

GET  /api/whatsapp/messages/[leadId]
POST /api/whatsapp/messages/[leadId]
     { content: "mensagem" }

POST /api/webhooks/whatsapp
     (Twilio form-data)
```

---

## 🐛 Troubleshooting

### Mensagens não chegam no dashboard

1. Verificar se Socket.IO está conectado (indicador verde)
2. Verificar console do navegador
3. Verificar logs do servidor
4. Testar webhook manualmente

### Bot não responde

1. Verificar credenciais Twilio no `.env`
2. Verificar logs do webhook
3. Verificar horário comercial
4. Verificar se já enviou mensagem recentemente (anti-spam)

### Webhook retorna erro 500

1. Verificar logs do servidor
2. Verificar conexão com banco de dados
3. Verificar formato dos dados do Twilio
4. Testar com Postman/curl

---

## 📚 Referências

- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma ORM](https://www.prisma.io/docs)

---

## 🎨 Screenshots

### Dashboard Principal
```
┌─────────────────────────────────────────────────────────┐
│  📱 WhatsApp Business    [Métricas] [Templates] [⚙️]    │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  🔍 Buscar   │  Chat com João Silva                     │
│  ────────    │  ──────────────────                      │
│              │                                          │
│  [Todas]     │  Cliente: Oi, gostaria de um orçamento  │
│  [Não lidas] │                                          │
│  [Ativas]    │  Você: Olá! Claro, me informe as        │
│              │  medidas da janela...                    │
│  🟢 João     │                                          │
│  Silva       │                                          │
│  2 min       │  ┌────────────────────────────────────┐  │
│  "Oi..."     │  │ Digite sua mensagem...        [→] │  │
│              │  └────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────┘
```

---

**Desenvolvido com ❤️ para Cortinas Brás**
