import { NextResponse } from 'next/server';
import { generatePdf } from '@/services/pdf';
import { fabrics } from '@/lib/fabrics';

// PDFKit é CommonJS puro e usa APIs Node.js (Buffer, stream, fs).
// Esta rota DEVE rodar no Node.js runtime — Edge Runtime não suporta PDFKit.
export const runtime = 'nodejs';

// Sem cache: o PDF é gerado dinamicamente a cada requisição
export const dynamic = 'force-dynamic';

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
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="catalogo-cortinas-bras.pdf"',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[/api/catalog] Erro ao gerar PDF:', message);
        return NextResponse.json(
            { error: 'Falha ao gerar o catálogo PDF.', detail: message },
            { status: 500 }
        );
    }
}
