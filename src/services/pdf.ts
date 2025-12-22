// @ts-ignore
import puppeteer from "puppeteer";

export async function generateOrcamentoPdf(lead: any): Promise<Buffer> {
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
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
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
            </div>
        </div>

        <div class="section">
            <div class="section-title">ESPECIFICAÇÕES TÉCNICAS</div>
            <div class="grid">
                <div><span class="label">Largura da Parede:</span> <span class="value">${lead.largura_parede || 'Não informado'}m</span></div>
                <div><span class="label">Altura da Parede:</span> <span class="value">${lead.altura_parede || 'Não informado'}m</span></div>
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
