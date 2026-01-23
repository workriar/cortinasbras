---
description: Guia completo para instalar um novo servidor Easypanel do zero e implantar o projeto
---

# Instalação Limpa do Easypanel 🚀

Se o seu servidor atual está com problemas persistentes, a maneira mais rápida de resolver é começar do zero em um servidor limpo. O Easypanel foi feito para ser instalado em sistemas "zerados".

## ⚠️ Pré-requisitos
1.  **Um Servidor VPS Limpo:** Ubuntu 22.04 LTS ou 24.04 LTS (Recomendado).
    *   **Importante:** Não tente instalar em cima de um servidor que já tem painéis ou configurações antigas. Reinstale o OS no painel da sua hospedagem (Format/Reinstall).
2.  **Recursos Mínimos:** 1 vCPU, 2GB RAM (para Next.js + Chromium).

## Passo 1: Instalar o Easypanel
Acesse seu servidor via SSH (Terminal) e rode este comando único. Ele vai instalar Docker e Easypanel automaticamente.

```bash
curl -sSL https://get.easypanel.io | sh
```

Aguarde o fim da instalação (pode levar 2-5 minutos).

## Passo 2: Configuração Inicial
1.  Acesse `http://SEU_IP_DO_SERVIDOR:3000` no navegador.
2.  Crie sua conta de administrador (email e senha).
3.  Siga o wizard inicial para criar seu primeiro **Projeto** (Ex: `CortinasBras`).

## Passo 3: Configurar o Serviço (App)
Dentro do projeto:
1.  Clique em **Service** -> **App**.
2.  **Source (Fonte):** Selecione **Git**.
3.  **Repository:** Cole a URL completa (com token) que criamos antes:
    *   URL: `https://workriar:SEU_TOKEN_AQUI@github.com/workriar/cortinasbras.git`
    *   *Nota:* Se preferir, pode configurar sem token na URL usando a aba "Git" nas configurações depois, mas colar com token direto é mais rápido para testar.
4.  **Branch:** `main`
5.  **Build Method:** `Dockerfile` (O Easypanel deve detectar automaticamente `/Dockerfile`).
6.  Clique em **Create**.

## Passo 4: Variáveis de Ambiente (Environment)
Antes de fazer o deploy, vá na aba **Environment** do serviço e adicione as variáveis:

*   `DATABASE_URL` = `sqlite:////app/data/leads.db`
*   `NEXTAUTH_SECRET` = `(gere um segredo longo)`
*   `NEXTAUTH_URL` = `https://seusite.com` (ou o domínio temporário do easypanel)
*   **Importante:** Adicione também as variáveis de email (`MAIL_username`, etc) se tiver.

## Passo 5: Deploy
Clique em **Deploy**.

Como já corrigimos o código no repositório (commits recentes), o Easypanel deve:
1.  Baixar o código (Clone).
2.  Ler o `Dockerfile`.
3.  Instalar dependências (incluindo `python3` e `make` que adicionamos).
4.  Copiar `prisma/`.
5.  Fazer o Build.
6.  Iniciar o site na porta 3000!

---
**Dica:** Se usar domínio personalizado, configure-o na aba "Domains" do serviço para ativar o HTTPS automático.
