import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Map key names to match legacy SQLite structure used by frontend 
        // (Lead.name -> nome, Lead.city -> cidade_bairro, etc)
        const mappedLeads = leads.map(l => ({
            id: l.id,
            nome: l.name,
            telefone: l.phone,
            email: l.email,
            cidade_bairro: l.city,
            largura_parede: l.width,
            altura_parede: l.height,
            tecido: l.fabric,
            instalacao: l.installation,
            observacoes: l.notes,
            status: l.status.toLowerCase(), // frontend expects lowercase 'new'/'novo'? 
            origem: l.source.toLowerCase(),
            criado_em: l.createdAt.toISOString(),
        }));

        return NextResponse.json(mappedLeads);
    } catch (error: any) {
        console.error("Erro ao buscar leads:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
