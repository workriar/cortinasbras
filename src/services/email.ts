import nodemailer from "nodemailer";

function createTransporter() {
    const host = process.env.MAIL_SERVER || process.env.SMTP_HOST || "smtp.hostinger.com";
    const port = Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 465);
    const user = process.env.MAIL_USERNAME || process.env.SMTP_USER;
    const pass = process.env.MAIL_PASSWORD || process.env.SMTP_PASS;
    const useSSL = process.env.MAIL_USE_SSL === 'true' || process.env.MAIL_USE_SSL === '1' || port === 465;

    if (!user || !pass) {
        console.warn("⚠️ Avisos de E-mail: Credenciais SMTP não configuradas corretamente.");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: useSSL,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

export async function sendEmailWithPdf(lead: any, pdfBuffer: Buffer) {
    const transporter = createTransporter();

    // Campos de fallback para evitar undefined no template
    const leadData = {
        nome: lead.nome || lead.name || 'Sem nome',
        telefone: lead.telefone || lead.phone || 'Sem telefone',
        cidade: lead.cidade_bairro || lead.city || 'Não informado',
        tipo: lead.tipo_cortina || lead.type || 'Não informado',
        espaco: lead.espaco_cortina || lead.space || 'Não informado',
        translucidez: lead.translucidez || lead.translucency || 'Não informado',
        forro: lead.forro || lead.lining || 'Não informado',
        tecido: lead.tecido || lead.fabric || 'Não informado',
        instalacao: lead.instalacao || lead.installation || 'Não informado',
        largura: lead.largura_parede || lead.width || '0',
        altura: lead.altura_parede || lead.height || '0',
        obs: lead.observacoes || lead.notes || '-'
    };

    const mailOptions = {
        from: `Cortinas Brás <${process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME}>`,
        to: process.env.MAIL_NOTIFICATION_TO || "loja@cortinasbras.com.br",
        subject: `🏠 Novo Orçamento #${lead.id} - ${leadData.nome}`,
        text: `Novo orçamento recebido de ${leadData.nome}. Verifique o anexo PDF.`,
        html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4A93E; border-radius: 10px; color: #333;">
        <h2 style="color: #D4A93E; margin-bottom: 20px;">Novo Orçamento Recebido</h2>
        
        <p><strong>Nome:</strong> ${leadData.nome}</p>
        <p><strong>Telefone:</strong> ${leadData.telefone}</p>
        <p><strong>Cidade:</strong> ${leadData.cidade}</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <h3 style="color: #666;">Detalhes do Pedido</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; width: 140px; font-weight: bold;">Modelo:</td>
                <td>${leadData.tipo}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Ambiente:</td>
                <td>${leadData.espaco}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Luminosidade:</td>
                <td>${leadData.translucidez}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Tecido:</td>
                <td>${leadData.tecido}</td>
            </tr>
             <tr>
                <td style="padding: 8px 0; font-weight: bold;">Instalação:</td>
                <td>${leadData.instalacao}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; font-weight: bold;">Medidas:</td>
                <td>${leadData.largura}m (L) x ${leadData.altura}m (A)</td>
            </tr>
        </table>

        <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <strong>Observações:</strong><br/>
            ${leadData.obs}
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">O PDF detalhado com o orçamento foi anexado a este e-mail.</p>
      </div>
    `,
        attachments: [
            {
                filename: `orcamento_${lead.id}.pdf`,
                content: pdfBuffer,
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Enviado para ${mailOptions.to}. ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("[Email] Erro ao enviar:", error);
        throw error;
    }
}

// Compatibilidade
export async function sendEmail(
    to: string,
    subject: string,
    html: string,
    attachment?: { filename: string; content: Buffer }
) {
    const transporter = createTransporter();
    const mailOptions: nodemailer.SendMailOptions = {
        from: `Cortinas Brás <${process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME}>`,
        to,
        subject,
        html,
        ...(attachment && { attachments: [{ filename: attachment.filename, content: attachment.content }] }),
    };
    await transporter.sendMail(mailOptions);
}
