import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(req: Request, { params }: { params: { id: string } }) { // No Next 15+ params seria promise, mas aqui ainda deve ser objeto direto ou a way padrão
    // Em Next 13+ app directory params é objeto direto no second argument da função.

    // UPDATE: Em versões recentes do Next, params pode precisar ser awaited dependendo da versão exata, mas no padrão 14.x é objeto. 
    // Vamos usar a forma segura.

    try {
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
