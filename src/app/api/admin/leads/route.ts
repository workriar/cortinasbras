import { NextResponse } from "next/server";
import { getDb } from "@/services/db";

export async function GET() {
    try {
        const db = await getDb();
        const leads = await db.all("SELECT * FROM leads ORDER BY criado_em DESC");

        return NextResponse.json(leads);
    } catch (error: any) {
        console.error("Erro ao buscar leads:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
