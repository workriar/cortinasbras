// ============================================================
// pdf.ts — Geração de PDF com PDFKit (Node.js puro)
// Substitui Puppeteer/Chromium, que é instável em containers Docker.
// PDFKit é uma dependência já declarada em package.json.
// ============================================================

import PDFDocument from 'pdfkit';

/** Converte um stream de PDFDocument em um Buffer de forma confiável */
function streamToBuffer(doc: InstanceType<typeof PDFDocument>): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
    });
}

// Paleta de cores da marca
const BRAND = {
    gold: '#D4A93E',
    darkGold: '#8B5C2A',
    dark: '#1a1a1a',
    light: '#f8f5f1',
    gray: '#666666',
    lightGray: '#dddddd',
};

/**
 * Gera o PDF do catálogo completo de tecidos da Cortinas Brás.
 */
export async function generatePdf(fabrics: Array<{
    name: string;
    description: string;
    colors: string[];
    benefits: string[];
    exclusive?: boolean;
}>): Promise<Buffer> {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
            Title: 'Catálogo Exclusivo — Cortinas Brás',
            Author: 'Cortinas Brás',
            Subject: 'Catálogo de Tecidos Premium',
        },
    });

    const bufferPromise = streamToBuffer(doc);

    const W = doc.page.width;   // 595
    const M = 50;               // margem
    const CW = W - M * 2;       // largura útil

    // ─── Capa ────────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, doc.page.height).fill(BRAND.light);

    // Faixa dourada superior
    doc.rect(0, 0, W, 8).fill(BRAND.gold);

    // Título central
    const centerY = doc.page.height / 2 - 80;
    doc.fillColor(BRAND.darkGold)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('CORTINAS BRÁS', M, centerY, { align: 'center', width: CW, characterSpacing: 6 });

    doc.moveDown(0.5);
    doc.fillColor(BRAND.dark)
        .fontSize(32)
        .font('Helvetica-Bold')
        .text('Catálogo Exclusivo', M, doc.y, { align: 'center', width: CW });

    doc.moveDown(0.5);
    doc.fillColor(BRAND.gold)
        .fontSize(13)
        .font('Helvetica')
        .text('A Arte da Alta Costura em Cortinas', M, doc.y, { align: 'center', width: CW });

    // Linha decorativa
    const lineY = doc.y + 30;
    doc.moveTo(W / 2 - 40, lineY).lineTo(W / 2 + 40, lineY)
        .strokeColor(BRAND.gold).lineWidth(1.5).stroke();

    doc.fillColor(BRAND.darkGold)
        .fontSize(10)
        .font('Helvetica')
        .text('São Paulo | 2026', M, lineY + 15, { align: 'center', width: CW });

    // Faixa dourada inferior
    doc.rect(0, doc.page.height - 8, W, 8).fill(BRAND.gold);

    // ─── Página 2: Sobre a Empresa ───────────────────────────────────────────
    doc.addPage();
    _drawPageHeader(doc, 'Nossas Soluções', W, M, CW);

    const solutions = [
        {
            title: 'Cortinas Prontas',
            desc: 'Modelos selecionados com dimensões padrão, unindo agilidade e a qualidade inquestionável de nossa fábrica. Elegância imediata para seu ambiente.',
            items: ['Entrega imediata', 'Curadoria de cores', 'Tamanhos padrão'],
        },
        {
            title: 'Cortinas Sob Medida',
            desc: 'Nossa obra-prima. Projetos milimetricamente planejados para cada janela, utilizando os tecidos mais nobres do mundo.',
            items: ['Projetos exclusivos', 'Tecidos premium', 'Instalação especializada'],
        },
        {
            title: 'Cama • Mesa • Banho',
            desc: 'Enxovais de luxo que elevam a experiência do lar. Algodão egípcio e tramas nobres para máximo conforto e sofisticação.',
            items: ['Fios Egípcios', 'Toque de Seda', 'Acabamento nobre'],
        },
    ];

    for (const s of solutions) {
        _drawCard(doc, s.title, s.desc, s.items, M, CW);
        doc.moveDown(0.8);
    }

    _drawPageFooter(doc, W, M, CW);

    // ─── Página 3+: Tecidos ──────────────────────────────────────────────────
    doc.addPage();
    _drawPageHeader(doc, 'Curadoria de Tecidos Premium', W, M, CW);

    for (const fabric of fabrics) {
        // Nova página se não houver espaço suficiente
        if (doc.y > doc.page.height - 200) {
            doc.addPage();
            _drawPageHeader(doc, 'Curadoria de Tecidos Premium', W, M, CW);
        }

        _drawFabricCard(doc, fabric, M, CW);
        doc.moveDown(0.6);
    }

    _drawPageFooter(doc, W, M, CW);

    // ─── Última página: Contato ──────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, W, doc.page.height).fill(BRAND.dark);
    doc.rect(0, 0, W, 8).fill(BRAND.gold);

    const ctY = doc.page.height / 2 - 100;

    doc.fillColor(BRAND.gold)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('ENTRE EM CONTATO', M, ctY, { align: 'center', width: CW, characterSpacing: 5 });

    doc.moveDown(0.8);
    doc.fillColor('#ffffff')
        .fontSize(26)
        .font('Helvetica-Bold')
        .text('Fale com nossos\nEspecialistas', M, doc.y, { align: 'center', width: CW });

    doc.moveDown(1.2);

    const contacts = [
        '📍  Av. Celso Garcia, 129 — Brás, São Paulo/SP',
        '📞  (11) 99289-1070',
        '🌐  www.cortinasbras.com.br',
    ];

    for (const c of contacts) {
        doc.fillColor(BRAND.gold)
            .fontSize(11)
            .font('Helvetica')
            .text(c, M, doc.y, { align: 'center', width: CW });
        doc.moveDown(0.6);
    }

    doc.rect(0, doc.page.height - 8, W, 8).fill(BRAND.gold);

    doc.end();
    return bufferPromise;
}

