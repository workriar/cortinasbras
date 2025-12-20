import { NextResponse } from "next/server";
import { getDb } from "@/services/db";
import { generateOrcamentoPdf } from "@/services/pdf";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const db = await getDb();
        const lead = await db.get("SELECT * FROM leads WHERE id = ?", [id]);

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
