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

        // 1. Salvar no Banco via Prisma (Mapeado automaticamente para 'leads')
        console.log("Salvando no banco...");
        const lead = await prisma.lead.create({
            data: {
                name: data.nome || "Sem Nome",
                phone: data.telefone || "Sem Telefone",
                city: data.cidade_bairro || "Não especificado",
                width: parseValue(data.largura_parede),
                height: parseValue(data.altura_parede),
                fabric: data.tecido || "Não especificado",
                installation: data.instalacao || "Não especificado",
                notes: data.observacoes || "",
                source: "SITE",
                status: "NEW"
            }
        });

        console.log(`Lead #${lead.id} salvo`);

        // 2. Gerar PDF e resto do fluxo...
        console.log("Gerando PDF...");
        // Adaptar objeto lead para o formato esperado pelo PDF (usando nomes antigos se necessário ou ajustando o gerador)
        // O gerador espera { nome, telefone, ... } ou { name, phone... }?
        // Vamos passar um objeto misto para garantir compatibilidade
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
            ...data // garante campos originais
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
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        const whereClause = status ? { status } : {};

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            }),
            prisma.lead.count({ where: whereClause })
        ]);

        return NextResponse.json({
            leads,
            total,
            limit,
            offset,
        });
    } catch (error: any) {
        console.error("Erro ao buscar leads (Prisma):", error);
        return NextResponse.json({
            leads: [],
            total: 0,
            error: error.message
        }, { status: 500 });
    }
}
