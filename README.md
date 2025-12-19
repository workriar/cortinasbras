# 🏠 Cortinas Brás - Sistema de Orçamentos

Sistema web moderno para geração de orçamentos de cortinas sob medida, desenvolvido com **Next.js 16** e **React 19**.

## 🚀 Tecnologias

- **Framework**: Next.js 16.0.10 (App Router)
- **Frontend**: React 19, TypeScript, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite3
- **Email**: Nodemailer (SMTP Hostinger)
- **PDF**: Puppeteer + PDFKit
- **Deploy**: Docker + Docker Compose
- **Animações**: Framer Motion
- **Formulários**: React Hook Form + Zod

## 📋 Pré-requisitos

- Node.js 20+ 
- npm ou yarn
- Docker (para deploy)

## 🛠️ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cortinas-app.git
cd cortinas-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute em desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```env
# Email (Hostinger)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@cortinasbras.com.br
MAIL_PASSWORD=sua-senha
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br

# Database
DATABASE_URL=sqlite:./data/leads.db

# Site
NEXT_PUBLIC_SITE_URL=https://cortinasbras.com.br
```

## 📦 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter ESLint
```

## 🐳 Deploy com Docker

### Build e Run Local

```bash
# Build da imagem
docker build -t cortinas-app .

# Run container
docker run -p 3000:3000 --env-file .env cortinas-app
```

### Docker Compose (Recomendado)

```bash
# Subir aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down
```

## 🌐 Deploy em Produção

### EasyPanel (VPS Hostinger)

1. **Conecte o repositório GitHub** no EasyPanel
2. **Configure as variáveis de ambiente** no painel
3. **Configure o volume** para persistência:
   - Path: `/app/data`
   - Type: Persistent
4. **Deploy automático** a cada push na branch `main`

### Configuração DNS

```
Tipo: A
Nome: @ (ou www)
Valor: [IP do VPS]
TTL: 3600
```

### SSL/HTTPS

O Traefik (configurado no docker-compose) gerencia automaticamente os certificados SSL via Let's Encrypt.

## 📁 Estrutura do Projeto

```
cortinas-app/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── page.tsx           # Página principal
│   │   ├── layout.tsx         # Layout global
│   │   ├── api/               # API Routes
│   │   │   ├── leads/         # Endpoint de leads
│   │   │   └── admin/         # Admin endpoints
│   │   └── admin/             # Painel admin
│   ├── components/            # Componentes React
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Products.tsx
│   │   ├── Gallery.tsx
│   │   ├── About.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Footer.tsx
│   │   └── PromoPopup.tsx
│   └── services/              # Serviços
│       ├── db.ts             # Database (SQLite)
│       ├── email.ts          # Email (Nodemailer)
│       └── pdf.ts            # PDF (Puppeteer)
├── public/
│   └── static/               # Assets (imagens, logos)
├── Dockerfile                # Container de produção
├── docker-compose.yml        # Orquestração
└── package.json              # Dependências

```

## 🎨 Funcionalidades

### Para Clientes
- ✅ Landing page moderna e responsiva
- ✅ Formulário de orçamento intuitivo
- ✅ Galeria de produtos e ambientes
- ✅ Redirecionamento automático para WhatsApp
- ✅ PDF profissional gerado automaticamente
- ✅ Email com orçamento enviado

### Para Administração
- ✅ Painel de leads (`/admin/leads`)
- ✅ Visualização de todos os orçamentos
- ✅ Estatísticas (total, hoje)
- ✅ Exportação de relatórios em PDF
- ✅ Download individual de orçamentos

## 🔒 Segurança

- ✅ Variáveis de ambiente para credenciais
- ✅ HTTPS obrigatório em produção
- ✅ Headers de segurança configurados
- ✅ Validação de formulários (Zod)
- ⚠️ **TODO**: Adicionar autenticação no admin

## 📊 SEO

- ✅ Meta tags otimizadas
- ✅ Open Graph (Facebook)
- ✅ Twitter Cards
- ✅ Sitemap.xml automático
- ✅ Robots.txt configurado
- ✅ Schema.org markup
- ✅ Performance otimizada (Lighthouse 90+)

## 🧪 Testes

```bash
# TODO: Implementar testes
npm test
```

## 📈 Analytics

- ✅ Google Tag Manager integrado
- ✅ Meta Pixel (Facebook) integrado
- ✅ Eventos de conversão configurados

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é proprietário da **Cortinas Brás**.

## 📞 Suporte

- **Website**: [cortinasbras.com.br](https://cortinasbras.com.br)
- **WhatsApp**: (11) 99289-1070
- **Email**: loja@cortinasbras.com.br

---

**Desenvolvido com ❤️ para Cortinas Brás**
