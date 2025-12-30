import { NextResponse } from 'next/server';
import { query } from '@/services/db';

export async function GET() {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'novo') as new,
                COUNT(*) FILTER (WHERE status = 'em_contato' OR status = 'CONTACTED') as contacted,
                COUNT(*) FILTER (WHERE status = 'proposta' OR status = 'PROPOSAL') as proposal,
                COUNT(*) FILTER (WHERE status = 'fechado' OR status = 'CLOSED_WON') as won,
                COUNT(*) FILTER (WHERE status = 'perdido' OR status = 'CLOSED_LOST') as lost
            FROM leads
        `;

        const result = await query(statsQuery);
        const row = result.rows[0];

        return NextResponse.json({
            total: parseInt(row.total || '0'),
            new: parseInt(row.new || '0'),
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
