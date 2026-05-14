import puppeteer from 'puppeteer';

export async function generatePdf(html: string): Promise<Buffer> {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            preferCSSPageSize: true
        });

        return Buffer.from(pdfBuffer);
    } finally {
        if (browser) await browser.close();
    }
}

export async function generateOrcamentoPdf(lead: any): Promise<Buffer> {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Helvetica', 'Arial', sans-serif;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
                background-color: #f8f5f1;
            }
            .page {
                padding: 40px;
                background-color: #f8f5f1;
                min-height: 100vh;
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 2px solid #D4A93E;
                padding-bottom: 20px;
            }
            .logo {
                width: 200px;
                margin-bottom: 20px;
            }
            .title {
                color: #D4A93E;
                font-size: 28px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0;
            }
            .subtitle {
                color: #8B5C2A;
                font-size: 14px;
                margin-top: 5px;
            }
            .section {
                margin-bottom: 30px;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #1a1a1a;
                text-transform: uppercase;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .info-item {
                font-size: 14px;
            }
            .label {
                color: #666;
                font-weight: bold;
                display: block;
                font-size: 12px;
                text-transform: uppercase;
            }
            .value {
                color: #1a1a1a;
                font-size: 15px;
            }
            .highlight-box {
                background-color: white;
                border: 1px solid #D4A93E;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .highlight-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 15px;
            }
            .highlight-label {
                color: #666;
            }
            .highlight-value {
                font-weight: bold;
                color: #D4A93E;
            }
            .footer {
                position: fixed;
                bottom: 40px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 12px;
                color: #999;
                border-top: 1px solid #eee;
                padding-top: 20px;
            }
            .footer-brand {
                color: #D4A93E;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header">
                <img src="https://cortinasbras.com.br/static/logo.png" class="logo" alt="Cortinas Brás" />
                <h1 class="title">Orçamento Exclusivo</h1>
                <p class="subtitle">Proposta #${lead.id} • ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div class="section">
                <div class="section-title">Dados do Cliente</div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Nome Completo</span>
                        <span class="value">${lead.nome}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">WhatsApp</span>
                        <span class="value">${lead.telefone}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Localização</span>
                        <span class="value">${lead.cidade_bairro || 'Não informada'}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Especificações do Projeto</div>
                <div class="highlight-box">
                    <div class="highlight-item">
                        <span class="highlight-label">Largura do Vão:</span>
                        <span class="highlight-value">${lead.largura_parede || 'A verificar'}m</span>
                    </div>
                    <div class="highlight-item">
                        <span class="highlight-label">Altura do Pé-direito:</span>
                        <span class="highlight-value">${lead.altura_parede || 'A verificar'}m</span>
                    </div>
                    <div class="highlight-item">
                        <span class="highlight-label">Tecido Sugerido:</span>
                        <span class="highlight-value">${lead.tecido || 'Sob Consultoria'}</span>
                    </div>
                    <div class="highlight-item">
                        <span class="highlight-label">Instalação Especializada:</span>
                        <span class="highlight-value">${lead.instalacao || 'Sim'}</span>
                    </div>
                </div>
            </div>

            ${lead.observacoes ? `
            <div class="section">
                <div class="section-title">Observações Adicionais</div>
                <p style="font-size: 14px; color: #555; line-height: 1.6;">${lead.observacoes}</p>
            </div>
            ` : ''}

            <div class="footer">
                <p>CORTINAS BRÁS • Fábrica & Showroom</p>
                <p>Av. Celso Garcia, 129 - Brás, São Paulo - SP</p>
                <p class="footer-brand">www.cortinasbras.com.br</p>
            </div>
        </div>
    </body>
    </html>
    `;
    return generatePdf(html);
}

export async function generatePremiumOrcamentoPdf(lead: any): Promise<Buffer> {
    return generateOrcamentoPdf(lead);
}
