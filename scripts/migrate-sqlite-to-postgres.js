/**
 * Script de Migração: SQLite → PostgreSQL
 * 
 * Este script migra todos os leads do SQLite para PostgreSQL
 * 
 * Uso:
 *   node scripts/migrate-sqlite-to-postgres.js
 */

const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Configurações
const SQLITE_PATH = './leads.db';
const POSTGRES_URL = process.env.DATABASE_URL_POSTGRES || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
    console.error('❌ DATABASE_URL_POSTGRES não configurado no .env.local');
    console.log('Adicione: DATABASE_URL_POSTGRES=postgresql://user:pass@host:5432/db');
    process.exit(1);
}

async function migrate() {
    console.log('🚀 Iniciando migração SQLite → PostgreSQL\n');

    // Conectar ao SQLite
    const sqliteDb = new sqlite3.Database(SQLITE_PATH, (err) => {
        if (err) {
            console.error('❌ Erro ao conectar SQLite:', err);
            process.exit(1);
        }
        console.log('✅ SQLite conectado');
    });

    // Conectar ao PostgreSQL
    const pgPool = new Pool({
        connectionString: POSTGRES_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    try {
        await pgPool.query('SELECT 1');
        console.log('✅ PostgreSQL conectado\n');
    } catch (err) {
        console.error('❌ Erro ao conectar PostgreSQL:', err);
        process.exit(1);
    }

    // Buscar leads do SQLite
    console.log('📊 Buscando leads do SQLite...');

    const leads = await new Promise((resolve, reject) => {
        sqliteDb.all('SELECT * FROM leads', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    console.log(`📦 Encontrados ${leads.length} leads\n`);

    if (leads.length === 0) {
        console.log('⚠️  Nenhum lead para migrar');
        sqliteDb.close();
        await pgPool.end();
        return;
    }

    // Migrar cada lead
    let migrated = 0;
    let errors = 0;

    console.log('🔄 Migrando leads...\n');

    for (const lead of leads) {
        try {
            await pgPool.query(
                `INSERT INTO leads (
          nome, telefone, cidade_bairro, largura_parede, altura_parede, 
          tecido, instalacao, observacoes, criado_em, status, origem
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING`,
                [
                    lead.nome,
                    lead.telefone,
                    lead.cidade_bairro || null,
                    lead.largura_parede || null,
                    lead.altura_parede || null,
                    lead.tecido,
                    lead.instalacao,
                    lead.observacoes,
                    lead.criado_em || new Date().toISOString(),
                    'novo',
                    'site'
                ]
            );
            migrated++;
            process.stdout.write(`✅ Migrado: ${migrated}/${leads.length}\r`);
        } catch (err) {
            errors++;
            console.error(`\n❌ Erro ao migrar lead #${lead.id}:`, err.message);
        }
    }

    console.log('\n');
    console.log('═══════════════════════════════════════');
    console.log('📊 RESUMO DA MIGRAÇÃO');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Migrados com sucesso: ${migrated}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📦 Total: ${leads.length}`);
    console.log('═══════════════════════════════════════\n');

    // Verificar dados no PostgreSQL
    const result = await pgPool.query('SELECT COUNT(*) FROM leads');
    console.log(`🎯 Total de leads no PostgreSQL: ${result.rows[0].count}\n`);

    // Fechar conexões
    sqliteDb.close();
    await pgPool.end();

    console.log('✅ Migração concluída!\n');
}

// Executar migração
migrate().catch((err) => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
