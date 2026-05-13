import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateOrcamentoPdf(lead: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
            bufferPages: true
        });
        const buffers: any[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // --- Styles & Colors ---
        const colors = {
            brandGold: '#D4A93E',
            brandBrown: '#8B5C2A',
            textDark: '#1a1a1a',
            textGray: '#666666',
            lightBg: '#f8f5f1'
        };

        // Background Frame
        doc.rect(20, 20, 555, 801).fill(colors.lightBg);

        // Logo
        const logoPath = path.join(process.cwd(), 'public/static/logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, {
                fit: [200, 100],
                align: 'center',
                valign: 'center'
            });
            doc.moveUp();
        }

        // Header
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(22)
           .fillColor(colors.brandGold)
           .text('ORÇAMENTO EXCLUSIVO', { align: 'center' });

        doc.font('Helvetica').fontSize(10)
           .fillColor(colors.brandBrown)
           .text(`Proposta #${lead.id} • ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });

        // Divider
        doc.moveDown();
        doc.strokeColor(colors.brandGold).lineWidth(1).moveTo(200, doc.y).lineTo(350, doc.y).stroke();

        // Section: Cliente
        doc.moveDown(2);
        doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.textDark).text('CLIENTE', { underline: true });
        doc.moveDown(0.5);

        const clientData = [
            { label: 'Nome Completo:', value: lead.nome },
            { label: 'Contato (WhatsApp):', value: lead.telefone },
            { label: 'Região:', value: lead.cidade_bairro || 'Não informada' },
        ];

        clientData.forEach((item: any) => {
            doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.textGray).text(item.label);
            doc.font('Helvetica').fontSize(11).fillColor(colors.textDark).text(item.value, { continued: true, indent: 10 });
            doc.moveDown(0.5);
        });

        // Section: Projeto (Highlight Box)
        doc.moveDown(1);
        doc.rect(50, doc.y, 500, 120).fill(colors.lightBg);
        doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.textDark).text('DETALHES DO PROJETO', 60, doc.y + 10);

        let currentY = doc.y + 30;
        const projectData = [
            { label: 'Largura do Vão:', value: `${lead.largura_parede || 'A verificar'} metros` },
            { label: 'Altura do Pé-direito:', value: `${lead.altura_parede || 'A verificar'} metros` },
            { label: 'Tecido Sugerido:', value: lead.tecido || 'Sob Consultoria', isGold: true },
            { label: 'Inclui Instalação?', value: lead.instalacao || 'Sim (Especializada)' },
        ];

        projectData.forEach((item: any) => {
            doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.textGray).text(item.label, 60, currentY);
            doc.font('Helvetica').fontSize(11).fillColor(item.isGold ? colors.brandGold : colors.textDark).text(item.value, 160, currentY);
            currentY += 20;
        });

        // Observações
        if (lead.observacoes) {
            doc.moveDown(3);
            doc.font('Helvetica-Bold').fontSize(14).fillColor(colors.textDark).text('NOTAS DO PEDIDO');
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(11).fillColor('#555').text(lead.observacoes, { align: 'justify' });
        }

        // Footer
        const footerY = 750;
        doc.moveTo(50, footerY).lineTo(540, footerY).strokeColor('#eee').stroke();
        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#999').text('CORTINAS BRÁS • Fábrica & Showroom', { align: 'center' });
        doc.font('Helvetica').fontSize(9).fillColor('#999').text('Av. Celso Garcia, 129 - Brás, São Paulo - SP', { align: 'center' });
        doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.brandGold).text('www.cortinasbras.com.br', { align: 'center' });

        doc.end();
    });
}

export async function generatePremiumOrcamentoPdf(lead: any): Promise<Buffer> {
    // Reutiliza a lógica do generateOrcamentoPdf para consistência e economia de recursos
    return generateOrcamentoPdf(lead);
}

export async function generatePdf(html: string): Promise<Buffer> {
    // Nota: A conversão direta de HTML para PDF sem navegador (Puppeteer) é limitada.
    // Para manter a VPS leve, recomendamos que todas as funções usem o padrão PDFKit acima.
    throw new Error("A função generatePdf (HTML) foi desativada para economizar recursos da VPS. Use generateOrcamentoPdf.");
}
