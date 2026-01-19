import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { whatsAppService } from '@/services/whatsapp.service';
import { notifyNewWhatsAppMessage } from '@/lib/socket-emitter';

/**
 * POST /api/webhooks/whatsapp
 * Webhook para receber mensagens do Twilio WhatsApp Business API
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Parse do body (Twilio envia como form-data)
        const formData = await req.formData();
        const body: any = {};
        formData.forEach((value, key) => { body[key] = value });

        console.log("[WhatsApp Webhook] Mensagem recebida:", {
            from: body.From,
            messageSid: body.MessageSid,
            timestamp: new Date().toISOString()
        });

        // 2. Validação de segurança (Twilio Signature)
        // TODO: Implementar validação completa em produção
        // const signature = req.headers.get('x-twilio-signature');
        // const url = req.url;
        // if (!whatsAppService.validateRequest(url, body, signature || '')) {
        //     console.error("[WhatsApp Webhook] Invalid signature");
        //     return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        // }

        const from = body.From; // ex: whatsapp:+551199999999
        const content = body.Body;
        const messageSid = body.MessageSid;
        const profileName = body.ProfileName;
        const mediaUrl = body.MediaUrl0; // Se houver mídia anexada

        if (!from || !content) {
            console.error("[WhatsApp Webhook] Missing required fields");
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Limpar número de telefone
        const phoneClean = from.replace('whatsapp:+', '').replace('whatsapp:', '').replace(/\D/g, '');

        // 4. Buscar ou criar lead
        let lead = await prisma.lead.findFirst({
            where: {
                OR: [
                    { phone: phoneClean },
                    { phone: { contains: phoneClean.slice(-8) } } // Match últimos 8 dígitos
                ]
            },
            include: {
                messages: {
                    where: { type: 'WHATSAPP' },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        const isNewLead = !lead;

        if (!lead) {
            console.log("[WhatsApp Webhook] Criando novo lead via WhatsApp");
            lead = await prisma.lead.create({
                data: {
                    name: profileName || `Cliente WhatsApp ${phoneClean.slice(-4)}`,
                    phone: phoneClean,
                    source: "WHATSAPP",
                    status: "NEW",
                    notes: "Criado automaticamente via mensagem WhatsApp recebida."
                },
                include: {
                    messages: true
                }
            });

            // Criar atividade de criação
            await prisma.activity.create({
                data: {
                    type: 'CREATED',
                    description: 'Lead criado automaticamente via WhatsApp',
                    leadId: lead.id,
                    metadata: JSON.stringify({
                        source: 'whatsapp_webhook',
                        phone: phoneClean
                    })
                }
            });
        }

        // 5. Salvar mensagem no banco
        const savedMessage = await prisma.message.create({
            data: {
                content: content,
                type: "WHATSAPP",
                whatsappId: messageSid,
                senderId: null, // Mensagem do cliente (externo)
                leadId: lead.id,
                read: false,
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

        console.log("[WhatsApp Webhook] Mensagem salva:", savedMessage.id);

        // 6. Emitir evento Socket.IO para atualização em tempo real
        notifyNewWhatsAppMessage(lead.id, savedMessage);

        // 7. Bot de Auto-Resposta
        const shouldAutoReply = await shouldSendAutoReply(lead, content);

        if (shouldAutoReply) {
            const autoReplyMessage = getAutoReplyMessage(content, isNewLead);

            try {
                await whatsAppService.sendMessage(from, autoReplyMessage);

                // Salvar auto-resposta no banco
                await prisma.message.create({
                    data: {
                        content: autoReplyMessage,
                        type: "WHATSAPP",
                        senderId: 1, // Sistema/Bot
                        leadId: lead.id,
                        read: true,
                    }
                });

                console.log("[WhatsApp Webhook] Auto-resposta enviada");
            } catch (error) {
                console.error("[WhatsApp Webhook] Erro ao enviar auto-resposta:", error);
            }
        }

        // 8. Criar atividade
        await prisma.activity.create({
            data: {
                type: 'WHATSAPP_SENT',
                description: 'Mensagem recebida via WhatsApp',
                leadId: lead.id,
                metadata: JSON.stringify({
                    messageId: savedMessage.id,
                    preview: content.substring(0, 100),
                    hasMedia: !!mediaUrl
                })
            }
        });

        // Resposta TwiML vazia (sucesso)
        return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (error: any) {
        console.error("[WhatsApp Webhook] Erro:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Determina se deve enviar auto-resposta
 */
async function shouldSendAutoReply(lead: any, content: string): Promise<boolean> {
    // Não responder se já houver mensagem recente do sistema (últimos 5 minutos)
    const recentSystemMessage = lead.messages?.find((msg: any) =>
        msg.senderId !== null &&
        new Date(msg.createdAt).getTime() > Date.now() - 5 * 60 * 1000
    );

    if (recentSystemMessage) {
        return false;
    }

    // Verificar horário comercial (8h - 18h, seg-sex)
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = domingo, 6 = sábado
    const isBusinessHours = day >= 1 && day <= 5 && hour >= 8 && hour < 18;

    // Auto-responder fora do horário ou primeira mensagem
    return !isBusinessHours || lead.messages.length === 0;
}

/**
 * Gera mensagem de auto-resposta baseada no contexto
 */
function getAutoReplyMessage(content: string, isNewLead: boolean): string {
    const contentLower = content.toLowerCase();

    // Saudação para novo lead
    if (isNewLead) {
        return "Olá! 👋 Bem-vindo à Cortinas Brás! Recebemos sua mensagem e em breve um de nossos consultores irá atendê-lo. Como podemos ajudá-lo hoje?";
    }

    // Respostas específicas por palavra-chave
    if (contentLower.includes('orçamento') || contentLower.includes('preço') || contentLower.includes('valor')) {
        return "Olá! Para fazer um orçamento personalizado, por favor nos informe:\n\n📏 Medidas da janela\n🎨 Tipo de cortina desejada\n📍 Localização\n\nOu acesse nosso site: https://cortinasbras.com.br/";
    }

    if (contentLower.includes('horário') || contentLower.includes('atendimento')) {
        return "Nosso horário de atendimento é:\n⏰ Segunda a Sexta: 8h às 18h\n⏰ Sábado: 8h às 12h\n\nEm breve retornaremos seu contato!";
    }

    if (contentLower.includes('endereço') || contentLower.includes('localização') || contentLower.includes('onde')) {
        return "📍 Estamos localizados no Brás, São Paulo.\n\nEntre em contato para agendar uma visita ou receber um orçamento!";
    }

    // Resposta padrão
    return "Olá! Recebemos sua mensagem. Um de nossos consultores irá atendê-lo em breve. Obrigado pelo contato! 😊";
}

