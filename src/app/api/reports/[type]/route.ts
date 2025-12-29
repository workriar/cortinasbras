import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { type: string } }
) {
    try {
        const { type } = params;

        if (type === 'status') {
            const statusData = await prisma.lead.groupBy({
                by: ['status'],
                _count: true,
            });

            const data = statusData.map((item) => ({
                name: item.status === 'NEW' ? 'Novo' :
                    item.status === 'CONTACTED' ? 'Em Contato' :
                        item.status === 'PROPOSAL' ? 'Proposta' :
                            item.status === 'CLOSED_WON' ? 'Fechado' : 'Perdido',
                value: item._count,
            }));

            return NextResponse.json({ data });
        }

        if (type === 'source') {
            const sourceData = await prisma.lead.groupBy({
                by: ['source'],
                _count: true,
            });

            const data = sourceData.map((item) => ({
                name: item.source === 'SITE' ? 'Site' :
                    item.source === 'WHATSAPP' ? 'WhatsApp' :
                        item.source === 'ADVERTISEMENT' ? 'Anúncio' : 'Manual',
                value: item._count,
            }));

            return NextResponse.json({ data });
        }

        if (type === 'weekly') {
            // Últimos 7 dias
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const leads = await prisma.lead.findMany({
                where: {
                    createdAt: {
                        gte: sevenDaysAgo,
                    },
                },
                select: {
                    createdAt: true,
                },
            });

            // Agrupar por dia
            const grouped = leads.reduce((acc: any, lead) => {
                const date = new Date(lead.createdAt).toLocaleDateString('pt-BR');
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const data = Object.entries(grouped).map(([name, value]) => ({
                name,
                value,
            }));

            return NextResponse.json({ data });
        }

        return NextResponse.json({ data: [] });
    } catch (error) {
        console.error('Erro ao buscar relatório:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar relatório' },
            { status: 500 }
        );
    }
}
