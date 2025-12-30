import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { query } from "@/services/db-postgres";
import { generateOrcamentoPdf } from "@/services/pdf";
import { sendEmailWithPdf } from "@/services/email";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log("Recebendo lead (Prisma):", data);

        // Helper to parse float with comma
        const parseValue = (val: any) => {
            if (!val) return null;
            return parseFloat(String(val).replace(",", "."));
        };

        // 1. Salvar no Banco via Prisma (Mapeado automaticamente para 'leads')
        console.log("Salvando no banco...");
        // 1. Salvar no Banco via SQL DIRETO (Mais robusto para banco legado)
        console.log("Salvando no banco via SQL Direto...");

        const nome = data.name || data.nome || "Sem Nome";
        const telefone = data.phone || data.telefone || "0000000000";
        const email = data.email || null;
        const cidade = data.city || data.cidade_bairro || "Não especificado";
        const largura = parseValue(data.width || data.largura_parede);
        const altura = parseValue(data.height || data.altura_parede);
        const tecido = data.fabric || data.tecido || null;
        const instalacao = data.installation || data.instalacao || null;
        const obs = data.notes || data.observacoes || "";
        const origem = data.source || data.origem || "SITE";
        const status = data.status ? String(data.status).toUpperCase() : "NEW";

        const insertQuery = `
            INSERT INTO leads (
                nome, telefone, email, cidade_bairro, 
                largura_parede, altura_parede, tecido, instalacao, 
                observacoes, origem, status, criado_em, atualizado_em
            ) VALUES (
                $1, $2, $3, $4, 
                $5, $6, $7, $8, 
                $9, $10, $11, NOW(), NOW()
            )
            RETURNING id, nome as name, telefone as phone, cidade_bairro as city
        `;

        const result = await query(insertQuery, [
            nome, telefone, email, cidade,
            largura, altura, tecido, instalacao,
            obs, origem, status
        ]);

        const lead = {
            id: result.rows[0].id,
            name: nome,
            phone: telefone,
            email: email,
            city: cidade,
            width: largura,
            height: altura,
            fabric: tecido,
            installation: instalacao,
            notes: obs,
            source: origem,
            status: status
        };

        console.log(`Lead #${lead.id} salvo`);

        // 2. Gerar PDF e resto do fluxo...
        console.log("Gerando PDF...");

        const leadForPdf = {
            id: lead.id,
            nome: lead.name,
            telefone: lead.phone,
            cidade_bairro: lead.city,
            // @ts-ignore
            largura_parede: lead.width,
            // @ts-ignore
            altura_parede: lead.height,
            // @ts-ignore
            tecido: lead.fabric,
            // @ts-ignore
            instalacao: lead.installation,
            observacoes: lead.notes,
            ...data // garante campos originais
        };

        const pdfBuffer = await generateOrcamentoPdf(leadForPdf);
        console.log("PDF Gerado");

        // 3. Enviar E-mail (Async)
        try {
            console.log("Enviando e-mail...");
            await sendEmailWithPdf(leadForPdf, pdfBuffer);
            console.log("E-mail enviado");
        } catch (mailError) {
            console.error("Erro ao enviar e-mail:", mailError);
        }

        // 4. Gerar Link do WhatsApp
        const originHeader = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const siteUrl = originHeader.replace(/\/$/, "");
        const pdfUrl = `${siteUrl}/api/leads/${lead.id}/pdf`;

        // @ts-ignore
        const message = `Olá, meu nome é ${lead.name}. Fiz um orçamento no site (ID #${lead.id}).\n\n*Localização:* ${lead.city}\n*Medidas:* ${lead.width || 'N/A'}m x ${lead.height || 'N/A'}m\n*Tecido:* ${lead.fabric}\n\n*Veja meu orçamento:* ${pdfUrl}\n\nGostaria de prosseguir com o atendimento.`;
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/5511992891070?text=${encodedMessage}`;

        return NextResponse.json({
            status: "success",
            lead_id: lead.id,
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
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        console.log(`Buscando leads (SQL Direto) status=${status || 'todos'}...`);

        let sql = `SELECT * FROM leads`;
        const params: any[] = [];

        if (status) {
            sql += ` WHERE status ILIKE $1`;
            params.push(status);
        }

        sql += ` ORDER BY criado_em DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const res = await query(sql, params);

        // Count query
        const countSql = status
            ? `SELECT count(*) FROM leads WHERE status ILIKE $1`
            : `SELECT count(*) FROM leads`;
        const countParams = status ? [status] : [];
        const countRes = await query(countSql, countParams);
        const total = parseInt(countRes.rows[0].count);

        const normalizeStatus = (s: string) => {
            if (!s) return 'NEW';
            const upper = String(s).toUpperCase();
            if (['NEW', 'CONTACTED', 'PROPOSAL', 'CLOSED_WON', 'CLOSED_LOST'].includes(upper)) return upper;
            if (upper.includes('NOVO') || upper === '7' || upper === '1') return 'NEW';
            if (upper.includes('CONTAT')) return 'CONTACTED';
            if (upper.includes('PROPOST')) return 'PROPOSAL';
            if (upper.includes('FECHAD') || upper === 'GANHO') return 'CLOSED_WON';
            return 'NEW';
        };

        const leads = res.rows.map((row: any) => ({
            id: row.id,
            name: row.nome || "Sem Nome",
            phone: row.telefone || "Sem Telefone",
            email: row.email || null,
            city: row.cidade_bairro || "",
            source: row.origem || "SITE",
            status: normalizeStatus(row.status),
            notes: row.observacoes || "",
            createdAt: row.criado_em,
            updatedAt: row.atualizado_em,
            // Campos extras
            width: row.largura_parede,
            height: row.altura_parede,
            fabric: row.tecido,
            installation: row.instalacao
        }));

        return NextResponse.json({
            leads,
            total,
            limit,
            offset
        });

    } catch (error: any) {
        console.error("Erro SQL Leads:", error);
        return NextResponse.json({
            leads: [],
            total: 0,
            error: error.message
        }, { status: 500 });
    }
}
