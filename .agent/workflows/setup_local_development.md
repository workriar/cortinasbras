---
description: Configuração completa do ambiente local para o projeto Cortinas Brás (Node.js, dependências, .env e execução)
---

# Workflow: Configuração Local

1. **Verificar pré‑requisitos**
   - Certifique‑se de que o **Node.js (v18 ou superior)** e o **npm** estão instalados.
   - (Opcional) Instale o **pnpm** se preferir.

2. **Instalar dependências**
   ```bash
   npm ci   # instala exatamente as versões listadas em package-lock.json
   ```

3. **Configurar variáveis de ambiente**
   - Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
   - Edite o `.env` conforme necessário (por exemplo, `NEXT_PUBLIC_SITE_URL`, credenciais do banco, etc.).

4. **Iniciar o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   - O aplicativo será servido em **http://localhost:3000**.
   - Abra o navegador e navegue até a URL para verificar se a aplicação está rodando.

5. **Testar login e dashboard**
   - Acesse `/login`.
   - Use as credenciais de teste:
     - **superadmin / admin123**
     - **vendedor / user123**
   - Após login, você será redirecionado para `/dashboard` onde a tabela de leads será exibida.

6. **Opcional: Build de produção**
   ```bash
   npm run build   # gera o bundle de produção
   npm start       # inicia o servidor em modo produção
   ```

---

*Este workflow pode ser executado usando o comando `/setup_local_development` que lê este arquivo e segue os passos acima.*
