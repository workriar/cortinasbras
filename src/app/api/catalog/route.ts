import { NextResponse } from 'next/server';
import { generatePdf } from '@/services/pdf';
import { fabrics } from '@/lib/fabrics';

export async function GET() {
    try {
        const pdfBuffer = await generatePdf(
            fabrics.map(f => ({
                name: f.name,
                description: f.description,
                colors: f.colors,
                benefits: f.benefits,
                exclusive: f.exclusive,
            }))
        );

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="catalogo-cortinas-bras.pdf"',
            },
        });
    } catch (error) {
        console.error('Erro ao gerar catálogo PDF:', error);
        return new NextResponse('Erro ao gerar PDF', { status: 500 });
    }
}
