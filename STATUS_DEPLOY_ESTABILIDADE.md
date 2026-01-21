# 🚀 Status do Deploy - Estabilização do Servidor

## 🚨 PROBLEMA CRÍTICO: SERVIDOR INSTÁVEL

**Sintoma**: O painel EasyPanel está caindo ("caindo direto").
**Diagnóstico**: O consumo de memória do build (configurado para usar até 4GB) está **esgotando a memória do servidor**, forçando o Linux a matar processos (como o próprio painel ou o banco de dados) para sobreviver.

---

## 🛡️ AÇÃO CORRETIVA (Deploy #8)

1.  **Redução de Memória**: Reduzi o limite de memória do build de 4GB para **2GB**.
    *   Isso deve impedir que o build "sequestre" todo o servidor.
    *   O deploy pode demorar um pouco mais, mas será mais seguro.
2.  **Manutenção das Correções Anteriores**:
    *   Remoção do campo `convertedAt` (evita erro 500).
    *   Correção do `.dockerignore` (deve corrigir erro de cópia).

---

## ⏳ EM ANDAMENTO (Deploy #8)

**Início**: 19:55 UTC
**Status**: 🔨 Rebuilding (Modo Seguro)

---

## 🛑 IMPORTANTE

**Se o painel cair novamente, por favor me avise.** Isso indicaria que mesmo 2GB é muito para a capacidade atual do servidor durante o build. Nesse caso, teremos que buildar localmente e enviar apenas a imagem pronta (o que é mais complexo, mas resolve definitivamente o uso de recursos).
