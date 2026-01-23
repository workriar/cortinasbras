import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const stats = await prisma.lead.groupBy({
            by: ['status'],
            _count: {
                _all: true,
            },
        });

        const total = await prisma.lead.count();

        let newLeads = 0;
        let contacted = 0;
        let proposal = 0;
        let won = 0;
        let lost = 0;

        stats.forEach((group) => {
            const status = group.status?.toUpperCase() || '';
            const count = group._count._all;

            if (status === 'NOVO' || status === 'NEW' || status === '1') {
                newLeads += count;
            } else if (status === 'EM_CONTATO' || status === 'CONTACTED') {
                contacted += count;
            } else if (status === 'PROPOSTA' || status === 'PROPOSAL') {
                proposal += count;
            } else if (status === 'FECHADO' || status === 'CLOSED_WON') {
                won += count;
            } else if (status === 'PERDIDO' || status === 'CLOSED_LOST') {
                lost += count;
            }
        });

        return NextResponse.json({
            total,
            new: newLeads,
            contacted,
            proposal,
            won,
            lost,
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return NextResponse.json(
            { total: 0, new: 0, contacted: 0, proposal: 0, won: 0, lost: 0 },
            { status: 200 }
        );
    }
}
