import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fabrics } from '@/lib/fabrics';

export async function GET() {
    try {
        let updatedCount = 0;
        for (const f of fabrics) {
            await prisma.fabric.updateMany({
                where: { name: f.name },
                data: {
                    placeholderImage: f.placeholderImage,
                    colors: Array.isArray(f.colors) ? f.colors.join(',') : f.colors,
                    benefits: Array.isArray(f.benefits) ? f.benefits.join(',') : f.benefits,
                }
            });
            updatedCount++;
        }

        return NextResponse.json({ success: true, updated: updatedCount, message: "Database synchronized with fabrics.ts" });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to sync fabrics' }, { status: 500 });
    }
}
