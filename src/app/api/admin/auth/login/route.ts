import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Credenciais do admin (em produção, usar variáveis de ambiente)
        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cortinas2024';

        // Verificar credenciais
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Gerar token (hash simples para esta implementação)
            const token = process.env.ADMIN_TOKEN_HASH || 'admin-secret-2024';

            // Criar resposta com cookie
            const response = NextResponse.json({
                success: true,
                message: 'Login realizado com sucesso',
            });

            // Definir cookie seguro (httpOnly, secure em produção)
            response.cookies.set('admin-auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 dias
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Credenciais inválidas' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json(
            { success: false, message: 'Erro no servidor' },
            { status: 500 }
        );
    }
}
