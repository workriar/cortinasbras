�import { NextResponse } from "next/server";
import { getDb } from "@/services/db";
import { generateOrcamentoPdf } from "@/services/pdf";
import { sendEmailWithPdf } from "@/services/email";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Recebendo lead:", data);

        const db = await getDb();
        console.log("Banco de dados conectado");

        // Helper to parse float with comma
        const parseValue = (val: any) => {
            if (!val) return 0;
            return parseFloat(String(val).replace(",", "."));
        };

        // 1. Salvar no Banco
        console.log("Salvando no banco...");
        const result = await db.run(
            `INSERT INTO leads (nome, telefone, largura_parede, altura_parede, tecido, instalacao, observacoes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nome || "Sem Nome",
                data.telefone || "Sem Telefone",
                parseValue(data.largura_parede),
                parseValue(data.altura_parede),
                data.tecido || "Não especificado",
                data.instalacao || "Não especificado",
                data.observacoes || "",
            ]
        );

        const leadId = result.lastID;
        const lead = { id: leadId, ...data };
        console.log(`Lead #${leadId} salvo`);

        // 2. Gerar PDF
        console.log("Gerando PDF...");
        const pdfBuffer = await generateOrcamentoPdf(lead);
        console.log("PDF Gerado");

        // 3. Enviar E-mail (Async)
        try {
            console.log("Enviando e-mail...");
            await sendEmailWithPdf(lead, pdfBuffer);
            console.log("E-mail enviado");
        } catch (mailError) {
            console.error("Erro ao enviar e-mail:", mailError);
        }

        // 4. Gerar Link do WhatsApp
        const message = `Olá, meu nome é ${data.nome}. Fiz um orçamento no site (ID #${leadId}).\n\n*Medidas:* ${data.largura_parede}m x ${data.altura_parede}m\n*Tecido:* ${data.tecido}\n\nGostaria de prosseguir com o atendimento.`;
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/5511992891070?text=${encodedMessage}`;

        return NextResponse.json({
            status: "success",
            lead_id: leadId,
            whatsapp_url: waUrl,
        });
    } catch (error: any) {
        console.error("EXCEÇÃO NA API DE LEADS:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            name: error.name,
            stack: error.stack
        }, { status: 500 });
    }
}
�"(3aaa15f6da881e5e1c3f791e24c6d9b44e38731220file:///root/next-app/src/app/api/leads/route.ts:file:///root