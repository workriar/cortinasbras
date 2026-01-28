import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');

        if (action === 'clean') {
            // Limpar leads de teste
            const deleted = await prisma.lead.deleteMany({
                where: {
                    OR: [
                        { name: { contains: 'Teste', mode: 'insensitive' } },
                        { name: { contains: 'Debug', mode: 'insensitive' } },
                        { status: 'NEW', phone: '', email: null } // Leads vazios
                    ]
                }
            });
            return NextResponse.json({
                success: true,
                message: `Limpeza concluída. ${deleted.count} leads removidos.`
            });
        }

        // Ação padrão: Verificar/Reparar
        // No Postgres com Prisma, a consistência é garantida pelo schema, 
        // mas podemos verificar se há leads sem Owner e atribuir ao admin.

        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        let repairs = [];

        if (admin) {
            const orphanLeads = await prisma.lead.updateMany({
                where: { ownerId: null },
                data: { ownerId: admin.id }
            });
            if (orphanLeads.count > 0) {
                repairs.push(`${orphanLeads.count} leads órfãos atribuídos ao admin.`);
            }
        }

        // Exemplo de outra correção: normalizar status se necessário
        // (Aqui assumimos que o banco está saudável pois é novo)

        const totalLeads = await prisma.lead.count();

        return NextResponse.json({
            success: true,
            message: `Diagnóstico concluído. Total de leads: ${totalLeads}.`,
            repairs_applied: repairs
        });

    } catch (error) {
        console.error('[DEBUG-LEADS] Error:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
