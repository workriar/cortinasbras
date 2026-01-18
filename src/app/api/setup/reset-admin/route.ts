import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Proteção básica
    if (key !== 'temp-secret-reset-2024') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const email = 'admin@cortinasbras.com.br';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash: hashedPassword,
                role: 'ADMIN',
                name: 'Administrador'
            },
            create: {
                email,
                name: 'Administrador',
                passwordHash: hashedPassword,
                role: 'ADMIN',
            },
        });

        return NextResponse.json({
            success: true,
            message: `Senha redefinida para usuário ${email}`,
            newPassword: password
        });

    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
