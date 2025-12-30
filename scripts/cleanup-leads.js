const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL não encontrada.");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    console.log("Iniciando limpeza de leads de teste...");
    try {
        // Apaga leads que parecem testes explicitamente
        const resTest = await pool.query(`
            DELETE FROM leads 
            WHERE nome ILIKE '%Teste%' 
               OR nome ILIKE '%Test%' 
               OR nome ILIKE '%Debug%'
               OR email ILIKE '%example%'
               OR email ILIKE '%teste%'
               OR observacoes ILIKE '%teste%'
        `);
        console.log(`🗑️ Removidos ${resTest.rowCount} leads com padrão 'Teste/Debug'.`);

        // Opção: Apagar leads sem nome ou telefone válido criados recentemente (fruto de testes anteriores)
        const resEmpty = await pool.query(`
            DELETE FROM leads 
            WHERE (nome = 'Sem Nome' OR telefone = '0000000000' OR telefone = 'Sem Telefone')
            AND criado_em >= CURRENT_DATE
        `);
        console.log(`🗑️ Removidos ${resEmpty.rowCount} leads inválidos/vazios de hoje.`);

    } catch (e) {
        console.error("Erro ao limpar:", e);
    } finally {
        await pool.end();
    }
}
run();
