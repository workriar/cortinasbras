import { NextResponse } from 'next/server';
import { getDb } from '@/services/db';

export async function GET() {
    try {
        const db = await getDb();
        const statsQuery = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'novo' THEN 1 ELSE 0 END) as new,
                SUM(CASE WHEN status = 'em_contato' OR status = 'CONTACTED' THEN 1 ELSE 0 END) as contacted,
                SUM(CASE WHEN status = 'proposta' OR status = 'PROPOSAL' THEN 1 ELSE 0 END) as proposal,
                SUM(CASE WHEN status = 'fechado' OR status = 'CLOSED_WON' THEN 1 ELSE 0 END) as won,
                SUM(CASE WHEN status = 'perdido' OR status = 'CLOSED_LOST' THEN 1 ELSE 0 END) as lost
            FROM leads
        `;

        const row = await db.get(statsQuery);

        return NextResponse.json({
            total: parseInt(row?.total || '0'),
            new: parseInt(row?.new || '0'),
            contacted: parseInt(row.contacted || '0'),
            proposal: parseInt(row.proposal || '0'),
            won: parseInt(row.won || '0'),
            lost: parseInt(row.lost || '0'),
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return NextResponse.json(
            { total: 0, new: 0, contacted: 0, proposal: 0, won: 0, lost: 0 },
            { status: 200 }
        );
    }
}
