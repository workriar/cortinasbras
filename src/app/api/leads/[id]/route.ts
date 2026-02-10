import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: parseInt(id) }
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao buscar lead:', error);
        }
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

        if (!body.status && process.env.NODE_ENV === 'development') {
            console.warn(`[API] Tentativa de atualização sem status para lead ${id}`);
        }

        // Mapeamento correto com Prisma
        const updatedLead = await prisma.lead.update({
            where: { id: parseInt(id) },
            data: {
                name: body.name || undefined,
                phone: body.phone || undefined,
                email: body.email || undefined,
                city: body.city || undefined,
                source: body.source || undefined,
                status: body.status || undefined, // Garante que status está sendo passado
                notes: body.notes || undefined,
            }
        });

        return NextResponse.json(updatedLead);
    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error(`[API] Erro ao atualizar lead ${id}:`, error);
        }
        return NextResponse.json({
            error: 'Erro ao atualizar lead',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.lead.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao excluir lead:', error);
        }
        return NextResponse.json({ error: 'Erro ao excluir lead' }, { status: 500 });
    }
}
