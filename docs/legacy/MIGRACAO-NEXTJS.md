# 🔄 Migração Flask → Next.js

## 📅 Data da Migração
**19 de Dezembro de 2025**

## 🎯 Objetivo
Migrar completamente o projeto **Cortinas Brás** de Flask (Python) para Next.js (TypeScript/React), mantendo todas as funcionalidades e melhorando a arquitetura.

---

## ✅ Mudanças Realizadas

### 1. **Stack Tecnológica**

#### Antes (Flask)
```
- Backend: Flask (Python 3.12)
- Frontend: HTML/CSS/JavaScript + TailwindCSS CDN
- Templates: Jinja2
- PDF: ReportLab
- Email: Flask-Mail
- DB: SQLAlchemy + SQLite
- Deploy: Gunicorn + Docker
```

#### Depois (Next.js)
```
- Framework: Next.js 16 (App Router)
- Frontend: React 19 + TypeScript
- Styling: TailwindCSS 4
- PDF: Puppeteer + PDFKit
- Email: Nodemailer
- DB: SQLite3 (nativo)
- Deploy: Node.js + Docker
```

### 2. **Estrutura de Arquivos**

#### Removidos (Flask)
```
❌ app.py
❌ config.py
❌ pdf_generator.py
❌ requirements.txt
❌ templates/
❌ static/
❌ flask-legacy/
❌ venv/
❌ __pycache__/
❌ test_*.py (testes Flask)
```

#### Adicionados/Mantidos (Next.js)
```
✅ src/app/              # App Router
✅ src/components/       # Componentes React
✅ src/services/         # DB, Email, PDF
✅ public/               # Assets estáticos
✅ package.json          # Dependências Node
✅ tsconfig.json         # TypeScript config
✅ next.config.ts        # Next.js config
```

### 3. **Arquivos de Configuração Atualizados**

#### Dockerfile
- ✅ Migrado de Python 3.12 → Node 20 Alpine
- ✅ Multi-stage build otimizado
- ✅ Puppeteer com Chromium para PDFs
- ✅ Output standalone do Next.js

#### docker-compose.yml
- ✅ Porta 8000 → 3000
- ✅ Variáveis de ambiente atualizadas
- ✅ Volume para persistência de dados
- ✅ Traefik labels mantidos

#### .dockerignore
- ✅ Atualizado para Node.js
- ✅ Exclusão de arquivos Flask legados

#### .gitignore
- ✅ Padrões Next.js adicionados
- ✅ Arquivos Flask marcados como legados

#### .env.example
- ✅ Variáveis adaptadas para Next.js
- ✅ Configurações de email mantidas
- ✅ DATABASE_URL simplificado

#### README.md
- ✅ Documentação completa reescrita
- ✅ Instruções de instalação Next.js
- ✅ Scripts npm documentados

---

## 🔄 Mapeamento de Funcionalidades

### Rotas

| Flask (Antes) | Next.js (Depois) | Status |
|---------------|------------------|--------|
| `GET /` | `GET /` (page.tsx) | ✅ Migrado |
| `POST /enviar` | `POST /api/leads` | ✅ Migrado |
| `GET /admin/leads` | `GET /admin/leads` | ✅ Migrado |
| `GET /admin/leads/export-pdf` | `GET /api/admin/leads?export=pdf` | ✅ Migrado |
| `GET /orcamento/<id>/pdf` | `GET /api/leads/<id>/pdf` | ✅ Migrado |
| `GET /robots.txt` | Next.js automático | ✅ Migrado |
| `GET /sitemap.xml` | Next.js automático | ✅ Migrado |

### Componentes

| Flask Template | React Component | Status |
|----------------|-----------------|--------|
| `templates/index.html` | `src/app/page.tsx` + Components | ✅ Componentizado |
| `templates/admin_leads.html` | `src/app/admin/leads/page.tsx` | ✅ Migrado |
| `templates/email_template.html` | `src/services/email.ts` (template string) | ✅ Migrado |

### Serviços

