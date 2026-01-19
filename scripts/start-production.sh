#!/bin/sh
# scripts/start-production.sh

echo "🚀 Iniciando Cortinas Brás em Produção..."

# Garantir que o diretório de dados existe
mkdir -p /app/data

# Configurar banco de dados inicial
DB_FILE="/app/data/leads.db"
SEED_FILE="/app/leads.db.seed"

if [ ! -f "$DB_FILE" ]; then
    echo "📦 Banco de dados não encontrado em $DB_FILE"
    if [ -f "$SEED_FILE" ]; then
        echo "📥 Restaurando banco de dados original (seed)..."
        cp "$SEED_FILE" "$DB_FILE"
        echo "✅ Banco de dados restaurado com sucesso!"
    else
        echo "⚠️  Arquivo de seed não encontrado. Um novo banco vazio será criado pelo Prisma."
    fi
else
    echo "Example: ✅ Banco de dados existente encontrado. Mantendo dados atuais."
fi

# Ajustar permissões (garantir que o usuário nextjs possa escrever)
chown -R nextjs:nodejs /app/data

# Iniciar aplicação
echo "⚡ Iniciando servidor Next.js..."
exec node server.js
