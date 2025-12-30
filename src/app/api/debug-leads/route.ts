import { NextResponse } from 'next/server';
import { query } from '@/services/db-postgres'; // Usando o serviço Postgres
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Verificar se a tabela 'leads' (legada) existe
        const tables = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        const tableExists = tables.rows.some((r: any) => r.table_name === 'leads');

        if (!tableExists) {
            return NextResponse.json({
                error: "Tabela legada 'leads' não encontrada.",
                tables: tables.rows.map((r: any) => r.table_name)
            });
        }

        // 2. Análise de Status
        const statusStats = await query(`SELECT status, count(*) FROM leads GROUP BY status`);
        const statusSummary = statusStats.rows;

        // 3. Auto-Correção dos Status Nulos ou Antigos na Tabela Legada
        // Isso ajuda o fallback, mas a migração abaixo é mais importante.
        const updateResult = await query(`
            UPDATE leads 
            SET status = 'NEW' 
            WHERE status IS NULL OR status = '' OR status = 'Novo'
        `);

        // 4. Promoção Automática de Admin (Bootstrap)
        const admins = ['vendas@cortinasbras.com.br', 'loja@cortinasbras.com.br', 'admin@cortinasbras.com.br'];
        let adminPromo = { success: false, msg: "" };
        try {
            // Tenta tabela User (Prisma padrão)
            const resUser = await query(`UPDATE "User" SET role = 'ADMIN' WHERE email = ANY($1)`, [admins]);
            // Tenta tabela users (se existir)
            try { await query(`UPDATE users SET role = 'ADMIN' WHERE email = ANY($1)`, [admins]); } catch (e) { }

            adminPromo = { success: true, msg: "Tentativa de promoção de admin realizada." };
        } catch (e) {
            adminPromo = { success: false, msg: "Erro ao promover admin: " + (e as Error).message };
        }

        // 5. MIGRAÇÃO DE DADOS LEGADOS (IMPORTANTE)
        let migrationStats = { imported: 0, msg: "" };
        try {
            // Importa leads da tabela antiga 'leads' para a nova 'Lead'
            // Dedup: verifica telefone e data de criação
            const imported = await prisma.$executeRaw`
                INSERT INTO "Lead" (name, phone, city, status, source, notes, "createdAt", "updatedAt")
                SELECT 
                    nome, 
                    COALESCE(telefone, '0000000000'), 
                    COALESCE(cidade_bairro, 'Não informado'), 
                    CASE 
                        WHEN UPPER(status) LIKE '%NOVO%' THEN 'NEW'
                        WHEN UPPER(status) LIKE '%NAV%' THEN 'NEW'
                        WHEN UPPER(status) LIKE '%1%' OR UPPER(status) = '7' THEN 'NEW'
                        WHEN UPPER(status) LIKE '%CONTAT%' THEN 'CONTACTED'
                        WHEN UPPER(status) LIKE '%PROPOST%' OR UPPER(status) LIKE '%ORCAMENTO%' THEN 'PROPOSAL'
                        WHEN UPPER(status) LIKE '%FECHAD%' OR UPPER(status) LIKE '%VEND%' THEN 'CLOSED_WON'
                        WHEN UPPER(status) LIKE '%PERDID%' OR UPPER(status) LIKE '%ARQUIV%' THEN 'CLOSED_LOST'
                        ELSE 'NEW'
                    END,
                    COALESCE(origem, 'SITE'),
                    observacoes,
                    criado_em,
                    criado_em
                FROM leads l
                WHERE NOT EXISTS (
                    SELECT 1 FROM "Lead" new 
                    WHERE new.phone = COALESCE(l.telefone, '0000000000')
                    AND new."createdAt" = l.criado_em
                )
            `;
            migrationStats = { imported: Number(imported), msg: "Leads legados importados com sucesso." };
        } catch (migError: any) {
            console.error("Erro na migração:", migError);
            migrationStats = { imported: 0, msg: "Erro: " + migError.message };
        }

        // 6. Dados para Visualização
        const leadsSample = await query(`SELECT id, nome, status, criado_em FROM leads ORDER BY criado_em DESC LIMIT 5`);

        return NextResponse.json({
            tables: tables.rows.map((r: any) => r.table_name),
            tableLeadsExists: tableExists,
            statusDistribution: statusSummary,
            last5Leads: leadsSample.rows,
            autoCorrection: {
                executed: true,
                recordsUpdated: updateResult.rowCount,
            },
            adminPromotion: adminPromo,
            dataMigration: migrationStats, // Novo campo
            instruction: "Se 'dataMigration.imported' > 0, os leads antigos foram restaurados. Recarregue o CRM."
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
