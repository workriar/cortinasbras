const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Criar usuário admin de teste
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@cortinasbras.com.br' },
        update: {},
        create: {
            email: 'admin@cortinasbras.com.br',
            name: 'Administrador',
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Usuário admin criado:');
    console.log('   Email: admin@cortinasbras.com.br');
    console.log('   Senha: admin123');
    console.log('');

    // Criar alguns leads de exemplo
    const leads = await prisma.lead.createMany({
        data: [
            {
                name: 'João Silva',
                phone: '(11) 98765-4321',
                email: 'joao@example.com',
                city: 'São Paulo',
                source: 'SITE',
                status: 'NEW',
                notes: 'Interessado em cortinas para sala',
                ownerId: admin.id,
            },
            {
                name: 'Maria Santos',
                phone: '(11) 91234-5678',
                email: 'maria@example.com',
                city: 'São Paulo',
                source: 'WHATSAPP',
                status: 'CONTACTED',
                notes: 'Pediu orçamento para quarto',
                ownerId: admin.id,
            },
            {
                name: 'Pedro Costa',
                phone: '(11) 99999-8888',
                source: 'ADVERTISEMENT',
                status: 'PROPOSAL',
                notes: 'Enviado orçamento de R$ 2.500',
                ownerId: admin.id,
            },
        ],
    });

    console.log(`✅ ${leads.count} leads de exemplo criados`);
    console.log('');
    console.log('🚀 Banco de dados inicializado com sucesso!');
    console.log('   Acesse: http://localhost:3000/login');
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
