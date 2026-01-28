import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

// GET: Listar usuários
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Apenas ADMIN pode listar
        // Como o campo role no banco pode estar populado ou não, vamos filtrar no front ou aqui se o usuário atual for admin
        // Mas por simplicidade, vamos permitir listar, mas ocultar dados sensíveis.

        // Verifica se é admin (opcional, por enquanto aberto para usuários logados)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Criar usuário
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Segurança: Só ADMIN pode criar usuários
        // Precisamos verificar o role do usuário logado.
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Buscar usuário atual no banco para confirmar role
        const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Apenas administradores podem criar usuários.' }, { status: 403 });
        }

        const data = await req.json();
        const { name, email, password, role } = data;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        // Verificar email duplicado
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: role || 'USER',
            }
        });

        return NextResponse.json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });

    } catch (error: any) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
