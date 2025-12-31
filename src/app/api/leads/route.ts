import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrcamentoPdf } from "@/services/pdf";
import { sendEmailWithPdf } from "@/services/email";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Recebendo lead (Prisma):", data);

        // Helper to parse float with comma
        const parseValue = (val: any) => {
            if (!val) return null;
            return parseFloat(String(val).replace(",", "."));
        };

        const nome = data.name || data.nome || "Sem Nome";
        const telefone = data.phone || data.telefone || "0000000000";
        const email = data.email || null;
        const cidade = data.city || data.cidade_bairro || "Não especificado";
        const largura = parseValue(data.width || data.largura_parede);
        const altura = parseValue(data.height || data.altura_parede);
        const tecido = data.fabric || data.tecido || null;
        const instalacao = data.installation || data.instalacao || null;
        const obs = data.notes || data.observacoes || "";
        const origem = data.source || data.origem || "SITE";
        const status = data.status ? String(data.status).toUpperCase() : "NEW";

        console.log("Salvando no banco via Prisma...");

        const lead = await prisma.lead.create({
            data: {
                name: nome,
                phone: telefone,
                email: email,
                city: cidade,
                width: largura,
                height: altura,
                fabric: tecido,
                installation: instalacao,
                notes: obs,
                source: origem,
                status: status,
            }
        });

        console.log(`Lead #${lead.id} salvo`);

        // 2. Gerar PDF e resto do fluxo...
        console.log("Gerando PDF...");

        const leadForPdf = {
            id: lead.id,
            nome: lead.name,
            telefone: lead.phone,
            cidade_bairro: lead.city,
            largura_parede: lead.width,
            altura_parede: lead.height,
            tecido: lead.fabric,
            instalacao: lead.installation,
            observacoes: lead.notes,
            ...data
        };

        const pdfBuffer = await generateOrcamentoPdf(leadForPdf);
        console.log("PDF Gerado");

        // 3. Enviar E-mail (Async)
        try {
            console.log("Enviando e-mail...");
            await sendEmailWithPdf(leadForPdf, pdfBuffer);
            console.log("E-mail enviado");
        } catch (mailError) {
            console.error("Erro ao enviar e-mail:", mailError);
        }

        // 4. Gerar Link do WhatsApp
        const originHeader = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const siteUrl = originHeader.replace(/\/$/, "");
        const pdfUrl = `${siteUrl}/api/leads/${lead.id}/pdf`;

        const message = `Olá, meu nome é ${lead.name}. Fiz um orçamento no site (ID #${lead.id}).\n\n*Localização:* ${lead.city}\n*Medidas:* ${lead.width || 'N/A'}m x ${lead.height || 'N/A'}m\n*Tecido:* ${lead.fabric}\n\n*Veja meu orçamento:* ${pdfUrl}\n\nGostaria de prosseguir com o atendimento.`;
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/5511992891070?text=${encodedMessage}`;

        return NextResponse.json({
            status: "success",
            lead_id: lead.id,
            whatsapp_url: waUrl,
        });

    } catch (error: any) {
        console.error("EXCEÇÃO NA API DE LEADS:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            name: error.name,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        console.log(`Buscando leads (Prisma) status=${status || 'todos'}...`);

        const where: any = {};
        if (status) {
            where.status = {
                equals: status, // Prisma case insensitive? SQLite is tricky with ILIKE.
                // Assuming status is stored uppercase as normalized.
            };
        }

        const [leadsData, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.lead.count({ where })
        ]);

        const normalizeStatus = (s: string) => {
            if (!s) return 'NEW';
            const upper = String(s).toUpperCase();
            if (['NEW', 'CONTACTED', 'PROPOSAL', 'CLOSED_WON', 'CLOSED_LOST'].includes(upper)) return upper;
            return 'NEW';
        };

        const leads = leadsData.map((row) => ({
            id: row.id,
            name: row.name || "Sem Nome",
            phone: row.phone || "Sem Telefone",
            email: row.email || null,
            city: row.city || "",
            source: row.source || "SITE",
            status: normalizeStatus(row.status),
            notes: row.notes || "",
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            width: row.width,
            height: row.height,
            fabric: row.fabric,
            installation: row.installation
        }));

        return NextResponse.json({
            leads,
            total,
            limit,
            offset
        });

    } catch (error: any) {
        console.error("Erro Prisma Leads:", error);
        return NextResponse.json({
            leads: [],
            total: 0,
            error: error.message
        }, { status: 500 });
    }
}