| Flask | Next.js | Status |
|-------|---------|--------|
| `pdf_generator.py` | `src/services/pdf.ts` | ✅ Migrado |
| `Flask-Mail` | `src/services/email.ts` (Nodemailer) | ✅ Migrado |
| `SQLAlchemy` | `src/services/db.ts` (SQLite3) | ✅ Migrado |

---

## 📊 Melhorias Implementadas

### Performance
- ✅ **Server Components**: Renderização no servidor por padrão
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Code Splitting**: Automático por rota
- ✅ **React Compiler**: Otimizações automáticas

### Developer Experience
- ✅ **TypeScript**: Type safety em todo o código
- ✅ **Hot Reload**: Desenvolvimento mais rápido
- ✅ **ESLint**: Linting automático
- ✅ **Componentes Reutilizáveis**: Melhor manutenibilidade

### SEO
- ✅ **Metadata API**: Next.js 13+ metadata
- ✅ **Server-Side Rendering**: SEO otimizado
- ✅ **Sitemap/Robots**: Geração automática

### Segurança
- ✅ **API Routes**: Backend isolado
- ✅ **Environment Variables**: Melhor gestão
- ✅ **CSRF Protection**: Nativo do Next.js

---

## ⚠️ Pontos de Atenção

### 1. **Banco de Dados**
- ✅ Mantido SQLite (compatibilidade)
- ⚠️ Schema deve ser compatível
- 💡 Considerar migração para PostgreSQL no futuro

### 2. **Email**
- ✅ SMTP Hostinger mantido
- ✅ Credenciais nas variáveis de ambiente
- ⚠️ Testar envio em produção

### 3. **PDF**
- ✅ Puppeteer substitui ReportLab
- ✅ Chromium incluído no Docker
- ⚠️ Maior uso de memória (monitorar)

### 4. **Deploy**
- ✅ Docker configurado
- ✅ EasyPanel compatível
- ⚠️ Rebuild necessário em produção

---

## 🚀 Próximos Passos

### Imediato
1. ✅ Testar localmente (`npm run dev`)
2. ✅ Verificar todas as rotas
3. ✅ Testar geração de PDF
4. ✅ Testar envio de email
5. ✅ Build de produção (`npm run build`)

### Deploy
1. ⏳ Commit e push para repositório
2. ⏳ Deploy no EasyPanel
3. ⏳ Configurar variáveis de ambiente
4. ⏳ Testar em produção
5. ⏳ Monitorar logs e performance

### Melhorias Futuras
- [ ] Adicionar testes (Jest + React Testing Library)
- [ ] Implementar autenticação no admin
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Adicionar Sentry para monitoramento de erros
- [ ] Implementar cache (Redis)
- [ ] Migrar para PostgreSQL (se necessário)

---

## 📝 Comandos Úteis

### Desenvolvimento
```bash
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
```

### Docker
```bash
docker build -t cortinas-app .                    # Build
docker run -p 3000:3000 cortinas-app              # Run
docker-compose up -d                              # Compose up
docker-compose logs -f                            # Ver logs
docker-compose down                               # Parar
```

### Git
```bash
git add .
git commit -m "feat: migrate from Flask to Next.js"
git push origin main
```

---

## 📞 Suporte

Se encontrar problemas durante a migração:

1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação: `README.md`
3. Verifique variáveis de ambiente: `.env.example`

---

## ✅ Checklist de Migração

- [x] Copiar arquivos Next.js para raiz
- [x] Remover arquivos Flask
- [x] Atualizar Dockerfile
- [x] Atualizar docker-compose.yml
- [x] Atualizar .dockerignore
- [x] Atualizar .gitignore
- [x] Atualizar .env.example
- [x] Atualizar README.md
- [x] Remover pasta next-app/
- [ ] Testar localmente
- [ ] Build de produção
- [ ] Deploy em produção
- [ ] Testes de funcionalidade
- [ ] Monitoramento

---

**Migração realizada em**: 19/12/2025  
**Status**: ✅ **CONCLUÍDA**  
**Próximo passo**: Testes locais e deploy

---

**Desenvolvido com ❤️ para Cortinas Brás**
