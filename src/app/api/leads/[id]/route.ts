import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                interactions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Erro ao buscar lead:', error);
        return NextResponse.json({ error: 'Erro ao buscar lead' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, phone, email, city, source, status, notes } = body;

        const lead = await prisma.lead.update({
            where: { id: parseInt(params.id) },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(email !== undefined && { email }),
                ...(city !== undefined && { city }),
                ...(source && { source }),
                ...(status && { status }),
                ...(notes !== undefined && { notes }),
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Erro ao atualizar lead:', error);
        return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.lead.delete({
            where: { id: parseInt(params.id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir lead:', error);
        return NextResponse.json({ error: 'Erro ao excluir lead' }, { status: 500 });
    }
}
