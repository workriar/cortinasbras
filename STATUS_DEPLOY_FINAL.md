# 🚀 Status do Deploy - Correção Cumulativa (Build + Erro 500)

## 🚨 FALHAS ANTERIORES

1.  **Timeout**: Resolvido com otimização de memória.
2.  **Failed to calculate checksum (public not found)**: Provável bug no `.dockerignore` ocultando `static` ou falha na cópia.
3.  **Erro 500 (Leads)**: Coluna `convertido_em` não existe no banco.

---

## 🛠️ CORREÇÕES APLICADAS (Deploy #7)

1.  **Build Fix**:
    *   Removido `static` do `.dockerignore`.
    *   Adicionado debug (`ls -la`) no Dockerfile para verificar geração de arquivos.
2.  **Schema Fix**:
    *   Removido campo `convertedAt` (@map("convertido_em")) do `schema.prisma`.
    *   Isso deve parar o erro 500 ao listar leads.

---

## ⏳ EM ANDAMENTO (Deploy #7)

**Início**: 19:47 UTC
**Estimativa**: 6-8 minutos
**Status**: 🔨 Rebuilding...

---

## 🧪 O QUE TESTAR (~19:55 UTC)

1.  **Build**: Verificar se passa da etapa `COPY`.
2.  **Dashboard**: Acessar `/dashboard/crm` e verificar se os leads carregam (sem erro 500).
3.  **Imagens**: Verificar se imagens carregam (depende do build correto).

---

**Estamos muito perto! A remoção do campo problemático deve estabilizar o backend, e a correção do dockerignore deve estabilizar o deploy.**
