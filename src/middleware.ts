import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const role = token?.role as string | undefined;

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

    // Redireciona qualquer rota /admin para /dashboard (fallback for admins)
    // (mantido para compatibilidade, mas já tratado acima)
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
