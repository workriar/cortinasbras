import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { whatsAppService } from '@/services/whatsapp.service';

/**
 * GET /api/whatsapp/messages/[leadId]
 * Busca todas as mensagens do WhatsApp de um lead específico
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ leadId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { leadId: leadIdStr } = await context.params;
        const leadId = parseInt(leadIdStr);

        if (isNaN(leadId)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        // Buscar lead
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        // Buscar mensagens
        const messages = await prisma.message.findMany({
            where: {
                leadId: leadId,
                type: 'WHATSAPP'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Marcar mensagens como lidas
        await prisma.message.updateMany({
            where: {
                leadId: leadId,
                type: 'WHATSAPP',
                read: false
            },
            data: {
                read: true
            }
        });

        return NextResponse.json({
            lead,
            messages,
            total: messages.length
        });

    } catch (error: any) {
        console.error('Erro ao buscar mensagens:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar mensagens', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/whatsapp/messages/[leadId]
 * Envia uma mensagem do WhatsApp para um lead
 */
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ leadId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { leadId: leadIdStr } = await context.params;
        const leadId = parseInt(leadIdStr);
        const { content } = await req.json();

        if (isNaN(leadId) || !content?.trim()) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        // Buscar lead
        const lead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        // Buscar usuário atual
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Enviar mensagem via WhatsApp
        try {
            await whatsAppService.sendMessage(lead.phone, content);
        } catch (whatsappError: any) {
            console.error('Erro ao enviar WhatsApp:', whatsappError);
            // Continua mesmo se falhar o envio, para salvar no banco
        }

        // Salvar mensagem no banco
        const message = await prisma.message.create({
            data: {
                content,
                type: 'WHATSAPP',
                senderId: user.id,
                leadId: leadId,
                read: true
            },
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
        });

        // Criar atividade
        await prisma.activity.create({
            data: {
                type: 'WHATSAPP_SENT',
                description: `Mensagem enviada via WhatsApp`,
                leadId: leadId,
                userId: user.id,
                metadata: JSON.stringify({
                    preview: content.substring(0, 100)
                })
            }
        });

        return NextResponse.json({
            success: true,
            message
        });

    } catch (error: any) {
        console.error('Erro ao enviar mensagem:', error);
        return NextResponse.json(
            { error: 'Erro ao enviar mensagem', details: error.message },
            { status: 500 }
        );
    }
}
