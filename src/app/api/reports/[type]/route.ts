import { NextResponse } from 'next/server';
import { query } from '@/services/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const { type } = await params;

        if (type === 'status') {
            const result = await query(`
                SELECT status as name, COUNT(*) as value 
                FROM leads 
                GROUP BY status
            `);

            const data = result.rows.map((item: any) => ({
                name: item.name === 'novo' || item.name === 'NEW' ? 'Novo' :
                    item.name === 'em_contato' || item.name === 'CONTACTED' ? 'Em Contato' :
                        item.name === 'proposta' || item.name === 'PROPOSAL' ? 'Proposta' :
                            item.name === 'fechado' || item.name === 'CLOSED_WON' ? 'Fechado' : 'Perdido',
                value: parseInt(item.value),
            }));

            return NextResponse.json({ data });
        }

        if (type === 'source') {
            const result = await query(`
                SELECT origem as name, COUNT(*) as value 
                FROM leads 
                GROUP BY origem
            `);

            const data = result.rows.map((item: any) => ({
                name: item.name === 'site' || item.name === 'SITE' ? 'Site' :
                    item.name === 'WHATSAPP' ? 'WhatsApp' :
                        item.name === 'ADVERTISEMENT' ? 'Anúncio' : 'Manual',
                value: parseInt(item.value),
            }));

            return NextResponse.json({ data });
        }

        if (type === 'weekly') {
            const result = await query(`
                SELECT DATE(criado_em) as name, COUNT(*) as value 
                FROM leads 
                WHERE criado_em >= CURRENT_DATE - INTERVAL '7 days'
                GROUP BY DATE(criado_em)
                ORDER BY name ASC
            `);

            const data = result.rows.map((row: any) => ({
                name: new Date(row.name).toLocaleDateString('pt-BR'),
                value: parseInt(row.value)
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
