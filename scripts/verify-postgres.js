const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const leads = await prisma.lead.findMany();
        console.log(`Leads encontrados no Postgres: ${leads.length}`);
        leads.forEach(l => {
            console.log(`- ${l.id}: ${l.name} (${l.phone}) - ${l.status}`);
        });
    } catch (e) {
        console.error('Erro:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
