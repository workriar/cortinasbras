import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        // Teste 1: Conexão com o banco
        const userCount = await prisma.user.count();

        // Teste 2: Buscar usuário admin
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@cortinasbras.com.br' }
        });

        // Teste 3: Testar senha
        let passwordValid = false;
        if (admin) {
            passwordValid = await bcrypt.compare('admin123', admin.passwordHash);
        }

        return NextResponse.json({
            success: true,
            tests: {
                databaseConnection: true,
                totalUsers: userCount,
                adminExists: !!admin,
                adminData: admin ? {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                    hashLength: admin.passwordHash.length,
                    hashPreview: admin.passwordHash.substring(0, 20) + '...'
                } : null,
                passwordValid: passwordValid
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
