import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, newPassword } = await req.json();

        if (!email || !newPassword) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Hash da nova senha
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Atualizar usuário
        const user = await prisma.user.update({
            where: { email },
            data: { passwordHash },
            select: { id: true, name: true, email: true, role: true }
        });

        return NextResponse.json({
            success: true,
            message: 'Senha atualizada com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Erro ao resetar senha:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao resetar senha' },
            { status: 500 }
        );
    }
}
