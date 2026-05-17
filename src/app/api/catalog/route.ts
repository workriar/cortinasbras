import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const protocol = req.headers.get('x-forwarded-proto') || url.protocol;
        const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || url.host;
        const targetUrl = `${protocol.replace(':', '')}://${host}/catalogo/print`;

        console.log(`[PDF Generator] Gerando catálogo a partir de: ${targetUrl}`);

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            // Emula media type print para garantir que estilos @media print sejam ativados
            await page.emulateMediaType('print');
            
            // Aguarda networkidle0 para garantir o carregamento completo de imagens e fontes
            await page.goto(targetUrl, { waitUntil: 'networkidle0' });

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0mm',
                    right: '0mm',
                    bottom: '0mm',
                    left: '0mm',
                },
            });

            return new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="catalogo-exclusivo-cortinas-bras.pdf"',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            });
        } finally {
            await browser.close();
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[/api/catalog] Erro ao gerar PDF:', message);
        return NextResponse.json(
            { error: 'Falha ao gerar o catálogo PDF premium.', detail: message },
            { status: 500 }
        );
    }
}
