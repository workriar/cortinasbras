import { NextResponse } from 'next/server';
import { query } from '@/services/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const result = await query("SELECT * FROM leads WHERE id = $1", [id]);
        const lead = result.rows[0];

        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        // Map column names to JS object property names
        const mappedLead = {
            ...lead,
            name: lead.nome,
            phone: lead.telefone,
            city: lead.cidade_bairro,
            createdAt: lead.criado_em,
            updatedAt: lead.atualizado_em,
        };

        return NextResponse.json(mappedLead);
    } catch (error) {
        console.error('Erro ao buscar lead:', error);
        return NextResponse.json({ error: 'Erro ao buscar lead' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();
        const { name, phone, email, city, source, status, notes } = body;

        // Note: Using Portuguese column names for update
        const updateQuery = `
            UPDATE leads 
            SET 
                nome = COALESCE($1, nome),
                telefone = COALESCE($2, telefone),
                cidade_bairro = COALESCE($3, cidade_bairro),
                status = COALESCE($4, status),
                observacoes = COALESCE($5, observacoes),
                origem = COALESCE($6, origem),
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `;

        const result = await query(updateQuery, [
            name,
            phone,
            city,
            status,
            notes,
            source,
            id
        ]);

        const updatedLead = result.rows[0];

        const mappedLead = {
            ...updatedLead,
            name: updatedLead.nome,
            phone: updatedLead.telefone,
            city: updatedLead.cidade_bairro,
            createdAt: updatedLead.criado_em,
            updatedAt: updatedLead.atualizado_em,
        };

        return NextResponse.json(mappedLead);
    } catch (error) {
        console.error('Erro ao atualizar lead:', error);
        return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await query("DELETE FROM leads WHERE id = $1", [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir lead:', error);
        return NextResponse.json({ error: 'Erro ao excluir lead' }, { status: 500 });
    }
}
