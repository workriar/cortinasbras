# Variáveis de Ambiente para Easypanel

Copie e cole estas variáveis na aba **Environment** do seu serviço `cortinas-app`.

```env
NEXTAUTH_URL=https://cortinasbras.com.br
NEXTAUTH_SECRET=4c78de7a94d188748cac0944853f044a0fc446d9d4e0ea36fad85acda979c3ca
PORT=3000
NODE_ENV=production
DATABASE_URL=postgres://admin:bras2026@cortinasbras_bras_bd:5432/cortinasbras_bd?sslmode=disable
MAIL_SERVER=mail.cronos-painel.com
MAIL_PORT=465
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=AtUeHc5u89aFYX@v
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=loja@cortinasbras.com.br
```

---

### Opção Alternativa de Email: Gmail (Recomendado se o acima falhar)
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

---

> **Atenção:** A variável `PORT=3000` é obrigatória para evitar erro 502 (Bad Gateway).
> **PostgreSQL interno:** `cortinasbras_bras_bd` é o hostname interno do container de banco no Easypanel.