// ─── Helpers internos ────────────────────────────────────────────────────────

function _drawPageHeader(
    doc: InstanceType<typeof PDFDocument>,
    title: string,
    W: number,
    M: number,
    CW: number,
) {
    doc.fillColor(BRAND.dark)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(title, M, M, { align: 'center', width: CW });

    // Linha dourada abaixo do título
    doc.moveTo(M + CW / 2 - 60, doc.y + 8)
        .lineTo(M + CW / 2 + 60, doc.y + 8)
        .strokeColor(BRAND.gold)
        .lineWidth(2)
        .stroke();

    doc.moveDown(2);
}

function _drawPageFooter(
    doc: InstanceType<typeof PDFDocument>,
    W: number,
    M: number,
    CW: number,
) {
    const footerY = doc.page.height - 40;
    doc.moveTo(M, footerY - 6).lineTo(W - M, footerY - 6)
        .strokeColor(BRAND.lightGray).lineWidth(0.5).stroke();

    doc.fillColor(BRAND.gray)
        .fontSize(8)
        .font('Helvetica')
        .text(
            'CORTINAS BRÁS  •  Fábrica & Showroom  •  Av. Celso Garcia, 129 – Brás, São Paulo/SP  •  www.cortinasbras.com.br',
            M,
            footerY,
            { align: 'center', width: CW },
        );
}

