import { NextResponse } from 'next/server';
import { query } from '@/services/db-postgres';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Diagnóstico Inicial
        const tables = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        // 2. CORREÇÃO DE DADOS (SANITIZAÇÃO)
        const repairs = [];

        // 2.1 Telefones Nulos (Obrigatório no schema)
        const phoneFix = await query(`UPDATE leads SET telefone = '0000000000' WHERE telefone IS NULL`);
        if ((phoneFix.rowCount || 0) > 0) repairs.push(`Corrigidos ${phoneFix.rowCount} leads sem telefone.`);

        // 2.2 Status Normalization (Para Kanban)
        const statusMap = [
            { to: 'NEW', from: ['7', '1', 'Novo', 'novo', 'NOVO', 'nav', 'New'] },
            { to: 'CONTACTED', from: ['Em Contato', 'em_contato', 'contato', 'Contacted'] },
            { to: 'PROPOSAL', from: ['Proposta', 'orcamento', 'Proposal'] },
            { to: 'CLOSED_WON', from: ['Fechado', 'venda', 'ganho', 'Closed Won'] },
            { to: 'CLOSED_LOST', from: ['Perdido', 'arquivado', 'Closed Lost'] }
        ];

        let statusUpdatedCount = 0;
        for (const mapping of statusMap) {
            const res = await query(`
                UPDATE leads 
                SET status = '${mapping.to}' 
                WHERE status IN (${mapping.from.map(s => `'${s}'`).join(',')})
            `);
            statusUpdatedCount += (res.rowCount || 0);
        }

        if (statusUpdatedCount > 0) repairs.push(`Normalizados status de ${statusUpdatedCount} leads.`);

        // 2.3 Cidade Nula (Opcional no schema, mas bom limpar)
        await query(`UPDATE leads SET cidade_bairro = 'Não informado' WHERE cidade_bairro IS NULL`);

        // 3. Stats Finais
        const statusStats = await query(`SELECT status, count(*) FROM leads GROUP BY status`);

        // 4. Promoção Admin
        const admins = ['vendas@cortinasbras.com.br', 'loja@cortinasbras.com.br', 'admin@cortinasbras.com.br'];
        await query(`UPDATE "User" SET role = 'ADMIN' WHERE email = ANY($1)`, [admins]).catch(() => { });
        // Fallback for different capitalization
        await query(`UPDATE users SET role = 'ADMIN' WHERE email = ANY($1)`, [admins]).catch(() => { });

        return NextResponse.json({
            success: true,
            repairs_applied: repairs,
            status_distribution: statusStats.rows,
            message: "Dados antigos atualizados e corrigidos com sucesso. Recarregue o CRM.",
            dataMigration: {
                imported: repairs.length > 0 ? 1 : 0,
                msg: repairs.join(' ') || "Nenhuma correção necessária (dados já estão limpos)."
            }
        });

    } catch (error: any) {
        console.error("DEBUG LEADS ERROR:", error);
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
