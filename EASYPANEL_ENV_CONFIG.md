# Variáveis de Ambiente para Easypanel

Copie e cole estas variáveis na aba **Environment** do seu serviço `cortinas-app`.

```env
DATABASE_URL=sqlite:////app/data/leads.db
NEXTAUTH_SECRET=um-segredo-super-longo-e-aleatorio-123
NEXTAUTH_URL=https://cortinasbras.com.br
PORT=3000

# Configurações de Email (Hostinger)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=4LuZr4hrFqeTsrZ@
MAIL_DEFAULT_SENDER="Cortinas Brás <loja@cortinasbras.com.br>"
MAIL_NOTIFICATION_TO=loja@cortinasbras.com.br
```

---

### Opção Alternativa: Usar Gmail (Recomendado se o acima falhar)
Se o email da Hostinger continuar bloqueando, use uma conta do **Gmail** com "Senha de App".

1. Acesse sua Conta Google > Segurança > Verificação em duas etapas > Senhas de App.
2. Crie uma senha chamada "Site".
3. Use esta configuração:

```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=seu.email@gmail.com
MAIL_PASSWORD=senha-de-app-gerada
MAIL_DEFAULT_SENDER="Cortinas Brás <seu.email@gmail.com>"
MAIL_NOTIFICATION_TO=loja@cortinasbras.com.br
```


> **Atenção:** A variável `PORT=3000` é obrigatória para corrigir o erro 502 (Bad Gateway).
