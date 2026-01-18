#!/bin/bash

echo "🔍 Verificando se a tag do Google está no site..."
echo ""

# Baixar a página
PAGE_CONTENT=$(curl -s https://cortinasbras.com.br)

# Verificar se a nova tag está presente
if echo "$PAGE_CONTENT" | grep -q "AW-379796222"; then
    echo "✅ TAG ENCONTRADA! A tag AW-379796222 está ativa no site!"
    echo ""
    echo "📊 Detalhes:"
    echo "$PAGE_CONTENT" | grep -A 5 "AW-379796222"
else
    echo "❌ Tag ainda não encontrada no site."
    echo "⏳ O deploy pode ainda estar em andamento."
    echo ""
    echo "💡 Dica: Aguarde mais alguns minutos e execute este script novamente:"
    echo "   bash /root/check-google-tag.sh"
fi

echo ""
echo "🌐 Status do site:"
curl -I https://cortinasbras.com.br 2>&1 | head -5
