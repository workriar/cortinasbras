# Variáveis de Ambiente para Easypanel

Copie e cole estas variáveis na aba **Environment** do seu serviço `cortinas-app`.

```env
DATABASE_URL=sqlite:////app/data/leads.db
NEXTAUTH_SECRET=um-segredo-super-longo-e-aleatorio-123
NEXTAUTH_URL=https://cortinasbras.com.br
PORT=3000
```

> **Atenção:** A variável `PORT=3000` é obrigatória para corrigir o erro 502 (Bad Gateway).
