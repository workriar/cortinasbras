// src/lib/auth.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Returns the role stored in the JWT token (or undefined).
 */
export async function getUserRole(request: NextRequest): Promise<string | undefined> {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    return token?.role as string | undefined;
}

/**
 * Middleware helper to protect API routes.
 * Usage: in an API route, call `await requireRole(req, ['ADMIN'])`.
 */
export async function requireRole(request: NextRequest, allowed: string[]) {
    const role = await getUserRole(request);
    if (!role) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!allowed.includes(role)) {
        return new NextResponse('Forbidden', { status: 403 });
    }
    return null; // ok
}
