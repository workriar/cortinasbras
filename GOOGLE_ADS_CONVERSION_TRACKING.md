# Google Ads - Acompanhamento de Conversões

## ✅ Status: IMPLEMENTADO

Este documento descreve a implementação da etiqueta de acompanhamento de conversões do Google Ads no projeto Cortinas Brás.

## 📋 Informações da Conta

- **ID da Conta Google Ads**: AW-17672945118
- **ID do Evento de Conversão**: 1K53CJyU4d4bEN77jutB
- **Nome do Evento**: Enviar formulário de leads (1)
- **Compartilhado por**: cortinasbras@gmail.com

## 🎯 Implementação

### 1. Etiqueta da Google (gtag.js)

A etiqueta da Google foi instalada no arquivo `/root/src/app/layout.tsx` (linhas 53-66):

```tsx
{/* Google tag (gtag.js) - AW-17672945118 */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=AW-17672945118"
  strategy="afterInteractive"
/>
<Script id="google-ads-tag" strategy="afterInteractive">
  {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-17672945118');
`}
</Script>
```

### 2. Fragmento do Evento de Conversão

O fragmento do evento foi implementado como uma função global no mesmo arquivo (linhas 90-95):

```tsx
{/* Google Ads Conversion Events */}
<Script id="google-ads-conversion-events" strategy="afterInteractive">
  {`
  // Evento de Conversão: Enviar formulário de leads
  function gtagConversionLeads() {
    gtag('event', 'conversion', {
      'send_to': 'AW-17672945118/1K53CJyU4d4bEN77jutB'
    });
  }

  // Disponibilizar globalmente
  window.gtagConversionLeads = gtagConversionLeads;
`}
</Script>
```

### 3. Integração nos Formulários

A função `gtagConversionLeads()` é chamada automaticamente quando um lead é criado com sucesso nos seguintes componentes:

#### ContactForm.tsx (Formulário do Site)
```tsx
if (response.data?.status === 'success' && response.data.whatsapp_url) {
    // Trigger Google Ads conversion event
    if (typeof window !== 'undefined' && (window as any).gtagConversionLeads) {
        (window as any).gtagConversionLeads();
    }
    // ... resto do código
}
```

#### LeadForm.tsx (Formulário do Dashboard)
```tsx
if (method === 'POST') {
    // Trigger Google Ads conversion event for new leads
    if (typeof window !== 'undefined' && (window as any).gtagConversionLeads) {
        (window as any).gtagConversionLeads();
    }
    setSuccessData(data);
}
```

## 🔍 Pontos de Conversão

O evento de conversão é disparado nos seguintes cenários:

1. **Formulário do Site** (`/src/components/ContactForm.tsx`):
   - Quando um visitante preenche e envia o formulário de orçamento na página principal
   - Após validação bem-sucedida e criação do lead no banco de dados

2. **Formulário do Dashboard** (`/src/components/LeadForm.tsx`):
   - Quando um novo lead é cadastrado manualmente pelo dashboard
   - Apenas para novos cadastros (POST), não para edições (PUT)

## ✨ Funcionalidades

- ✅ Etiqueta da Google instalada em todas as páginas
- ✅ Evento de conversão configurado
- ✅ Integração automática nos formulários
- ✅ Verificação de disponibilidade da função antes de chamar
- ✅ Rastreamento apenas para novos leads (não para edições)

## 🧪 Como Testar

1. Acesse o site em produção
2. Preencha o formulário de orçamento
3. Envie o formulário
4. Verifique no Google Ads se a conversão foi registrada (pode levar até 24h para aparecer)

## 📊 Monitoramento

Para verificar se as conversões estão sendo rastreadas:

1. Acesse sua conta do Google Ads
2. Vá em **Ferramentas e Configurações** > **Medição** > **Conversões**
3. Procure pela ação "Enviar formulário de leads (1)"
4. Verifique o número de conversões registradas

## 🔧 Manutenção

### Adicionar Novo Ponto de Conversão

Se precisar adicionar o rastreamento em outro formulário:

```tsx
// Após envio bem-sucedido do formulário
if (typeof window !== 'undefined' && (window as any).gtagConversionLeads) {
    (window as any).gtagConversionLeads();
}
```

### Modificar ID de Conversão

Se precisar alterar o ID de conversão, edite o arquivo `/root/src/app/layout.tsx`:

```tsx
function gtagConversionLeads() {
    gtag('event', 'conversion', {
        'send_to': 'AW-XXXXXXXX/YYYYYYYYYYYY' // Novo ID aqui
    });
}
```

## 📝 Notas Importantes

- A etiqueta usa `strategy="afterInteractive"` do Next.js para carregar após a página estar interativa
- A verificação `typeof window !== 'undefined'` garante compatibilidade com SSR (Server-Side Rendering)
- O evento só é disparado em ambiente de produção (navegador)
- Conversões podem levar até 24 horas para aparecer no Google Ads

## 🔗 Referências

- [Documentação Google Ads - Acompanhamento de Conversões](https://support.google.com/google-ads/answer/1722022)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [Google Tag (gtag.js) Reference](https://developers.google.com/tag-platform/gtagjs)
