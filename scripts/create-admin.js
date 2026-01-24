const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Criando/Atualizando usuário Admin...');

    // Hash gerado previamente para "admin123" usando bcryptjs
    // Evita necessidade de ter bcryptjs instalado no container
    const passwordHash = '$2b$10$AcTLmpJdnIGcJN8yGjqHVeNfjTsUu6OTOTpd.oviSMxw1R/4OYmNW';

    try {
        const user = await prisma.user.upsert({
            where: { email: 'admin@cortinasbras.com.br' },
            update: {
                passwordHash: passwordHash, // Garante que a senha seja resetada se o user já existir
                role: 'ADMIN'
            },
            create: {
                email: 'admin@cortinasbras.com.br',
                name: 'Administrador',
                passwordHash: passwordHash,
                role: 'ADMIN',
            },
        });
        console.log('✅ Usuário Admin configurado com sucesso!');
        console.log(`🆔 ID: ${user.id}`);
        console.log(`📧 Email: ${user.email}`);
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
