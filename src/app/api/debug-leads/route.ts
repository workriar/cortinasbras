import { NextResponse } from 'next/server';
import { query } from '@/services/db-postgres';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');

        if (action === 'clean') {
            const resTest = await query(`
                DELETE FROM leads 
                WHERE nome ILIKE '%Teste%' 
                   OR nome ILIKE '%Test%' 
                   OR nome ILIKE '%Debug%'
                   OR email ILIKE '%teste%'
                   OR observacoes ILIKE '%teste%'
            `);
            const resEmpty = await query(`
                DELETE FROM leads 
                WHERE (nome = 'Sem Nome' OR telefone = '0000000000')
                AND criado_em >= CURRENT_DATE
            `);
            return NextResponse.json({
                success: true,
                message: `Limpeza concluída! Removidos ${resTest.rowCount} leads de teste e ${resEmpty.rowCount} leads inválidos de hoje.`
            });
        }

        const dbUrl = process.env.DATABASE_URL || "";
        const dbHost = dbUrl.split('@')[1]?.split(':')[0] || "unknown";

        const tablesInfo = [];

        // Diagnóstico: Contar registros em ambas as tabelas
        let countLegacy = 0;
        let countPrisma = 0;

        try {
            const cLeads = await query(`SELECT count(*) FROM leads`);
            countLegacy = parseInt(cLeads.rows[0].count);
            tablesInfo.push({ name: 'leads (legacy)', count: countLegacy });
        } catch (e) { tablesInfo.push({ name: 'leads (legacy)', error: 'Not Found' }); }

        try {
            const cLead = await query(`SELECT count(*) FROM "Lead"`);
            countPrisma = parseInt(cLead.rows[0].count);
            tablesInfo.push({ name: 'Lead (prisma)', count: countPrisma });
        } catch (e) { tablesInfo.push({ name: 'Lead (prisma)', error: 'Not Found' }); }

        // MIGRAÇÃO DE EMERGÊNCIA (UNIFICAÇÃO)
        // Se a tabela 'Lead' existe e tem dados, e a 'leads' também tem, devemos garantir que 'Lead' tenha TUDO.
        // Se o schema Prisma NÃO tiver @@map("leads"), ele lê de "Lead".
        // Se o schema Prisma TIVER @@map("leads"), ele lê de "leads".

        // Vamos FORÇAR a cópia de 'leads' (legacy) para 'Lead' (prisma) se 'Lead' existir.
        // E também vamos corrigir os dados na 'leads' (caso o map esteja ativo).

        const repairs = [];

        // 1. Sanitizar tabela LEGADA (leads)
        if (countLegacy >= 0) { // Executa mesmo se 0 para garantir schema
            // REPARO DE SCHEMA: Garantir que colunas existam
            try {
                await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS largura_parede DECIMAL(10,2)`);
                await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS altura_parede DECIMAL(10,2)`);
                await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS tecido VARCHAR(100)`);
                await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS instalacao VARCHAR(100)`);
                await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255)`);
                await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS origem VARCHAR(50) DEFAULT 'SITE'`);
                repairs.push("Schema da tabela 'leads' verificado e corrigido (novas colunas adicionadas).");
            } catch (e: any) {
                repairs.push(`Erro ao verificar schema: ${e.message}`);
                repairs.push(`Erro ao verificar schema: ${e.message}`);
            }

            // CORREÇÃO CRÍTICA: Sincronizar Sequence de IDs
            // Se a sequence estiver atrasada, INSERTs falham com "duplicate key value violates unique constraint"
            try {
                await query(`SELECT setval('leads_id_seq', (SELECT MAX(id) FROM leads) + 1)`);
                repairs.push("Sequência de IDs sincronizada.");
            } catch {
                // Tenta nome alternativo caso o banco tenha criado diferente
                try {
                    await query(`SELECT setval('"Lead_id_seq"', (SELECT MAX(id) FROM "Lead") + 1)`);
                } catch (e) { }
            }

            await query(`UPDATE leads SET telefone = '0000000000' WHERE telefone IS NULL`);
            await query(`UPDATE leads SET status = 'NEW' WHERE status IN ('7', '1', 'Novo', 'novo', 'NOVO', 'nav')`);
            repairs.push("Tabela legada 'leads' sanitizada.");
        }

        // 2. Tentar importar de 'leads' para '"Lead"' (se Lead existir)
        // Isso cobre o caso onde o Prisma está lendo de 'Lead' e ignorando 'leads'.
        try {
            const copyRes = await query(`
                INSERT INTO "Lead" (name, phone, city, status, source, notes, "createdAt", "updatedAt")
                SELECT 
                    nome, 
                    COALESCE(telefone, '0000000000'), 
                    COALESCE(cidade_bairro, 'Não informado'),
                    CASE 
                         WHEN UPPER(status) IN ('NOVO','NEW','7','1') THEN 'NEW'
                         ELSE 'NEW' 
                    END,
                    COALESCE(origem, 'SITE'),
                    observacoes,
                    criado_em,
                    criado_em
                FROM leads l
                WHERE NOT EXISTS (SELECT 1 FROM "Lead" dest WHERE dest.phone = l.telefone)
            `);
            if ((copyRes.rowCount || 0) > 0) {
                repairs.push(`Copiados ${copyRes.rowCount} registros de 'leads' para 'Lead'.`);
            }
        } catch (e) {
            // Tabela "Lead" pode não existir, ok.
        }

        // 4. Promoção Admin
        const admins = ['vendas@cortinasbras.com.br', 'loja@cortinasbras.com.br', 'admin@cortinasbras.com.br'];
        await query(`UPDATE "User" SET role = 'ADMIN' WHERE email = ANY($1)`, [admins]).catch(() => { });
        await query(`UPDATE users SET role = 'ADMIN' WHERE email = ANY($1)`, [admins]).catch(() => { });

        return NextResponse.json({
            success: true,
            db_host: dbHost,
            tables_diagnostic: tablesInfo,
            repairs_applied: repairs,
            message: "Diagnóstico e reparos executados. Verifique 'tables_diagnostic' para ver onde estão seus dados."
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
