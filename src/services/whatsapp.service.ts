import twilio from 'twilio';

// Configuração condicionada à existência das chaves para evitar crash em build
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // ex: '+14155238886'

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

export class WhatsAppService {

    async sendMessage(to: string, content: string): Promise<any> {
        if (!client) {
            console.warn("Twilio client not initialized. Missing env vars.");
            return { sid: 'mock-sid', status: 'mock-sent' };
        }

        try {
            // Formatar número para garantir prefixo whatsapp:
            const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to.replace(/\D/g, '')}`;
            const fromFormatted = whatsappNumber?.startsWith('whatsapp:') ? whatsappNumber : `whatsapp:${whatsappNumber}`;

            const message = await client.messages.create({
                from: fromFormatted,
                to: toFormatted,
                body: content
            });

            return message;
        } catch (error) {
            console.error("Error sending WhatsApp message:", error);
            throw error;
        }
    }

    async sendTemplate(to: string, templateSid: string, variables: any): Promise<any> {
        // Implementação avançada de templates (Content API do Twilio)
        // Por enquanto simplificado como texto normal simulando template
        // TODO: Migrar para Twilio Content API se necessário

        console.log(`Sending template ${templateSid} to ${to} with vars`, variables);
        // Fallback temporário
        return this.sendMessage(to, `[Template Model] ${JSON.stringify(variables)}`);
    }

    // Validação de assinatura do Webhook (segurança)
    validateRequest(url: string, params: any, signature: string): boolean {
        if (!process.env.TWILIO_AUTH_TOKEN) return true; // Bypass em dev sem token
        return twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, signature, url, params);
    }
}

export const whatsAppService = new WhatsAppService();
