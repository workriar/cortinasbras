# Walkthrough: Cortinas Brás - Next.js Transformation

Transformamos o projeto de uma aplicação Flask para uma arquitetura moderna com **Next.js 15+**, mantendo o visual premium e aplicando melhorias significativas em performance, SEO e UX.

## Principais Mudanças

### 1. Frontend Modular & Interativo
- **React Components**: O site foi dividido em componentes reutilizáveis (`Header`, `Hero`, `Products`, `Gallery`, `About`, `ContactForm`, `Footer`).
- **Framer Motion**: Substituímos o AOS por animações mais fluídas e interativas (scroll reveal, progress bar, transições de hover).
- **Next/Image**: Otimização automática de imagens para carregamento mais rápido e melhor SEO.

### 2. Backend & API Routes
- **Next.js API**: As rotas `/api/leads` e `/api/admin/leads` substituem o Flask.
- **SQLite com Node.js**: Mantivemos o banco de dados SQLite para simplicidade, usando a biblioteca `sqlite` para interações rápidas.
- **Geração de PDF**: Implementada com `pdfkit` diretamente no servidor, garantindo que o orçamento seja gerado instantaneamente no envio.
- **Envio de E-mail**: Configurado com `nodemailer`, enviando o PDF em anexo para a loja.

### 3. Melhorias de UI/UX
- **Glassmorphism**: Header fixo com efeito de vidro fosco ao rolar.
- **Formulário Reativo**: Validação em tempo real com `React Hook Form` e `Zod`.
- **Botões Flutuantes**: Botão de WhatsApp sempre visível com badge informativo.
- **Dashboard Administrativo**: Uma interface moderna para gerenciar leads, com estatísticas e busca.

### 4. SEO & Tracking
- **Metadata API**: Títulos, descrições e tags sociais dinâmicas.
- **Scripts de Rastreamento**: Google Ads e Meta Pixel integrados nativamente via `next/script`.

---

## Como Executar

### Ambiente de Desenvolvimento
```bash
cd next-app
npm install
npm run dev
```

### Produção (Build)
```bash
cd next-app
npm run build
npm start
```

## Arquivos Criados
- [layout.tsx](file:///root/next-app/src/app/layout.tsx): Estrutura base e SEO.
- [page.tsx](file:///root/next-app/src/app/page.tsx): Página principal com todos os componentes.
- [/api/leads/route.ts](file:///root/next-app/src/app/api/leads/route.ts): Processamento de leads, PDF e e-mail.
- [/admin/leads/page.tsx](file:///root/next-app/src/app/admin/leads/page.tsx): Painel administrativo.

---
> [!NOTE]
> O banco de dados `leads.db` será criado automaticamente no primeiro acesso. Certifique-se de configurar as variáveis de ambiente (`MAIL_USERNAME`, `MAIL_PASSWORD`, etc.) no seu ambiente de produção.
