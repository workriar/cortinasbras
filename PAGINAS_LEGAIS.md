# Páginas Legais - Política de Privacidade e Termos de Uso

## ✅ Páginas Criadas

### 1. Política de Privacidade
**URL:** https://cortinasbras.com.br/politica-de-privacidade  
**Arquivo:** `src/app/politica-de-privacidade/page.tsx`

#### Conteúdo Incluído:
- ✅ Introdução e compromisso com a LGPD
- ✅ Informações coletadas (dados pessoais e de navegação)
- ✅ Como utilizamos as informações
- ✅ Base legal para tratamento de dados (LGPD)
- ✅ Compartilhamento de informações
- ✅ Armazenamento e segurança dos dados
- ✅ Cookies e tecnologias similares
- ✅ Direitos do titular dos dados (LGPD)
- ✅ Links para sites de terceiros
- ✅ Proteção de menores de idade
- ✅ Alterações na política
- ✅ Informações de contato
- ✅ Encarregado de Dados (DPO)

### 2. Termos de Uso
**URL:** https://cortinasbras.com.br/termos-de-uso  
**Arquivo:** `src/app/termos-de-uso/page.tsx`

#### Conteúdo Incluído:
- ✅ Aceitação dos termos
- ✅ Informações da empresa
- ✅ Uso do site (permitido e proibido)
- ✅ Solicitação de orçamentos
- ✅ Produtos e serviços
- ✅ Propriedade intelectual
- ✅ Privacidade e proteção de dados
- ✅ Links para sites de terceiros
- ✅ Isenção de garantias
- ✅ Limitação de responsabilidade
- ✅ Indenização
- ✅ Modificações do site e dos termos
- ✅ Rescisão
- ✅ Lei aplicável e jurisdição
- ✅ Disposições gerais
- ✅ Atendimento ao cliente
- ✅ Código de Defesa do Consumidor

## 🎨 Design e UX

Ambas as páginas foram criadas com:
- ✅ Design moderno e profissional
- ✅ Responsivo (mobile-first)
- ✅ Tipografia clara e legível
- ✅ Estrutura hierárquica bem definida
- ✅ Destaques visuais para informações importantes
- ✅ Boxes coloridos para alertas e notas importantes
- ✅ Metadados SEO otimizados

## 🔗 Integração

### Footer
Os links já estão integrados no componente `Footer.tsx`:
```tsx
<Link href="/politica-de-privacidade" className="hover:text-white">Privacidade</Link>
<Link href="/termos-de-uso" className="hover:text-white">Termos</Link>
```

### Formulários
Recomenda-se adicionar links para estas páginas em:
- Formulário de contato/orçamento
- Checkbox de aceitação de termos (se houver)

## ✅ Conformidade Legal

### LGPD (Lei Geral de Proteção de Dados)
- ✅ Política de Privacidade em conformidade com a LGPD
- ✅ Direitos dos titulares claramente descritos
- ✅ Base legal para tratamento de dados especificada
- ✅ Informações sobre DPO (Encarregado de Dados)
- ✅ Procedimentos para exercício de direitos

### Código de Defesa do Consumidor
- ✅ Menção ao CDC nos Termos de Uso
- ✅ Direitos do consumidor preservados
- ✅ Informações claras sobre produtos e serviços

### Propriedade Intelectual
- ✅ Proteção de direitos autorais
- ✅ Proteção de marcas registradas
- ✅ Licença de uso definida

## 📋 Checklist de Implementação

- [x] Criar página de Política de Privacidade
- [x] Criar página de Termos de Uso
- [x] Integrar links no Footer
- [x] Adicionar metadados SEO
- [x] Testar build do projeto
- [ ] Adicionar links nos formulários (recomendado)
- [ ] Revisar conteúdo com advogado (recomendado)
- [ ] Fazer deploy em produção

## 🚀 Próximos Passos

1. **Revisão Jurídica** (Recomendado)
   - Enviar o conteúdo para revisão de um advogado especializado em direito digital
   - Ajustar conforme necessário

2. **Integração em Formulários**
   - Adicionar checkbox de aceitação nos formulários
   - Exemplo: "Li e aceito a [Política de Privacidade](/politica-de-privacidade) e os [Termos de Uso](/termos-de-uso)"

3. **Cookie Banner** (Opcional mas Recomendado)
   - Implementar banner de consentimento de cookies
   - Integrar com a Política de Privacidade

4. **Deploy**
   - Fazer commit das alterações
   - Push para o repositório
   - Deploy em produção

## 📝 Informações de Contato Utilizadas

As seguintes informações foram utilizadas nas páginas:

- **Endereço:** Rua Piratininga, 239 - Brás, São Paulo - SP, CEP 03042-001
- **E-mail:** loja@cortinasbras.com.br
- **WhatsApp:** (11) 2081-1010
- **Horário:** Segunda a Sexta, das 9h às 18h | Sábado, das 9h às 13h

> **Nota:** Se alguma dessas informações estiver incorreta, atualize nos arquivos:
> - `src/app/politica-de-privacidade/page.tsx`
> - `src/app/termos-de-uso/page.tsx`

## 🔄 Manutenção

### Quando Atualizar:
- Mudanças na forma de coleta de dados
- Novos serviços ou funcionalidades
- Alterações na legislação
- Mudança de endereço ou contato
- Implementação de novos cookies ou tecnologias de rastreamento

### Como Atualizar:
1. Editar os arquivos `.tsx` correspondentes
2. Atualizar a data no topo da página
3. Testar com `npm run build`
4. Fazer deploy

---

**Data de Criação:** 24 de dezembro de 2024  
**Status:** ✅ Concluído e testado
