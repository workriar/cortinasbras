import { NextResponse } from "next/server";
import { leadService } from "@/services/lead.service";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Recebendo lead (Service Layer):", data);

        const { lead } = await leadService.createLead(data);

        // 4. Gerar Link do WhatsApp (Isso poderia ir para um WhatsAppService)
        const originHeader = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const siteUrl = originHeader.replace(/\/$/, "");
        const pdfUrl = `${siteUrl}/api/leads/${lead.id}/pdf`;

        // Lógica de mensagem WA (simplificada, idealmente templates)
        const message = `Olá, meu nome é ${lead.name}. Fiz um orçamento no site (ID #${lead.id}).\n\n*Localização:* ${lead.city}\n*Medidas:* ${lead.width || 'N/A'}m x ${lead.height || 'N/A'}m\n*Tecido:* ${lead.fabric || 'N/A'}\n*Modelo:* ${lead.type || 'N/A'}\n*Translucidez/Forro:* ${lead.translucency || lead.lining || 'N/A'}\n*Onde:* ${lead.space || 'N/A'}\n*Instalação:* ${lead.installation || 'N/A'}\n\n*Veja meu orçamento:* ${pdfUrl}\n\nGostaria de prosseguir com o atendimento.`;
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
            name: error.name
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        console.log(`Buscando leads (Service Layer) status=${status || 'todos'}...`);

        const { leads, total } = await leadService.getLeads(
            { status },
            { skip: offset, take: limit }
        );

        // Map para formato legacy se necessário (opcional se o frontend já aceita o novo)
        // O LeadService já retorna Prisma.Lead, que é compatível com o esperado na maior parte.

        return NextResponse.json({
            leads,
            total,
            limit,
            offset
        });

    } catch (error: any) {
        console.error("Erro API Leads:", error);
        return NextResponse.json({
            leads: [],
            total: 0,
            error: error.message
        }, { status: 500 });
    }
}
