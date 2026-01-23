# 📝 Nota Importante - Variável NEXT_PUBLIC_SITE_URL

## ⚠️ Ação Necessária

A variável de ambiente `NEXT_PUBLIC_SITE_URL` precisa ser adicionada ao arquivo `.env`.

### Como Corrigir

Abra o arquivo `.env` e adicione a seguinte linha:

**Para desenvolvimento local:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Para produção:**
```env
NEXT_PUBLIC_SITE_URL=https://cortinasbras.com.br
```

### Por que é importante?

Esta variável é usada para:
- Gerar links corretos do PDF no WhatsApp
- Configurar URLs absolutas em e-mails
- Definir o domínio base da aplicação

### Verificação

Após adicionar a variável, execute:

```bash
npm run verify
```

Você deve ver:
```
✓ NEXT_PUBLIC_SITE_URL está configurado
```

E o resumo deve mostrar:
```
Testes passados: 5/5 (100%)
✨ TODOS OS TESTES PASSARAM! Sistema pronto para produção.
```

---

**Status Atual:** 4/5 testes passando (80%)  
**Faltando:** Apenas `NEXT_PUBLIC_SITE_URL` no `.env`
