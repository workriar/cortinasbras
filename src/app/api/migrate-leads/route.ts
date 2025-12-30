import { NextResponse } from 'next/server';
import { query } from '@/services/db-postgres';

export async function GET() {
    try {
        console.log("Iniciando migração de leads antigos para nova estrutura...");

        /*
           Estratégia:
           1. Selecionar leads da tabela antiga "leads" (se existir)
           2. Inserir na tabela nova "Lead" (se não existir conflito de ID ou se quisermos preservar IDs)
           
           Vamos tentar preservar IDs se possível, senão geramos novos.
        */

        // Verificar se a tabela 'leads' existe
        try {
            await query(`SELECT 1 FROM leads LIMIT 1`, []);
        } catch (e) {
            return NextResponse.json({ message: "Tabela antiga 'leads' não encontrada. Nada para migrar." });
        }

        // Executar migração
        const migrationQuery = `
            INSERT INTO "Lead" (name, phone, city, source, status, notes, "createdAt", "updatedAt")
            SELECT 
                nome, 
                telefone, 
                cidade_bairro, 
                'SITE' as source, 
                'NEW' as status, 
                CONCAT(
                    'Medidas: ', largura_parede, 'x', altura_parede, 
                    ', Tecido: ', tecido, 
                    ', Obs: ', observacoes,
                    ', Origem Original: ', origem
                ) as notes,
                criado_em, 
                atualizado_em
            FROM leads
            WHERE NOT EXISTS (
                SELECT 1 FROM "Lead" WHERE "Lead".phone = leads.telefone -- Evitar duplicatas por telefone
            );
        `;

        const result = await query(migrationQuery, []);

        return NextResponse.json({
            success: true,
            message: "Migração concluída com sucesso.",
            migratedCount: result.rowCount
        });

    } catch (error: any) {
        console.error("Erro na migração:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
