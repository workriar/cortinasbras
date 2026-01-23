import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrcamentoPdf } from "@/services/pdf";
import { sendEmailWithPdf } from "@/services/email";
import { z } from "zod";

const leadSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    telefone: z.string().default("0000000000"),
    cidade_bairro: z.string().optional(),
    largura_parede: z.union([z.string(), z.number()]).optional(),
    altura_parede: z.union([z.string(), z.number()]).optional(),
    tecido: z.string().optional(),
    instalacao: z.string().optional(),
    observacoes: z.string().optional(),
    source: z.string().optional(),
    status: z.string().optional(),
    // Allow legacy English fields mapping
    name: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    width: z.union([z.string(), z.number()]).optional(),
    height: z.union([z.string(), z.number()]).optional(),
    fabric: z.string().optional(),
    installation: z.string().optional(),
    notes: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("⬇️ [API] Recebendo lead (Payload bruto):", JSON.stringify(body, null, 2));

        // 1. Validation
        const validation = leadSchema.safeParse(body);
        if (!validation.success) {
            console.error("❌ [API] Erro de Validação:", validation.error.format());
            return NextResponse.json({
                status: "error",
                message: "Dados inválidos",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const data = validation.data;

        // 2. Normalization
        const parseFloatSafe = (val: any) => {
            if (!val) return null;
            const parsed = parseFloat(String(val).replace(",", "."));
            return isNaN(parsed) ? null : parsed;
        };

        const nome = data.name || data.nome || "Leads Sem Nome";
        const telefone = data.phone || data.telefone || "0000000000";
        const cidade = data.city || data.cidade_bairro || "Não informado";
        const largura = parseFloatSafe(data.width || data.largura_parede);
        const altura = parseFloatSafe(data.height || data.altura_parede);
        const tecido = data.fabric || data.tecido || null;
        const instalacao = data.installation || data.instalacao || null;
        const obs = data.notes || data.observacoes || "";
        const origem = data.source || "SITE";
        const status = data.status ? String(data.status).toUpperCase() : "NEW";

        console.log("✅ [API] Dados normalizados, salvando no Prisma...");

        // 3. Database Operation
        const lead = await prisma.lead.create({
            data: {
                name: nome,
                phone: telefone,
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

        console.log(`🎉 [API] Lead #${lead.id} criado com sucesso!`);

        // 4. Async Side Effects (PDF/Email/WhatsApp) -> Handle safely without blocking response if possible
        const originHeader = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || "https://cortinasbras.com.br";
        const siteUrl = originHeader.replace(/\/$/, "");
        const pdfUrl = `${siteUrl}/api/leads/${lead.id}/pdf`;

        const message = `👋 Olá! Orçamento #${lead.id} recebido.\n\n*Cliente:* ${lead.name}\n*Medidas:* ${lead.width || '?'}m x ${lead.height || '?'}m\n*PDF:* ${pdfUrl}`;
        const whatsapp_url = `https://wa.me/5511992891070?text=${encodeURIComponent(message)}`;

        // Generate PDF in background (or await but catch errors)
        try {
            console.log("📄 [API] Gerando PDF do lead...");
            const leadForPdf = { ...lead, nome: lead.name, telefone: lead.phone, cidade_bairro: lead.city, largura_parede: lead.width, altura_parede: lead.height, tecido: lead.fabric, instalacao: lead.installation, observacoes: lead.notes };

            const pdfBuffer = await generateOrcamentoPdf(leadForPdf);

            if (pdfBuffer) {
                console.log("✉️ [API] Enviando e-mail...");
                await sendEmailWithPdf(leadForPdf, pdfBuffer).catch(e => console.error("⚠️ [API] Erro envio email:", e.message));
            }
        } catch (error: any) {
            console.error("⚠️ [API] Erro não-critico (PDF/Email):", error.message);
            // PDF generation might fail due to logo missing, path issues, or missing chromium
            // BUT we still return SUCCESS because the Lead was saved.
        }

        return NextResponse.json({
            status: "success",
            lead_id: lead.id,
            whatsapp_url,
            message: "Lead salvo com sucesso!"
        }, { status: 201 });

    } catch (error: any) {
        console.error("🔥 [API] ERRO FATAL (500):", error);
        return NextResponse.json({
            status: "error",
            message: "Erro interno no servidor ao processar lead.",
            details: error.message
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
