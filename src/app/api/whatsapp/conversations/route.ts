import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * GET /api/whatsapp/conversations
 * Lista todas as conversas do WhatsApp agrupadas por lead
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter') || 'all'; // all, unread, active
        const search = searchParams.get('search') || '';

        // Buscar leads que têm mensagens do WhatsApp
        const whereClause: any = {
            messages: {
                some: {
                    type: 'WHATSAPP'
                }
            }
        };

        // Filtro de busca por nome ou telefone
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } }
            ];
        }

        // Filtro de não lidas
        if (filter === 'unread') {
            whereClause.messages = {
                some: {
                    type: 'WHATSAPP',
                    read: false
                }
            };
        }

        // Filtro de ativas (com mensagem nos últimos 7 dias)
        if (filter === 'active') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            whereClause.messages = {
                some: {
                    type: 'WHATSAPP',
                    createdAt: {
                        gte: sevenDaysAgo
                    }
                }
            };
        }

        const conversations = await prisma.lead.findMany({
            where: whereClause,
            include: {
                messages: {
                    where: {
                        type: 'WHATSAPP'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1, // Última mensagem
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                type: 'WHATSAPP',
                                read: false
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Formatar resposta
        const formattedConversations = conversations.map(lead => ({
            leadId: lead.id,
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            status: lead.status,
            source: lead.source,
            owner: lead.owner,
            lastMessage: lead.messages[0] || null,
            unreadCount: lead._count.messages,
            updatedAt: lead.updatedAt
        }));

        return NextResponse.json({
            conversations: formattedConversations,
            total: formattedConversations.length
        });

    } catch (error: any) {
        console.error('Erro ao buscar conversas WhatsApp:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar conversas', details: error.message },
            { status: 500 }
        );
    }
}