function _drawCard(
    doc: InstanceType<typeof PDFDocument>,
    title: string,
    desc: string,
    items: string[],
    M: number,
    CW: number,
) {
    const startY = doc.y;

    // Fundo do card
    const cardH = 120;
    doc.roundedRect(M, startY, CW, cardH, 8)
        .fillAndStroke('#ffffff', BRAND.lightGray);

    // Acento lateral dourado
    doc.rect(M, startY, 4, cardH).fill(BRAND.gold);

    // Título
    doc.fillColor(BRAND.gold)
        .fontSize(13)
        .font('Helvetica-Bold')
        .text(title, M + 20, startY + 14, { width: CW - 30 });

    // Descrição
    doc.fillColor(BRAND.gray)
        .fontSize(9)
        .font('Helvetica')
        .text(desc, M + 20, doc.y + 4, { width: CW - 30 });

    // Benefícios
    const benefitsY = startY + cardH - 22;
    doc.fillColor(BRAND.darkGold)
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(items.map(i => `✓ ${i}`).join('   '), M + 20, benefitsY, { width: CW - 30 });

    doc.y = startY + cardH + 6;
}

function _drawFabricCard(
    doc: InstanceType<typeof PDFDocument>,
    fabric: { name: string; description: string; colors: string[]; benefits: string[]; exclusive?: boolean },
    M: number,
    CW: number,
) {
    const startY = doc.y;
    const cardH = 110;

    doc.roundedRect(M, startY, CW, cardH, 8)
        .fillAndStroke('#ffffff', BRAND.lightGray);

    // Acento lateral
    doc.rect(M, startY, 4, cardH).fill(BRAND.gold);

    // Badge "Exclusivo"
    if (fabric.exclusive) {
        doc.roundedRect(M + CW - 72, startY + 10, 62, 16, 4).fill(BRAND.gold);
        doc.fillColor('#ffffff')
            .fontSize(7)
            .font('Helvetica-Bold')
            .text('EXCLUSIVO', M + CW - 69, startY + 14, { width: 56, align: 'center' });
    }

    // Nome do tecido
    doc.fillColor(BRAND.dark)
        .fontSize(13)
        .font('Helvetica-Bold')
        .text(fabric.name, M + 20, startY + 12, { width: fabric.exclusive ? CW - 110 : CW - 30 });

    // Descrição
    doc.fillColor(BRAND.gray)
        .fontSize(9)
        .font('Helvetica')
        .text(fabric.description, M + 20, doc.y + 3, { width: CW - 30, lineGap: 1.5 });

    // Cores
    const colorsY = startY + cardH - 36;
    doc.fillColor(BRAND.darkGold)
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .text('CORES:', M + 20, colorsY);

    doc.fillColor(BRAND.gray)
        .fontSize(7.5)
        .font('Helvetica')
        .text(fabric.colors.join(' • '), M + 58, colorsY, { width: CW - 80 });

    // Benefícios
    const benefitsY = startY + cardH - 20;
    doc.fillColor(BRAND.darkGold)
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .text('DIFERENCIAIS:', M + 20, benefitsY);

    doc.fillColor(BRAND.gray)
        .fontSize(7.5)
        .font('Helvetica')
        .text(fabric.benefits.map(b => `✓ ${b}`).join('   '), M + 88, benefitsY, { width: CW - 110 });

    doc.y = startY + cardH + 8;
}

/**
 * Gera o PDF de orçamento de um lead.
 */
