# Geração de PDF - Cortinas Brás

Este documento explica como funciona a geração de PDF de orçamentos no projeto Cortinas Brás.

## Tecnologia Utilizada

A aplicação usa **Puppeteer** para gerar PDFs a partir de HTML. O Puppeteer é uma biblioteca Node.js que fornece uma API de alto nível para controlar o Chrome/Chromium.

## Arquitetura

```
src/
├── services/
│   └── pdf.ts              # Funções de geração de PDF
└── app/
    └── api/
        └── leads/
            ├── route.ts    # POST - Cria lead e gera PDF
            └── [id]/
                └── pdf/
                    └── route.ts  # GET - Retorna PDF do lead
```

## Como Funciona

### 1. Fluxo de Geração

1. **Usuário preenche formulário** → `ContactForm.tsx`
2. **POST /api/leads** → Salva no banco e chama `generateOrcamentoPdf()`
3. **Puppeteer renderiza HTML** → Gera PDF em memória
4. **PDF é retornado** → Link compartilhado via WhatsApp

### 2. Código de Geração (`pdf.ts`)

```typescript
export async function generateOrcamentoPdf(lead: any): Promise<Buffer> {
    // 1. Criar HTML com dados do lead
    const html = `<!DOCTYPE html>...`;
    
    // 2. Iniciar Puppeteer
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true
    });
    
    // 3. Renderizar HTML
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    // 4. Gerar PDF
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    
    // 5. Fechar navegador
    await browser.close();
    
    return pdfBuffer;
}
```

## Configuração do Chromium

### Ambiente Local (Windows)

O Chromium precisa ser instalado manualmente:

```powershell
npx puppeteer browsers install chrome
```

Isso baixa o Chromium em:
- Windows: `C:\Users\<user>\.cache\puppeteer\chrome\`
- Linux/Mac: `~/.cache/puppeteer/chrome/`

### Ambiente Docker (Produção)

O Dockerfile já instala o Chromium automaticamente:

```dockerfile
# Instalar Chromium
RUN apk add --no-cache libc6-compat chromium

# Configurar Puppeteer para usar Chromium do sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

**Importante:** No Docker, NÃO execute `npx puppeteer browsers install chrome`, pois o Chromium já está instalado via `apk`.

## Troubleshooting

### Erro: "Could not find Chrome"

**Causa:** Chromium não está instalado ou não foi encontrado.

**Solução:**

- **Local:** Execute `npx puppeteer browsers install chrome`
- **Docker:** Reconstrua a imagem com `docker-compose build --no-cache`

### Erro: "ENOENT: no such file or directory, open '...Helvetica.afm'"

**Causa:** Este erro ocorria quando tentávamos usar PDFKit sem fontes instaladas. Agora usamos Puppeteer que não tem esse problema.

**Solução:** Certifique-se de estar usando Puppeteer, não PDFKit.

### Erro: "TimeoutError: Navigation timeout"

**Causa:** O HTML está demorando muito para carregar (geralmente por recursos externos).

**Solução:**
1. Remova recursos externos (imagens, fontes) do HTML
2. Use fontes web-safe ou inline
3. Aumente o timeout: `await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 })`

### PDF em branco ou incompleto

**Causa:** CSS não está sendo aplicado ou elementos não estão renderizando.

**Solução:**
1. Use CSS inline ou `<style>` tags no HTML
2. Certifique-se de usar `printBackground: true` nas opções do PDF
3. Verifique se todos os elementos têm dimensões definidas

## Otimizações

### Performance

1. **Reutilizar instância do navegador** (para múltiplas gerações)
   ```typescript
   // Não recomendado para serverless, mas útil em servidores tradicionais
   let browserInstance: Browser | null = null;
   
   async function getBrowser() {
       if (!browserInstance) {
           browserInstance = await puppeteer.launch({...});
       }
       return browserInstance;
   }
   ```

2. **Reduzir tamanho do HTML**
   - Minimize CSS
   - Evite imagens grandes (use SVG quando possível)
   - Remova espaços em branco desnecessários

### Qualidade

1. **Ajustar DPI para impressão**
   ```typescript
   const pdfBuffer = await page.pdf({
       format: "A4",
       printBackground: true,
       preferCSSPageSize: true,
       displayHeaderFooter: false,
   });
   ```

2. **Usar fontes web-safe**
   - Arial, Helvetica, Times New Roman, Courier
   - Ou incluir fontes via Google Fonts com `@import`

## Alternativas Consideradas

### PDFKit ❌

**Problema:** Requer arquivos de fonte (.afm) e é mais complexo para layouts ricos.

**Motivo da rejeição:** Puppeteer é mais simples e permite usar HTML/CSS familiar.

### jsPDF ❌

**Problema:** API de baixo nível, difícil para layouts complexos.

**Motivo da rejeição:** Puppeteer oferece melhor DX (Developer Experience).

### Puppeteer ✅

**Vantagens:**
- Usa HTML/CSS padrão
- Renderização perfeita (usa motor do Chrome)
- Suporte a fontes web
- Fácil de debugar (pode tirar screenshots)

**Desvantagens:**
- Requer Chromium instalado (~170MB)
- Mais pesado em memória
- Não funciona bem em ambientes serverless muito limitados

## Monitoramento

### Logs de Geração

O código já inclui logs para debug:

```typescript
console.log("Gerando PDF...");
const pdfBuffer = await generateOrcamentoPdf(lead);
console.log("PDF Gerado");
```

### Métricas Importantes

- **Tempo de geração:** Deve ser < 3 segundos
- **Tamanho do PDF:** Geralmente 20-50KB para orçamentos simples
- **Taxa de erro:** Deve ser < 1%

## Referências

- [Puppeteer Documentation](https://pptr.dev/)
- [Puppeteer PDF Options](https://pptr.dev/api/puppeteer.pdfoptions)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

---

**Última atualização:** 2025-12-22
**Versão do Puppeteer:** 22.15.0
