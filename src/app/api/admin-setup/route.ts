import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Force dynamic ensures this route is not cached
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("🛠️ Iniciando Setup de Admin...");

        // 1. Verificar/Criar Tabela User (Workaround para falta de migration em prod)
        // Isso é seguro: Raw SQL para Postgres
        try {
            console.log("Verificando tabela User...");
            await prisma.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS "User" (
                    "id" SERIAL NOT NULL,
                    "email" TEXT NOT NULL,
                    "name" TEXT,
                    "passwordHash" TEXT NOT NULL,
                    "role" TEXT NOT NULL DEFAULT 'USER',
                    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    "updatedAt" TIMESTAMP(3) NOT NULL,
                
                    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
                );
            `);
            await prisma.$executeRawUnsafe(`
                CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
            `);
            console.log("✅ Tabela User verificada.");
        } catch (e: any) {
            console.warn("Aviso na criação de tabelas (pode já existir):", e.message);
        }

        // 2. Verificar se existe admin
        const adminEmail = "admin@cortinasbras.com.br";
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            console.log("✅ Admin já existe.");
            return NextResponse.json({
                message: "Admin já configurado.",
                user: { id: existingUser.id, email: existingUser.email }
            });
        }

        // 3. Criar Admin se não existir
        console.log("Criando usuário admin...");
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const newUser = await prisma.user.create({
            data: {
                email: adminEmail,
                name: "Administrador",
                passwordHash: hashedPassword,
                role: "ADMIN",
                updatedAt: new Date()
            }
        });

        console.log("🎉 Admin criado com sucesso!");
        return NextResponse.json({
            success: true,
            message: "Setup concluído. Usuário admin criado.",
            credentials: {
                email: adminEmail,
                password: "admin123" // Mostrar apenas no setup inicial
            }
        });

    } catch (error: any) {
        console.error("❌ Erro fatal no setup:", error);
        return NextResponse.json({
            error: "Falha no setup",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
