import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generatePdf } from '@/services/pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const idsParam = url.searchParams.get('ids');
        
        let fabricsToPdf: any[] = [];

        if (idsParam) {
            // Filtrar tecidos específicos por IDs selecionados
            const ids = idsParam.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
            
            if (ids.length > 0) {
                try {
                    const dbFabrics = await prisma.fabric.findMany({
                        where: { id: { in: ids } },
                        orderBy: { category: 'asc' }
                    });
                    fabricsToPdf = dbFabrics;
                } catch (e) {
                    console.warn("[PDF API] Prisma query failed, using static fallback for filtered IDs:", e);
                }

                // Se o banco estiver vazio ou falhar, buscamos do fallback local
                if (fabricsToPdf.length === 0) {
                    const { fabrics: localFabrics } = await import('@/lib/fabrics');
                    // Tenta fazer o match dos IDs locais (pode ser string ou número)
                    fabricsToPdf = localFabrics.filter(f => 
                        ids.includes(Number(f.id)) || 
                        ids.some(id => String(f.id).includes(String(id)))
                    );
                }
            }
        }

        // Se nenhum ID específico foi filtrado ou a busca resultou vazia, geramos de todos
        if (fabricsToPdf.length === 0) {
            try {
                const dbFabrics = await prisma.fabric.findMany({
                    orderBy: { category: 'asc' }
                });
                fabricsToPdf = dbFabrics;
            } catch (e) {
                console.warn("[PDF API] Prisma query failed, using all static fallback:", e);
            }

            if (fabricsToPdf.length === 0) {
                const { fabrics: localFabrics } = await import('@/lib/fabrics');
                fabricsToPdf = localFabrics;
            }
        }

        // Mapear e formatar tecidos de acordo com a assinatura do generatePdf do PDFKit
        const formattedFabrics = fabricsToPdf.map((fabric: any) => {
            let colorsArray: string[] = [];
            let benefitsArray: string[] = [];

            // Se for string do banco, quebra pela vírgula; se já for array do localFabrics, usa direto
            if (typeof fabric.colors === 'string') {
                colorsArray = fabric.colors.split(',').map((c: string) => c.trim()).filter(Boolean);
            } else if (Array.isArray(fabric.colors)) {
                colorsArray = fabric.colors;
            }

            if (typeof fabric.benefits === 'string') {
                benefitsArray = fabric.benefits.split(',').map((b: string) => b.trim()).filter(Boolean);
            } else if (Array.isArray(fabric.benefits)) {
                benefitsArray = fabric.benefits;
            }

            return {
                name: fabric.name,
                description: fabric.description,
                colors: colorsArray.length > 0 ? colorsArray : ['Várias Cores'],
                benefits: benefitsArray.length > 0 ? benefitsArray : ['Alta Qualidade'],
                exclusive: fabric.exclusive || false,
                placeholderImage: fabric.placeholderImage || ""
            };
        });

        console.log(`[PDF API] Gerando PDF nativo com PDFKit para ${formattedFabrics.length} tecidos.`);
        const pdfBuffer = await generatePdf(formattedFabrics);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="catalogo-exclusivo-cortinas-bras.pdf"',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[/api/catalog] Erro fatal ao gerar PDF nativo:', message);
        return NextResponse.json(
            { error: 'Falha crítica ao gerar o catálogo PDF nativo.', detail: message },
            { status: 500 }
        );
    }
}
