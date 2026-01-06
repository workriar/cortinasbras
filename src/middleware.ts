import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Verificar se é uma rota admin ou dashboard (exceto login)
    if ((request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard')) && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const authToken = request.cookies.get('admin-auth-token');

        // Se não tiver token, redirecionar para login
        if (!authToken) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verificar se o token é válido (hash simples)
        const validToken = process.env.ADMIN_TOKEN_HASH || 'admin-secret-2024';

        if (authToken.value !== validToken) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*'],
};
