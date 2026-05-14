import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const fabric = await prisma.fabric.findUnique({
            where: { id: parseInt(params.id) }
        });
        if (!fabric) return NextResponse.json({ error: 'Fabric not found' }, { status: 404 });
        return NextResponse.json(fabric);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fabric' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { name, category, description, altText, colors, benefits, exclusive, placeholderImage } = body;

        const fabric = await prisma.fabric.update({
            where: { id: parseInt(params.id) },
            data: {
                name,
                category,
                description,
                altText,
                colors: Array.isArray(colors) ? colors.join(',') : colors,
                benefits: Array.isArray(benefits) ? benefits.join(',') : benefits,
                exclusive: Boolean(exclusive),
                placeholderImage,
            }
        });

        return NextResponse.json(fabric);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update fabric' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.fabric.delete({
            where: { id: parseInt(params.id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete fabric' }, { status: 500 });
    }
}
