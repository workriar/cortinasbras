import { NextResponse } from 'next/server';
import { generatePdf } from '@/services/pdf';
import { fabrics } from '@/lib/fabrics';
// Note: If products/enxovais were in a lib file, I'd import them here.
// Since they are currently hardcoded in components, I'll define a representative set or implement a way to get them.

export async function GET() {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap');

            body {
                font-family: 'Inter', sans-serif;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
                background-color: #fff;
            }
            .page {
                padding: 60px;
                page-break-after: always;
                position: relative;
            }
            .header {
                text-align: center;
                margin-bottom: 60px;
            }
            .logo {
                width: 180px;
                margin-bottom: 20px;
            }
            .title {
                font-family: 'Playfair Display', serif;
                color: #D4A93E;
                font-size: 42px;
                font-weight: bold;
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 4px;
            }
            .subtitle {
                font-family: 'Inter', sans-serif;
                color: #8B5C2A;
                font-size: 16px;
                margin-top: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .section-title {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                color: #1a1a1a;
                border-bottom: 2px solid #D4A93E;
                padding-bottom: 10px;
                margin-bottom: 30px;
                text-align: center;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
            }
            .card {
                border: 1px solid #eee;
                padding: 20px;
                border-radius: 15px;
                page-break-inside: avoid;
            }
            .card-title {
                font-family: 'Playfair Display', serif;
                font-size: 18px;
                font-weight: bold;
                color: #D4A93E;
                margin-bottom: 10px;
            }
            .card-desc {
                font-size: 13px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 15px;
            }
            .benefits-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .benefit-item {
                font-size: 12px;
                color: #8B5C2A;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
            }
            .benefit-item::before {
                content: '✓';
                margin-right: 8px;
                font-weight: bold;
            }
            .footer {
                position: absolute;
                bottom: 40px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 11px;
                color: #999;
            }
            .footer-brand {
                color: #D4A93E;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <!-- Page 1: Cover -->
        <div class="page" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 100vh;">
            <img src="https://cortinasbras.com.br/static/logo.png" class="logo" alt="Cortinas Brás" />
            <h1 class="title">Catálogo Exclusivo</h1>
            <p class="subtitle">A Arte da Alta Costura em Cortinas</p>
            <div style="margin-top: 100px; border-top: 1px solid #D4A93E; width: 100px; padding-top: 20px;">
                <p style="font-size: 14px; color: #8B5C2A; font-weight: 600;">São Paulo | 2026</p>
            </div>
        </div>

        <!-- Page 2: Products -->
        <div class="page">
            <h2 class="section-title">Nossas Soluções</h2>
            <div class="grid">
                <div class="card">
                    <div class="card-title">Cortinas Prontas</div>
                    <p class="card-desc">Modelos selecionados com dimensões padrão, unindo agilidade e a qualidade inquestionável de nossa fábrica. Elegância imediata para seu ambiente.</p>
                    <ul class="benefits-list">
                        <li class="benefit-item">Entrega imediata</li>
                        <li class="benefit-item">Curadoria de cores</li>
                        <li class="benefit-item">Tamanhos padrão</li>
                    </ul>
                </div>
                <div class="card">
                    <div class="card-title">Cortinas Sob Medida</div>
                    <p class="card-desc">Nossa obra-prima. Projetos milimetricamente planejados para cada janela, utilizando os tecidos mais nobres do mundo.</p>
                    <ul class="benefits-list">
                        <li class="benefit-item">Projetos Exclusivos</li>
                        <li class="benefit-item">Tecidos Premium</li>
                        <li class="benefit-item">Instalação Especializada</li>
                    </ul>
                </div>
                <div class="card">
                    <div class="card-title">Cama • Mesa • Banho</div>
                    <p class="card-desc">Enxovais de luxo que elevam a experiência do lar. Algodão egípcio e tramas nobres para máximo conforto e sofisticação.</p>
                    <ul class="benefits-list">
                        <li class="benefit-item">Fios Egípcios</li>
                        <li class="benefit-item">Toque de Seda</li>
                        <li class="benefit-item">Acabamento Nobre</li>
                    </ul>
                </div>
            </div>
            <div class="footer">
                CORTINAS BRÁS • www.cortinasbras.com.br <span class="footer-brand"> | Luxo e Sofisticação</span>
            </div>
        </div>

        <!-- Pages: Fabrics -->
        <div class="page">
            <h2 class="section-title">Curadoria de Tecidos Premium</h2>
            <div class="grid">
                ${fabrics.map(f => `
                    <div class="card">
                        <div class="card-title">${f.name}</div>
                        <p class="card-desc">${f.description}</p>
                        <div style="margin-bottom: 10px;">
                            <span style="font-size: 10px; font-weight: bold; color: #aaa; text-transform: uppercase;">Cores:</span>
                            <span style="font-size: 11px; color: #444;">${f.colors.join(', ')}</span>
                        </div>
                        <ul class="benefits-list">
                            ${f.benefits.map(b => `<li class="benefit-item">${b}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            <div class="footer">
                CORTINAS BRÁS • www.cortinasbras.com.br <span class="footer-brand"> | Luxo e Sofisticação</span>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const pdfBuffer = await generatePdf(html);
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="catalogo-cortinas-bras.pdf"',
            },
        });
    } catch (error) {
        console.error('Error generating catalog PDF:', error);
        return new NextResponse('Error generating PDF', { status: 500 });
    }
}
