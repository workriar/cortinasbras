import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { getSqliteConnection } from '@/lib/sqlite';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');

        if (action === 'clean') {
            const deleted = await prisma.lead.deleteMany({
                where: {
                    OR: [
                        { name: { contains: 'Teste', mode: 'insensitive' } },
                        { name: { contains: 'Debug', mode: 'insensitive' } },
                        { status: 'NEW', phone: '', email: null }
                    ]
                }
            });
            return NextResponse.json({
                success: true,
                message: `Limpeza concluída. ${deleted.count} leads removidos.`
            });
        }

        // REAL RESTORATION LOGIC
        const dbPath = process.env.NODE_ENV === 'production'
            ? '/app/data/leads.db'
            : path.join(process.cwd(), 'data', 'leads.db');

        if (!fs.existsSync(dbPath)) {
            return NextResponse.json({
                success: false,
                error: `Arquivo de backup não encontrado em: ${dbPath}`
            }, { status: 404 });
        }

        let db;
        try {
            db = await getSqliteConnection(dbPath);
            const legacyLeads = await db.all('SELECT * FROM leads');

            let importedCount = 0;
            let skippedCount = 0;
            const repairs = [];

            const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

            for (const legacy of legacyLeads) {
                const existing = await prisma.lead.findFirst({
                    where: { phone: legacy.telefone }
                });

                if (existing) {
                    skippedCount++;
                    continue;
                }

                await prisma.lead.create({
                    data: {
                        name: legacy.nome || 'Desconhecido',
                        phone: legacy.telefone || 'Não informado',
                        email: legacy.email || null,
                        city: legacy.cidade_bairro || null,
                        width: legacy.largura_parede ? parseFloat(legacy.largura_parede) : null,
                        height: legacy.altura_parede ? parseFloat(legacy.altura_parede) : null,
                        fabric: legacy.tecido || null,
                        installation: legacy.instalacao || null,
                        notes: legacy.observacoes || null,
                        source: (legacy.origem || 'SITE').toUpperCase(),
                        status: (legacy.status || 'NEW').toUpperCase(),
                        createdAt: legacy.criado_em ? new Date(legacy.criado_em) : new Date(),
                        ownerId: admin?.id || null
                    }
                });
                importedCount++;
            }

            if (importedCount > 0) {
                repairs.push(`Importação concluída: ${importedCount} leads restaurados do backup SQLite.`);
            } else if (skippedCount > 0) {
                repairs.push(`Nenhum lead novo encontrado. ${skippedCount} leads já existiam no sistema.`);
            }

            return NextResponse.json({
                success: true,
                message: `Restauração finalizada. ${importedCount} novos leads importados.`,
                repairs_applied: repairs,
                details: {
                    imported: importedCount,
                    skipped: skippedCount
                }
            });

        } catch (sqliteError: any) {
            console.error('[DEBUG-LEADS] SQLite Error:', sqliteError);
            return NextResponse.json({
                success: false,
                error: `Erro ao ler banco de dados antigo: ${sqliteError.message}`
            }, { status: 500 });
        } finally {
            if (db) await db.close();
        }

    } catch (error: any) {
        console.error('[DEBUG-LEADS] Error:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
