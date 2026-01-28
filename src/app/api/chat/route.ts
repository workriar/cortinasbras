import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: 100, // Últimas 100 mensagens
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return NextResponse.json({ messages: [] });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const { content } = await request.json();

        // Por enquanto, enviar para todos (broadcast)
        // TODO: Implementar destinatário específico
        const allUsers = await prisma.user.findMany();
        const receiverId = allUsers.find((u: any) => u.id !== user.id)?.id || user.id;

        const message = await prisma.message.create({
            data: {
                content,
                senderId: user.id,
                receiverId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Erro ao criar mensagem:', error);
        return NextResponse.json({ error: 'Erro ao criar mensagem' }, { status: 500 });
    }
}
