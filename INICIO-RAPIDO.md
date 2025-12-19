# 🚀 Guia Rápido - Cortinas Brás (Next.js)

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com suas credenciais
# Mínimo necessário:
# - MAIL_USERNAME
# - MAIL_PASSWORD
```

### 3. Executar em Desenvolvimento
```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📦 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção (após build)
npm run lint     # Verificar código
```

---

## 🐳 Docker (Produção)

### Opção 1: Docker Compose (Recomendado)
```bash
# Subir aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f web

# Parar
docker-compose down
```

### Opção 2: Docker Manual
```bash
# Build
docker build -t cortinas-app .

# Run
docker run -p 3000:3000 --env-file .env cortinas-app
```

---

## 🔧 Variáveis de Ambiente Essenciais

```env
# .env.local

# Email (obrigatório)
MAIL_USERNAME=seu-email@cortinasbras.com.br
MAIL_PASSWORD=sua-senha

# Banco de dados (opcional - padrão: ./data/leads.db)
DATABASE_URL=sqlite:./data/leads.db

# Site (opcional - padrão: http://localhost:3000)
NEXT_PUBLIC_SITE_URL=https://cortinasbras.com.br
```

---

## 📁 Estrutura Importante

```
cortinas-app/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Página principal
│   │   ├── api/leads/         # API de orçamentos
│   │   └── admin/leads/       # Painel admin
│   ├── components/            # Componentes React
│   └── services/              # DB, Email, PDF
├── public/static/             # Imagens e assets
├── .env.local                 # Suas credenciais (criar)
└── package.json               # Dependências
```

---

## ✅ Checklist Pré-Deploy

- [ ] `npm install` executado
- [ ] `.env.local` criado e configurado
- [ ] `npm run dev` funcionando
- [ ] Formulário testado localmente
- [ ] Email de teste enviado
- [ ] PDF gerado corretamente
- [ ] `npm run build` sem erros
- [ ] Variáveis de ambiente configuradas no servidor

---

## 🆘 Problemas Comuns

### Erro: "Cannot find module 'sqlite3'"
```bash
npm install
```

### Erro: "SMTP connection failed"
Verifique:
- `MAIL_USERNAME` e `MAIL_PASSWORD` corretos
- `MAIL_SERVER=smtp.hostinger.com`
- `MAIL_PORT=587`

### Erro: "Puppeteer failed to launch"
Em desenvolvimento (Windows/Mac):
```bash
# Puppeteer baixa o Chrome automaticamente
npm install
```

Em produção (Docker):
```bash
# Já configurado no Dockerfile
docker-compose up -d
```

---

## 📞 Rotas Principais

- **Home**: `/`
- **API Leads**: `POST /api/leads`
- **Admin**: `/admin/leads`
- **PDF**: `/api/leads/[id]/pdf`

---

## 🎯 Próximos Passos

1. ✅ Testar localmente
2. ✅ Fazer build: `npm run build`
3. ✅ Testar produção: `npm run start`
4. ✅ Deploy no servidor
5. ✅ Configurar domínio e SSL

---

## 📚 Documentação Completa

- **README.md** - Documentação completa
- **MIGRACAO-NEXTJS.md** - Detalhes da migração
- **.env.example** - Todas as variáveis disponíveis

---

**Dúvidas?** Consulte o README.md completo.

**Desenvolvido com ❤️ para Cortinas Brás**
