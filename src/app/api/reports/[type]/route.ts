import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const { type } = await params;

        if (type === 'status') {
            const stats = await prisma.lead.groupBy({
                by: ['status'],
                _count: {
                    _all: true,
                },
            });

            const data = stats.map((item) => {
                const nameUC = item.status?.toUpperCase() || '';
                let label = 'Desconhecido';

                if (nameUC === 'NOVO' || nameUC === 'NEW') label = 'Novo';
                else if (nameUC === 'EM_CONTATO' || nameUC === 'CONTACTED') label = 'Em Contato';
                else if (nameUC === 'PROPOSTA' || nameUC === 'PROPOSAL') label = 'Proposta';
                else if (nameUC === 'FECHADO' || nameUC === 'CLOSED_WON') label = 'Fechado';
                else if (nameUC === 'PERDIDO' || nameUC === 'CLOSED_LOST') label = 'Perdido';
                else label = item.status;

                return {
                    name: label,
                    value: item._count._all,
                };
            });

            return NextResponse.json({ data });
        }

        if (type === 'source') {
            const sources = await prisma.lead.groupBy({
                by: ['source'],
                _count: {
                    _all: true,
                },
            });

            const data = sources.map((item) => {
                const nameUC = item.source?.toUpperCase() || '';
                let label = 'Manual';

                if (nameUC === 'SITE') label = 'Site';
                else if (nameUC === 'WHATSAPP') label = 'WhatsApp';
                else if (nameUC === 'ADVERTISEMENT') label = 'Anúncio';
                else label = item.source;

                return {
                    name: label,
                    value: item._count._all,
                };
            });

            return NextResponse.json({ data });
        }

        if (type === 'weekly') {
            // Using raw query for SQLite date functions as Prisma doesn't support complex date grouping natively across all DBs easily
            const result: any[] = await prisma.$queryRaw`
                SELECT DATE(criado_em) as name, COUNT(*) as value 
                FROM leads 
                WHERE criado_em >= date('now', '-7 days')
                GROUP BY DATE(criado_em)
                ORDER BY name ASC
            `;

            const data = result.map((row: any) => ({
                // row.name and row.value might be BigInt or string depending on driver version, safe parsing
                name: new Date(row.name).toLocaleDateString('pt-BR'),
                value: Number(row.value)
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
