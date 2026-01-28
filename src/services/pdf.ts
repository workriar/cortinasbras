// @ts-expect-error - Puppeteer has incomplete type definitions
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export async function generateOrcamentoPdf(lead: any): Promise<Buffer> {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
            
            body { 
                font-family: 'Inter', sans-serif; 
                margin: 0; 
                padding: 0; 
                color: #1a1a1a;
                background: #fff;
            }
            .container {
                padding: 50px;
                border: 8px solid #f8f5f1; /* Brand light bg color */
                min-height: 90vh;
            }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
                position: relative;
            }
            .logo-img {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .title { 
                color: #D4A93E; 
                font-family: 'Playfair Display', serif;
                font-size: 32px; 
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0; 
            }
            .subtitle { 
                color: #8B5C2A; 
                font-size: 14px; 
                margin-top: 10px; 
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #D4A93E, transparent);
                margin: 30px 0;
            }
            .section { margin-bottom: 35px; }
            .section-title { 
                color: #1a1a1a; 
                font-size: 16px; 
                font-weight: 700; 
                text-transform: uppercase;
                letter-spacing: 1.5px;
                margin-bottom: 15px; 
                border-bottom: 1px solid #ead5c7;
                padding-bottom: 8px;
            }
            .grid { 
                display: table; 
                width: 100%;
                border-collapse: collapse;
            }
            .row { display: table-row; }
            .cell-label { 
                display: table-cell; 
                width: 40%;
                padding: 8px 0;
                color: #666;
                font-weight: 600;
                font-size: 14px;
            }
            .cell-value { 
                display: table-cell; 
                width: 60%;
                padding: 8px 0;
                color: #000;
                font-size: 15px;
            }
            .highlight-box {
                background: #fdfbf9;
                border: 1px solid #ead5c7;
                padding: 20px;
                border-radius: 8px;
            }
            .footer { 
                margin-top: 60px; 
                text-align: center; 
                font-size: 12px; 
                color: #999; 
            }
            .footer p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), 'public/static/logo.png')).toString('base64')}" class="logo-img" alt="Cortinas Brás" />
                <h1 class="title">Orçamento Exclusivo</h1>
                <p class="subtitle">Proposta #${lead.id} • ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-title">Cliente</div>
                <div class="grid">
                    <div class="row">
                        <div class="cell-label">Nome Completo</div>
                        <div class="cell-value"><strong>${lead.nome}</strong></div>
                    </div>
                    <div class="row">
                        <div class="cell-label">Contato (WhatsApp)</div>
                        <div class="cell-value">${lead.telefone}</div>
                    </div>
                    ${lead.cidade_bairro ? `
                    <div class="row">
                        <div class="cell-label">Região</div>
                        <div class="cell-value">${lead.cidade_bairro}</div>
                    </div>` : ''}
                </div>
            </div>

            <div class="section highlight-box">
                <div class="section-title" style="border-bottom: 0;">Detalhes do Projeto</div>
                <div class="grid">
                    <div class="row">
                        <div class="cell-label">Largura do Vão</div>
                        <div class="cell-value">${lead.largura_parede ? lead.largura_parede + ' metros' : 'A verificar'}</div>
                    </div>
                    <div class="row">
                        <div class="cell-label">Altura do Pé-direito</div>
                        <div class="cell-value">${lead.altura_parede ? lead.altura_parede + ' metros' : 'A verificar'}</div>
                    </div>
                    <div class="row">
                        <div class="cell-label">Tecido Sugerido</div>
                        <div class="cell-value" style="color: #D4A93E; font-weight: bold;">${lead.tecido || "Sob Consultoria"}</div>
                    </div>
                    <div class="row">
                        <div class="cell-label">Inclui Instalação?</div>
                        <div class="cell-value">${lead.instalacao || "Sim (Especializada)"}</div>
                    </div>
                </div>
            </div>

            ${lead.observacoes ? `
            <div class="section">
                <div class="section-title">Notas do Pedido</div>
                <p style="white-space: pre-wrap; color: #555; line-height: 1.6;">${lead.observacoes}</p>
            </div>
            ` : ''}

            <div class="footer">
                <p><strong>CORTINAS BRÁS • Fábrica & Showroom</strong></p>
                <p>Av. Celso Garcia, 129 - Brás, São Paulo - SP</p>
                <p style="color: #D4A93E; font-weight: bold; margin-top: 10px;">www.cortinasbras.com.br</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    await browser.close();
    return pdfBuffer;
}

export async function generatePdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return pdfBuffer;
}

export async function generatePremiumOrcamentoPdf(lead: any): Promise<Buffer> {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            body { 
                font-family: 'Inter', system-ui, sans-serif; 
                margin: 0; 
                padding: 40px; 
                color: #333;
                background: white;
            }
            .header { 
                text-align: center; 
                border-bottom: 2px solid #D4A93E; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
            }
            .title { 
                color: #D4A93E; 
                font-size: 28px; 
                font-weight: bold; 
                margin: 0; 
            }
            .subtitle { 
                color: #8B5C2A; 
                font-size: 14px; 
                margin-top: 5px; 
            }
            .section { margin-bottom: 25px; }
            .section-title { 
                color: #8B5C2A; 
                font-size: 18px; 
                font-weight: bold; 
                border-left: 4px solid #D4A93E; 
                padding-left: 10px; 
                margin-bottom: 15px; 
            }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #000; }
            .footer { 
                margin-top: 50px; 
                text-align: center; 
                font-size: 12px; 
                color: #999; 
                border-top: 1px solid #eee; 
                padding-top: 20px; 
            }
            .logo { font-size: 24px; font-weight: 900; color: #D4A93E; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">CORTINAS BRÁS</div>
            <p class="title">ORÇAMENTO PERSONALIZADO</p>
            <p class="subtitle">ID: #${lead.id} | Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
        </div>

        <div class="section">
            <div class="section-title">DADOS DO CLIENTE</div>
            <div class="grid">
                <div><span class="label">Nome:</span> <span class="value">${lead.nome}</span></div>
                <div><span class="label">WhatsApp:</span> <span class="value">${lead.telefone}</span></div>
                ${lead.cidade_bairro ? `<div><span class="label">Localização:</span> <span class="value">${lead.cidade_bairro}</span></div>` : ''}
            </div>
        </div>

        <div class="section">
            <div class="section-title">ESPECIFICAÇÕES TÉCNICAS</div>
            <div class="grid">
                <div><span class="label">Largura da Parede:</span> <span class="value">${lead.largura_parede}m</span></div>
                <div><span class="label">Altura da Parede:</span> <span class="value">${lead.altura_parede}m</span></div>
                <div><span class="label">Tecido:</span> <span class="value">${lead.tecido || "A definir"}</span></div>
                <div><span class="label">Instalação:</span> <span class="value">${lead.instalacao || "Sim"}</span></div>
            </div>
        </div>

        ${lead.observacoes ? `
        <div class="section">
            <div class="section-title">OBSERVAÇÕES</div>
            <p style="white-space: pre-wrap;">${lead.observacoes}</p>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Cortinas Brás - Tradição e Qualidade desde 2003</strong></p>
            <p>Av. Celso Garcia, 129 - Brás, São Paulo - SP, 03015-000 | (11) 99289-1070</p>
            <p>Este orçamento é uma estimativa e pode sofrer alterações após visita técnica.</p>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    await browser.close();
    return pdfBuffer;
}
