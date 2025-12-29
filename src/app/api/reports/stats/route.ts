import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [total, newLeads, contacted, proposal, won, lost] = await Promise.all([
            prisma.lead.count(),
            prisma.lead.count({ where: { status: 'NEW' } }),
            prisma.lead.count({ where: { status: 'CONTACTED' } }),
            prisma.lead.count({ where: { status: 'PROPOSAL' } }),
            prisma.lead.count({ where: { status: 'CLOSED_WON' } }),
            prisma.lead.count({ where: { status: 'CLOSED_LOST' } }),
        ]);

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
