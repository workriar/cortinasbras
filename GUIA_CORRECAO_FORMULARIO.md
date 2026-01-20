# 🔧 Guia de Correção do Formulário - Cortinas Brás

## ✅ Correções Aplicadas

### 1. **Melhorias no ContactForm.tsx**
- ✅ Adicionado logging detalhado para debug
- ✅ Melhorado tratamento de erros
- ✅ Implementado fallback para bloqueio de popup do WhatsApp
- ✅ Mensagens de erro mais claras

### 2. **Melhorias na API de Leads**
- ✅ Adicionado logging com emojis para fácil identificação
- ✅ Melhor rastreamento de erros com stack trace
- ✅ Confirmação de criação de lead

### 3. **Documentação**
- ✅ Criado template de .env com configurações de email
- ✅ Criado guia de diagnóstico

---

## 🚨 AÇÃO NECESSÁRIA: Configurar Email

### Problema
O envio de emails **NÃO está funcionando** porque as variáveis de ambiente não estão configuradas.

### Solução

**Passo 1**: Edite o arquivo `/root/.env` e adicione as seguintes linhas:

```env
# Email Configuration (Hostinger SMTP)
MAIL_SERVER=smtp.hostinger.com
MAIL_PORT=465
MAIL_USE_SSL=true
MAIL_USERNAME=loja@cortinasbras.com.br
MAIL_PASSWORD=SUBSTITUA_PELA_SENHA_REAL_AQUI
MAIL_DEFAULT_SENDER=loja@cortinasbras.com.br
MAIL_NOTIFICATION_TO=cortinasbras@gmail.com
```

**Passo 2**: Substitua `SUBSTITUA_PELA_SENHA_REAL_AQUI` pela senha real do email `loja@cortinasbras.com.br`

**Passo 3**: Reinicie o servidor Next.js:
```bash
# Se estiver rodando localmente:
# Pressione Ctrl+C para parar o servidor
# Depois execute:
npm run dev

# Se estiver em produção (Docker):
# Reconstrua e reinicie o container
```

---

## 📱 WhatsApp - Melhorias Implementadas

### O que foi corrigido:

1. **Logging detalhado**: Agora você pode ver no console do navegador:
   - 📝 Quando o formulário é enviado
   - ✅ Resposta da API
   - 📱 URL do WhatsApp gerada
   - ⚠️ Avisos se houver problemas

2. **Fallback para popup bloqueado**: 
   - Se o navegador bloquear o popup, o código tenta abrir usando um link clicável
   - Mensagem de aviso no console se o popup for bloqueado

3. **Melhor tratamento de erros**:
   - Se a URL do WhatsApp não for retornada, mostra mensagem apropriada
   - Logs detalhados de todos os erros

---

## 🧪 Como Testar

### Teste Local (Desenvolvimento)

1. **Inicie o servidor**:
```bash
cd /root
npm run dev
```

2. **Abra o navegador**:
```
http://localhost:3000
```

3. **Abra o Console do Navegador** (F12 ou Ctrl+Shift+I)

4. **Preencha o formulário** e clique em "Enviar Solicitação"

5. **Verifique os logs**:

**No Console do Navegador**, você deve ver:
```
📝 Enviando formulário: {nome: "...", telefone: "...", ...}
✅ Resposta da API: {status: "success", lead_id: 1, whatsapp_url: "..."}
📱 Abrindo WhatsApp: https://wa.me/5511992891070?text=...
```

**No Terminal do Servidor**, você deve ver:
```
📥 Recebendo lead (Service Layer): {...}
✅ Lead criado com sucesso: {id: 1, name: "..."}
[LeadService] Gerando PDF para Lead #1...
[LeadService] Enviando email para Lead #1...
[Email] Enviado para cortinasbras@gmail.com. ID: <message-id>
📱 URL do WhatsApp gerada: https://wa.me/5511992891070?text=...
```

---

## ⚠️ Possíveis Problemas e Soluções

### Problema 1: Email não está sendo enviado

**Sintomas**:
```
⚠️ Avisos de E-mail: Credenciais SMTP não configuradas. Usando conta de teste Ethereal.
```

**Solução**: Configure as variáveis de email no `.env` (veja seção acima)

---

### Problema 2: WhatsApp não abre

**Sintomas**:
```
⚠️ Popup bloqueado. Criando link alternativo.
```

**Solução**: 
- Isso é normal! O código já tenta um fallback automático
- Permita popups no navegador para o site
- O WhatsApp deve abrir mesmo assim usando o fallback

---

### Problema 3: Erro ao criar lead

**Sintomas**:
```
❌ EXCEÇÃO NA API DE LEADS: Error: ...
```

**Possíveis causas**:
1. Banco de dados não está acessível
2. Erro no Prisma schema
3. Campos obrigatórios faltando

**Solução**: Verifique os logs completos no terminal para identificar o erro específico

---

## 📊 Checklist de Verificação

- [ ] Variáveis de email configuradas no `.env`
- [ ] Servidor reiniciado após configurar `.env`
- [ ] Console do navegador aberto durante teste
- [ ] Terminal do servidor visível durante teste
- [ ] Formulário preenchido com dados válidos
- [ ] WhatsApp abre após envio
- [ ] Email recebido em `cortinasbras@gmail.com`

---

## 🔍 Logs Importantes

### Sucesso Completo:
```
📝 Enviando formulário
✅ Resposta da API
📊 Disparando conversão Google Ads
📱 Abrindo WhatsApp
[LeadService] Gerando PDF
[LeadService] Enviando email
[Email] Enviado para cortinasbras@gmail.com
```

### Falha no Email (mas lead criado):
```
✅ Lead criado com sucesso
[LeadService] Falha no envio de email: Error: Invalid login
```
→ **Solução**: Verifique credenciais de email

### Falha Completa:
```
❌ EXCEÇÃO NA API DE LEADS
❌ Erro ao enviar formulário
```
→ **Solução**: Verifique stack trace completo no terminal

---

## 📞 Próximos Passos

1. **Configure o email** no arquivo `.env`
2. **Reinicie o servidor**
3. **Teste o formulário** com o console aberto
4. **Verifique** se o email chegou
5. **Verifique** se o WhatsApp abriu

Se ainda houver problemas, compartilhe os logs do console e do terminal para análise mais detalhada.
