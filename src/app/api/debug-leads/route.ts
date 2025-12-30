import { NextResponse } from 'next/server';
import { query } from '@/services/db-postgres';

export async function GET() {
    try {
        // 1. Diagnóstico das tabelas existentes
        const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `, []);

        // 2. Verificar distribuição de status na tabela legado 'leads'
        let statusSummary = [];
        let leadsSample = [];
        let tableExists = false;

        try {
            const statusRes = await query(`SELECT status, count(*) FROM leads GROUP BY status`, []);
            statusSummary = statusRes.rows;
            tableExists = true;

            const sampleRes = await query(`SELECT id, nome, status, criado_em FROM leads ORDER BY criado_em DESC LIMIT 5`, []);
            leadsSample = sampleRes.rows;

        } catch (e) {
            statusSummary = [{ error: "Tabela 'leads' (legada) não encontrada ou erro de acesso" }];
        }

        // 3. TENTATIVA DE CORREÇÃO AUTOMÁTICA DE STATUS
        // O Kanban espera: 'NEW', 'CONTACTED', 'PROPOSAL', 'CLOSED_WON', 'CLOSED_LOST'
        // Se estiver NULL, '', ou português 'Novo', convertemos para 'NEW'.

        let updateResult = { rowCount: 0 };
        if (tableExists) {
            try {
                updateResult = await query(`
                UPDATE leads 
                SET status = 'NEW' 
                WHERE status IS NULL 
                   OR status = '' 
                   OR status ILIKE 'Novo' 
                   OR status ILIKE 'Pendente'
            `, []);
            } catch (e) { console.error("Erro no update:", e) }
        }

        return NextResponse.json({
            tables: tables.rows.map((r: any) => r.table_name),
            tableLeadsExists: tableExists,
            statusDistribution: statusSummary,
            last5Leads: leadsSample,
            autoCorrection: {
                executed: true,
                recordsUpdated: updateResult.rowCount,
                explanation: "Status nulos ou 'Novo' foram convertidos para 'NEW' para aparecerem no Kanban."
            },
            instruction: "Se recordsUpdated > 0, recarregue o CRM. Seus leads devem aparecer."
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
