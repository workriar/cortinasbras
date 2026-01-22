import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const role = token?.role as string | undefined;

    // Rotas de dashboard exigem autenticação (qualquer usuário logado)
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!token) {
            // Redireciona para login se não autenticado
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        return NextResponse.next();
    }

    // Rotas de admin exigem role ADMIN
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (role !== 'ADMIN') {
            // redireciona para página de acesso negado ou login
            return NextResponse.redirect(new URL('/access-denied', request.url));
        }
        return NextResponse.next();
    }

    // Rotas de API admin exigem ADMIN
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        if (role !== 'ADMIN') {
            return new NextResponse('Forbidden', { status: 403 });
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*'],
};
