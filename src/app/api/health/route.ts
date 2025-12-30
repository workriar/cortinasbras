import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'API de teste funcionando',
        env: {
            hasDatabase: !!process.env.DATABASE_URL,
            hasNextAuth: !!process.env.NEXTAUTH_SECRET,
            nodeEnv: process.env.NODE_ENV
        }
    });
}
