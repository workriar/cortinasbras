---
description: Configuração completa do ambiente local para o projeto Cortinas Brás (Node.js, dependências, .env e execução)
---

# Passos para rodar o site localmente (Windows)

1. **Instalar Node.js (inclui npm)**
   - Abra o PowerShell **como Administrador**.
   - Execute o comando abaixo para instalar a versão LTS via **winget** (disponível no Windows 10+). Se o `winget` não estiver instalado, siga as instruções do site oficial do Windows Package Manager.
   ```powershell
   // turbo
   winget install -e --id OpenJS.NodeJS.LTS
   ```
   - Após a instalação, confirme com:
   ```powershell
   node -v
   npm -v
   ```
   - Caso prefira, baixe o instalador direto de https://nodejs.org e marque *Add to PATH*.

2. **Instalar dependências do projeto**
   ```powershell
   // turbo
   cd e:\\CB\\www\\cortinas-app
   npm install
   ```
   - Esse comando lê o `package.json` e baixa Next.js, React, Tailwind, Framer‑Motion etc.

3. **Criar arquivo de variáveis de ambiente**
   ```powershell
   // turbo
   copy .env.example .env
   notepad .env   # edite as variáveis (SMTP, chaves, etc.)
   ```
   - Se não precisar enviar e‑mail ainda, deixe os campos vazios.

4. **Rodar o servidor de desenvolvimento**
   ```powershell
   // turbo
   npm run dev
   ```
   - Abra o navegador em `http://localhost:3000` e verifique o site.

5. **(Opcional) Build de produção**
   ```powershell
   // turbo
   npm run build && npm start
   ```
   - Disponível na porta 3000 ou na porta configurada.

---

**Dicas rápidas**
- Use `Ctrl+Shift+P` → *Terminal: New Terminal* no VS Code para abrir o terminal já na pasta correta.
- Caso o comando `winget` falhe, instale o Node.js manualmente pelo instalador.
- Se houver erros de lint, rode `npm run lint` para identificar.

**⚡️ Pronto!**
Siga os passos acima e seu ambiente local estará configurado e rodando.
