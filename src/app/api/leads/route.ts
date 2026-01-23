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


        // 2. Gerar PDF e resto do fluxo (Tratamento de erro robusto)
        let pdfBuffer: Buffer | null = null;
        let pdfUrl = "";

        // Gerar Link do WhatsApp SEMPRE (Prioridade 1)
        const originHeader = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || "https://cortinasbras.com.br";
        const siteUrl = originHeader.replace(/\/$/, "");
        pdfUrl = `${siteUrl}/api/leads/${lead.id}/pdf`;

        const message = `👋 Olá! Acabei de solicitar um orçamento no site.\n\n📋 *Resumo do Pedido*\n*Cliente:* ${lead.name}\n*Região:* ${lead.city}\n\n📐 *Medidas Aproximadas*\n*Largura:* ${lead.width ? lead.width + 'm' : 'A definir'}\n*Altura:* ${lead.height ? lead.height + 'm' : 'A definir'}\n*Tecido:* ${lead.fabric || 'A definir'}\n\n📄 *Baixar Orçamento (PDF)*\n${pdfUrl}\n\nGostaria de saber os próximos passos!`;
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/5511992891070?text=${encodedMessage}`;

        try {
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

            pdfBuffer = await generateOrcamentoPdf(leadForPdf);
            console.log("PDF Gerado");

            // 3. Enviar E-mail (Somente se PDF gerou)
            if (pdfBuffer) {
                try {
                    console.log("Enviando e-mail...");
                    await sendEmailWithPdf(leadForPdf, pdfBuffer);
                    console.log("E-mail enviado com sucesso");
                } catch (mailError: any) {
                    console.error("ERRO [EMAIL]:", mailError.message);
                    // Não lança erro para não bloquear retorno
                }
            }

        } catch (pdfError: any) {
            console.error("ERRO [PDF]:", pdfError.message);
            // PDF falhou, mas URL do PDF ainda pode ser acessada dps se corrigir
        }

        // Retorna sucesso SEMPRE que salvar no banco
        return NextResponse.json({
            status: "success",
            lead_id: lead.id,
            whatsapp_url: waUrl,
            message: "Lead salvo com sucesso. (Email/PDF processado em segundo plano)"
        });

    } catch (error: any) {
        console.error("EXCEÇÃO FATAL NA API DE LEADS (PRISMA):", error);
        return NextResponse.json({
            status: "error",
            message: "Erro ao salvar dados no sistema. Tente contato direto.",
            error_details: error.message
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
