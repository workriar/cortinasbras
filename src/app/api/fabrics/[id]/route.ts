import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Next.js 15: params deve ser Promise<{ id: string }>
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        const fabric = await prisma.fabric.findUnique({
            where: { id: parseInt(id) }
        });
        if (!fabric) return NextResponse.json({ error: 'Fabric not found' }, { status: 404 });
        return NextResponse.json(fabric);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fabric' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, category, description, altText, colors, benefits, exclusive, placeholderImage } = body;

        const fabric = await prisma.fabric.update({
            where: { id: parseInt(id) },
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

export async function DELETE(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        await prisma.fabric.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete fabric' }, { status: 500 });
    }
}
