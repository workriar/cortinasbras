const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@cortinasbras.com.br';
    const password = 'admin123';

    console.log(`Resetting password for ${email}...`);

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

    console.log(`User ${user.email} updated successfully.`);
    console.log(`New password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
