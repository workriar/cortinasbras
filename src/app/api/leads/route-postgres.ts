import { NextResponse } from "next/server";
import { query } from "@/services/db-postgres";
import { generateOrcamentoPdf } from "@/services/pdf";
import { sendEmailWithPdf } from "@/services/email";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Recebendo lead:", data);

        // Helper to parse float with comma
        const parseValue = (val: any) => {
            if (!val) return null;
            return parseFloat(String(val).replace(",", "."));
        };

        // 1. Salvar no Banco PostgreSQL
        console.log("Salvando no banco...");
        const result = await query(
            `INSERT INTO leads (nome, telefone, cidade_bairro, largura_parede, altura_parede, tecido, instalacao, observacoes, origem) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id`,
            [
                data.nome || "Sem Nome",
                data.telefone || "Sem Telefone",
                data.cidade_bairro || "Não especificado",
                parseValue(data.largura_parede),
                parseValue(data.altura_parede),
                data.tecido || "Não especificado",
                data.instalacao || "Não especificado",
                data.observacoes || "",
                "site"
            ]
        );

        const leadId = result.rows[0].id;
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
        const originHeader = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const siteUrl = originHeader.replace(/\/$/, "");
        const pdfUrl = `${siteUrl}/api/leads/${leadId}/pdf`;
        const message = `Olá, meu nome é ${data.nome}. Fiz um orçamento no site (ID #${leadId}).\n\n*Localização:* ${data.cidade_bairro}\n*Medidas:* ${data.largura_parede || 'N/A'}m x ${data.altura_parede || 'N/A'}m\n*Tecido:* ${data.tecido}\n\n*Veja meu orçamento:* ${pdfUrl}\n\nGostaria de prosseguir com o atendimento.`;
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

// GET - Listar leads (para admin)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        let queryText = `
            SELECT id, nome, telefone, cidade_bairro, largura_parede, altura_parede, 
                   tecido, observacoes, status, origem, criado_em, atualizado_em
            FROM leads
        `;
        const params: any[] = [];

        if (status) {
            queryText += ` WHERE status = $1`;
            params.push(status);
            queryText += ` ORDER BY criado_em DESC LIMIT $2 OFFSET $3`;
            params.push(limit, offset);
        } else {
            queryText += ` ORDER BY criado_em DESC LIMIT $1 OFFSET $2`;
            params.push(limit, offset);
        }

        const result = await query(queryText, params);

        // Contar total
        const countResult = await query(
            status ? `SELECT COUNT(*) FROM leads WHERE status = $1` : `SELECT COUNT(*) FROM leads`,
            status ? [status] : []
        );

        return NextResponse.json({
            leads: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit,
            offset
        });
    } catch (error: any) {
        console.error("Erro ao buscar leads:", error);
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
}
