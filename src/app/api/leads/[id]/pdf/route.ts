import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrcamentoPdf } from "@/services/pdf";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const lead = await prisma.lead.findUnique({
            where: { id: Number(id) }
        });

        if (!lead) {
            return new NextResponse("Orçamento não encontrado", { status: 404 });
        }

        // Mapear campos do Prisma para o formato esperado pelo gerador de PDF (legado)
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
        };

        const pdfBuffer = await generateOrcamentoPdf(leadForPdf);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="orcamento_${lead.id}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error("Erro ao gerar PDF:", error);
        return new NextResponse("Erro interno ao gerar PDF", { status: 500 });
    }
}
