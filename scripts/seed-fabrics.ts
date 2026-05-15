import { PrismaClient } from '@prisma/client';
import { fabrics } from '../src/lib/fabrics';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding fabrics...');
    for (const fabric of fabrics) {
        const exists = await prisma.fabric.findFirst({
            where: { name: fabric.name }
        });

        if (!exists) {
            await prisma.fabric.create({
                data: {
                    name: fabric.name,
                    category: fabric.category,
                    description: fabric.description,
                    altText: fabric.altText || fabric.name,
                    colors: fabric.colors.join(','),
                    benefits: fabric.benefits.join(','),
                    exclusive: fabric.exclusive || false,
                    placeholderImage: fabric.placeholderImage,
                }
            });
            console.log(`Seeded: ${fabric.name}`);
        } else {
            console.log(`Skipping: ${fabric.name} (already exists)`);
        }
    }
    console.log('Fabrics seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
