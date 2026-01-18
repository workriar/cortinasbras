import { NextResponse } from "next/server";
import { query } from "@/services/db";
import { generateOrcamentoPdf } from "@/services/pdf";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await query("SELECT * FROM leads WHERE id = $1", [id]);
        const lead = result.rows[0];

        if (!lead) {
            return new NextResponse("Orçamento não encontrado", { status: 404 });
        }

        const pdfBuffer = await generateOrcamentoPdf(lead);

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
