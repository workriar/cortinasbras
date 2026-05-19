import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const fabrics = await prisma.fabric.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(fabrics);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fabrics' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, category, description, altText, colors, benefits, exclusive, placeholderImage, videoUrl } = body;

        const fabric = await prisma.fabric.create({
            data: {
                name,
                category,
                description,
                altText,
                colors: Array.isArray(colors) ? colors.join(',') : colors,
                benefits: Array.isArray(benefits) ? benefits.join(',') : benefits,
                exclusive: Boolean(exclusive),
                placeholderImage,
                videoUrl: videoUrl || "",
            }
        });

        return NextResponse.json(fabric);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create fabric' }, { status: 500 });
    }
}
