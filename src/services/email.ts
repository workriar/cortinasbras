import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmailWithPdf(lead: any, pdfBuffer: Buffer) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER || "smtp.hostinger.com",
        port: Number(process.env.MAIL_PORT) || 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_DEFAULT_SENDER || process.env.MAIL_USERNAME,
        to: process.env.MAIL_NOTIFICATION_TO || "loja@cortinasbras.com.br",
        subject: `🏠 Novo Orçamento #${lead.id} - ${lead.nome}`,
        text: `Olá, uma nova solicitação de orçamento foi recebida.\n\nNome: ${lead.nome}\nTelefone: ${lead.telefone}\n\nVeja o PDF em anexo para mais detalhes.`,
        html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #D4A93E; border-radius: 10px;">
        <h2 style="color: #D4A93E;">Novo Orçamento Recebido</h2>
        <p><strong>Nome:</strong> ${lead.nome}</p>
        <p><strong>Telefone:</strong> ${lead.telefone}</p>
        <p><strong>Medidas:</strong> ${lead.largura_parede}m x ${lead.altura_parede}m</p>
        <hr />
        <p>O orçamento detalhado foi gerado e está anexado a este e-mail.</p>
      </div>
    `,
        attachments: [
            {
                filename: `orcamento_${lead.id}.pdf`,
                content: pdfBuffer,
            },
        ],
    };

    return transporter.sendMail(mailOptions);
}
export async function sendEmail(
    to: string,
    subject: string,
    html: string,
    attachment?: { filename: string; content: Buffer }
) {
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html,
        ...(attachment && { attachments: [{ filename: attachment.filename, content: attachment.content }] }),
    };
    await emailTransporter.sendMail(mailOptions);
}
