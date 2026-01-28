import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

export async function DELETE(req: Request, context: any) {
    // Em versões recentes do Next.js (15+), o segundo argumento (context/params) é uma Promise.
    // Usamos 'any' e 'await context.params' para compatibilidade garantida.

    try {
        const params = await context.params;
        const id = parseInt(params.id);
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Apenas administradores podem excluir usuários.' }, { status: 403 });
        }

        if (currentUser.id === id) {
            return NextResponse.json({ error: 'Você não pode excluir sua própria conta.' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
