import { NextResponse } from 'next/server';

// Hardcoded users for demonstration purposes
const users = {
    superadmin: { password: 'admin123', role: 'superadmin' },
    vendedor: { password: 'user123', role: 'vendedor' },
};

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const user = (users as any)[username];
        if (!user || user.password !== password) {
            return NextResponse.json({ status: 'error', message: 'Invalid credentials' }, { status: 401 });
        }
        // In a real app you would issue a JWT or session cookie. Here we just return the role.
        return NextResponse.json({ status: 'success', role: user.role });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
