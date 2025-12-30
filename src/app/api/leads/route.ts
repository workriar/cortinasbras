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

        // 1. Salvar no Banco PostgreSQL (Usando nomes do Prisma)
        console.log("Salvando no banco...");
        // IMPORTANTE: Tabela "Lead" com aspas e colunas em inglês para bater com Prisma
        const result = await query(
            `INSERT INTO "Lead" (name, phone, city, source, status, notes) 
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [
                data.nome || "Sem Nome",
                data.telefone || "Sem Telefone",
                data.cidade_bairro || "Não especificado",
                "SITE", // source
                "NEW",  // status (Garante que caia na aba Novos)
                `Largura: ${data.largura_parede || '?'}m, Altura: ${data.altura_parede || '?'}m, Tecido: ${data.tecido || '?'}, Obs: ${data.observacoes || ''}` // notes (agrupando dados extras no notes por enquanto, ou podemos adicionar as colunas no banco se existirem)
            ]
        );

        /* 
           NOTA: O schema Prisma original tem campos específicos (largura_parede, etc) que não existem no schema padrão do script migrate-to-postgresql.sql que fizemos.
           Se quisermos manter esses campos, precisamos adicionar colunas extras na tabela "Lead" ou salvar como JSON/Texto em notes.
           Pelo script migrate-to-postgresql.sql, a tabela "Lead" tem:
           id, name, phone, email, city, source, status, notes...
           
           Vou salvar os detalhes técnicos em 'notes' para garantir compatibilidade com o script que rodamos.
        */

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

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        let queryText = `
      SELECT id, name, phone, city, status, source, notes, "createdAt", "updatedAt"
      FROM "Lead"
    `;
        const params: any[] = [];

        if (status) {
            queryText += ` WHERE status = $1`;
            params.push(status);
            queryText += ` ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`;
            params.push(limit, offset);
        } else {
            queryText += ` ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`;
            params.push(limit, offset);
        }

        const result = await query(queryText, params);
        const countResult = await query(
            status ? `SELECT COUNT(*) FROM "Lead" WHERE status = $1` : `SELECT COUNT(*) FROM "Lead"`,
            status ? [status] : []
        );

        const mappedLeads = result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            city: row.city,
            status: row.status,
            source: row.source,
            notes: row.notes,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        }));

        return NextResponse.json({
            leads: mappedLeads,
            total: parseInt(countResult.rows[0].count),
            limit,
            offset,
        });
    } catch (error: any) {
        console.error("Erro ao buscar leads (fallback):", error);
        return NextResponse.json({
            leads: [],
            total: 0,
            limit: 0,
            offset: 0,
            fallback: true,
            message: error.message ?? "Erro ao buscar leads",
        }, { status: 200 });
    }
}
