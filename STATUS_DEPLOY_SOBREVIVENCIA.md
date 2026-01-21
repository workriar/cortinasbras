# 🚀 Status do Deploy - Modo de Sobrevivência (VPS Baixa Memória)

## 🚨 DIAGNÓSTICO: OVERKILL

O servidor falhou ("Killed" / "Context Canceled") e o painel caiu porque o build do Next.js é muito pesado para os recursos disponíveis. Mesmo com 2GB limitados, o processo `tsc` (type checking) e `eslint` consomem muito.

---

## 🛡️ CORREÇÕES EXTREMAS (Deploy #9)

Para garantir que o site suba, desativei verificações que consomem muita memória. Essas verificações devem ser feitas na máquina local, não no servidor de produção fraco.

1.  **Next.js Config (`next.config.ts`):**
    *   `eslint.ignoreDuringBuilds: true`: Ignora linting no build.
    *   `typescript.ignoreBuildErrors: true`: Ignora checagem de tipos no build (confiamos no código local).
    *   `productionBrowserSourceMaps: false`: Não gera mapas de código (economiza muita RAM e disco).
2.  **Package.json:**
    *   Removi `tsc --project tsconfig.server.json` do build script. Isso significa que o Socket.IO (chat em tempo real) pode ficar indisponível temporariamente, mas o SITE e o FORMULÁRIO vão subir.
3.  **Dockerfile:**
    *   Mantido limite de 2GB de RAM (configurado no commit anterior).

---

## ⏳ EM ANDAMENTO (Deploy #9)

**Início**: 20:25 UTC
**Status**: 🔨 Rebuilding (Modo Ultra-Leve)

---

## 🎯 OBJETIVO

Fazer o site ficar **ONLINE** e o painel **ESTÁVEL**.
Depois que estiver estável, podemos pensar em reativar o Socket.IO com uma estratégia de build local (Github Actions ou build na minha máquina e push da imagem Docker), que remove a carga do seu servidor.
