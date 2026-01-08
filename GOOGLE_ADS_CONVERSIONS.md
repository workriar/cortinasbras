# 📊 Google Ads - Eventos de Conversão

Este documento explica como usar os eventos de conversão do Google Ads que foram instalados no site.

## 🎯 Eventos Disponíveis

### 1. **Evento de Compra** (`ads_conversion_Compra_1`)

**Quando usar:** Quando um usuário completa uma compra ou ação de conversão principal.

**Como usar:**

```javascript
// Chamar quando a compra for concluída
window.gtagConversionCompra();
```

**Exemplo em React/Next.js:**

```tsx
const handlePurchaseComplete = () => {
  // Sua lógica de compra aqui
  
  // Disparar evento de conversão
  if (typeof window !== 'undefined' && window.gtagConversionCompra) {
    window.gtagConversionCompra();
  }
};
```

---

### 2. **Evento de Formulário de Orçamento** (`ads_conversion_Formul_rio_de_Or_amento_1`)

**Quando usar:** Quando um usuário envia um formulário de orçamento.

**Como usar:**

```javascript
// Chamar quando o formulário for enviado
// Opcionalmente, redirecionar para uma URL após o evento
window.gtagSendEvent('https://cortinasbras.com.br/obrigado');
```

**Exemplo em React/Next.js:**

```tsx
const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Sua lógica de envio do formulário aqui
  const success = await submitForm();
  
  if (success) {
    // Disparar evento de conversão e redirecionar
    if (typeof window !== 'undefined' && window.gtagSendEvent) {
      window.gtagSendEvent('/obrigado');
    }
  }
};
```

**Exemplo em HTML puro:**

```html
<form onsubmit="return gtagSendEvent('/obrigado')">
  <!-- Campos do formulário -->
  <button type="submit">Enviar Orçamento</button>
</form>
```

---

## 🔧 Implementação no Código

### Localização dos Eventos

Os eventos estão definidos em: `/root/src/app/layout.tsx`

### Estrutura

```typescript
// Evento de Compra
window.gtagConversionCompra = () => {
  gtag('event', 'ads_conversion_Compra_1', {});
};

// Evento de Formulário com Redirecionamento
window.gtagSendEvent = (url?: string) => {
  gtag('event', 'ads_conversion_Formul_rio_de_Or_amento_1', {
    'event_callback': () => {
      if (url) window.location = url;
    },
    'event_timeout': 2000,
  });
  return false;
};
```

---

## 📝 Exemplos Práticos

### Exemplo 1: Botão de Compra

```tsx
import { useState } from 'react';

export default function PurchaseButton() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      // Processar compra
      await processPurchase();
      
      // Disparar conversão
      if (typeof window !== 'undefined' && window.gtagConversionCompra) {
        window.gtagConversionCompra();
      }
      
      alert('Compra realizada com sucesso!');
    } catch (error) {
      console.error('Erro na compra:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePurchase} disabled={loading}>
      {loading ? 'Processando...' : 'Finalizar Compra'}
    </button>
  );
}
```

### Exemplo 2: Formulário de Orçamento

```tsx
'use client';

import { useState } from 'react';

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Enviar dados do formulário
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Disparar evento de conversão e redirecionar
        if (typeof window !== 'undefined' && window.gtagSendEvent) {
          window.gtagSendEvent('/obrigado');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nome"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Mensagem"
      />
      <button type="submit">Solicitar Orçamento</button>
    </form>
  );
}
```

---

## ✅ Verificação

Para verificar se os eventos estão funcionando:

1. Abra o **Console do Navegador** (F12)
2. Execute:
   ```javascript
   // Testar evento de compra
   window.gtagConversionCompra();
   
   // Testar evento de formulário
   window.gtagSendEvent();
   ```
3. Verifique no **Google Ads** se as conversões foram registradas

---

## 🚀 Deploy

Após fazer alterações, faça o deploy:

```bash
git add .
git commit -m "feat: adicionar eventos de conversão do Google Ads"
git push origin main
```

O EasyPanel fará o deploy automaticamente.

---

## 📊 Monitoramento

- **Google Ads**: Acesse "Ferramentas e Configurações" → "Conversões"
- **Google Analytics**: Verifique em "Eventos" → "Conversões"
- **Google Tag Assistant**: Use a extensão do Chrome para testar

---

**Última atualização:** 2026-01-08