export async function generateOrcamentoPdf(lead: {
    id: number | string;
    nome: string;
    telefone: string;
    cidade_bairro?: string;
    largura_parede?: number | string;
    altura_parede?: number | string;
    tecido?: string;
    instalacao?: string;
    observacoes?: string;
}): Promise<Buffer> {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
            Title: `Orçamento #${lead.id} — Cortinas Brás`,
            Author: 'Cortinas Brás',
        },
    });

    const bufferPromise = streamToBuffer(doc);

    const W = doc.page.width;
    const M = 50;
    const CW = W - M * 2;

    // Fundo
    doc.rect(0, 0, W, doc.page.height).fill(BRAND.light);
    doc.rect(0, 0, W, 8).fill(BRAND.gold);

    // Cabeçalho
    doc.fillColor(BRAND.darkGold)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('CORTINAS BRÁS', M, 30, { align: 'center', width: CW, characterSpacing: 4 });

    doc.fillColor(BRAND.gold)
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('Orçamento Exclusivo', M, 50, { align: 'center', width: CW });

    doc.fillColor(BRAND.gray)
        .fontSize(10)
        .font('Helvetica')
        .text(
            `Proposta #${lead.id}  •  ${new Date().toLocaleDateString('pt-BR')}`,
            M,
            doc.y + 6,
            { align: 'center', width: CW },
        );

    // Linha divisória
    doc.moveTo(M, doc.y + 14).lineTo(W - M, doc.y + 14)
        .strokeColor(BRAND.gold).lineWidth(1.5).stroke();

    doc.moveDown(2.5);

    // ─── Dados do Cliente
    _sectionTitle(doc, 'DADOS DO CLIENTE', M, CW);

    const rows: [string, string][] = [
        ['Nome Completo', lead.nome],
        ['WhatsApp', lead.telefone],
        ['Localização', lead.cidade_bairro || 'Não informada'],
    ];
    _infoGrid(doc, rows, M, CW);

    doc.moveDown(1.2);

    // ─── Especificações do Projeto
    _sectionTitle(doc, 'ESPECIFICAÇÕES DO PROJETO', M, CW);

    const specs: [string, string][] = [
        ['Largura do Vão', `${lead.largura_parede || 'A verificar'} m`],
        ['Altura do Pé-direito', `${lead.altura_parede || 'A verificar'} m`],
        ['Tecido Sugerido', lead.tecido || 'Sob Consultoria'],
        ['Instalação Especializada', lead.instalacao || 'Sim'],
    ];
    _infoGrid(doc, specs, M, CW);

    // ─── Observações
    if (lead.observacoes) {
        doc.moveDown(1.2);
        _sectionTitle(doc, 'OBSERVAÇÕES ADICIONAIS', M, CW);
        doc.fillColor(BRAND.gray)
            .fontSize(10)
            .font('Helvetica')
            .text(lead.observacoes, M, doc.y, { width: CW, lineGap: 3 });
    }

    // Rodapé fixo
    _drawPageFooter(doc, W, M, CW);

    doc.rect(0, doc.page.height - 8, W, 8).fill(BRAND.gold);

    doc.end();
    return bufferPromise;
}

// Alias de compatibilidade
export const generatePremiumOrcamentoPdf = generateOrcamentoPdf;

// ─── Helpers de seção ────────────────────────────────────────────────────────

function _sectionTitle(
    doc: InstanceType<typeof PDFDocument>,
    title: string,
    M: number,
    CW: number,
) {
    doc.fillColor(BRAND.dark)
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(title, M, doc.y, { width: CW, characterSpacing: 2 });

    doc.moveTo(M, doc.y + 3).lineTo(M + CW, doc.y + 3)
        .strokeColor(BRAND.lightGray).lineWidth(0.5).stroke();

    doc.moveDown(0.8);
}

function _infoGrid(
    doc: InstanceType<typeof PDFDocument>,
    rows: [string, string][],
    M: number,
    CW: number,
) {
    const colW = CW / 2;

    for (let i = 0; i < rows.length; i += 2) {
        const rowY = doc.y;
        const left = rows[i];
        const right = rows[i + 1];

        // Coluna esquerda
        doc.fillColor(BRAND.gray)
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(left[0].toUpperCase(), M, rowY, { width: colW, characterSpacing: 1 });
        doc.fillColor(BRAND.dark)
            .fontSize(11)
            .font('Helvetica')
            .text(left[1], M, doc.y + 1, { width: colW });

        // Coluna direita (se existir)
        if (right) {
            doc.fillColor(BRAND.gray)
                .fontSize(8)
                .font('Helvetica-Bold')
                .text(right[0].toUpperCase(), M + colW, rowY, { width: colW, characterSpacing: 1 });
            doc.fillColor(BRAND.dark)
                .fontSize(11)
                .font('Helvetica')
                .text(right[1], M + colW, rowY + 11, { width: colW });
        }

        doc.moveDown(0.9);
    }
}
