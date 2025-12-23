import { NextResponse } from "next/server";
import { query } from "@/services/db";

export async function GET() {
    try {
        const result = await query("SELECT * FROM leads ORDER BY criado_em DESC");
        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error("Erro ao buscar leads:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
