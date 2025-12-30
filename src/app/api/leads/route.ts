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
        const lead = await prisma.lead.create({
            data: {
                name: data.nome || "Sem Nome",
                phone: data.telefone || "Sem Telefone",
                email: data.email || null,
                city: data.cidade_bairro || "Não especificado",
                // @ts-ignore
                width: parseValue(data.largura_parede),
                // @ts-ignore
                height: parseValue(data.altura_parede),
                // @ts-ignore
                fabric: data.tecido || "Não especificado",
                // @ts-ignore
                installation: data.instalacao || "Não especificado",
                notes: data.observacoes || "",
                source: "SITE",
                status: "NEW"
            }
        });

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
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        const whereClause = status ? { status } : {};

        console.log(`Buscando leads (Prisma) status=${status || 'todos'}...`);
        let [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            }),
            prisma.lead.count({ where: whereClause })
        ]);

        // FALLBACK: Se o Prisma não retornou nada, vamos tentar SQL direto na tabela 'leads' antiga
        if (total === 0 && offset === 0) { // Só tenta fallback na pág 1 se vazio
            console.log("Prisma vazio. Tentando Fallback SQL direto...");
            try {
                let sql = `SELECT * FROM leads`;
                const params: any[] = []; // Explícito para evitar erro TS

                if (status) {
                    sql += ` WHERE status ILIKE $1`;
                    params.push(status);
                }

                sql += ` ORDER BY criado_em DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
                params.push(limit, offset);

                const res = await query(sql, params);

                if (res && res.rows.length > 0) {
                    leads = res.rows.map((row: any) => ({
                        id: row.id,
                        name: row.nome,
                        phone: row.telefone,
                        city: row.cidade_bairro,
                        status: row.status ? row.status.toUpperCase() : 'NEW',
                        source: row.origem || 'SITE',
                        notes: row.observacoes || '',
                        createdAt: row.criado_em,
                        updatedAt: row.atualizado_em || row.criado_em,
                        // Mapeia campos extras para evitar undefined
                        width: row.largura_parede,
                        height: row.altura_parede,
                        fabric: row.tecido,
                        installation: row.instalacao
                    })) as any;

                    // Contagem fallback
                    const countSql = status
                        ? `SELECT count(*) FROM leads WHERE status ILIKE $1`
                        : `SELECT count(*) FROM leads`;
                    const countParams = status ? [status] : [];
                    const countRes = await query(countSql, countParams);
                    total = parseInt(countRes.rows[0].count);

                    console.log(`Fallback SQL encontrou ${total} leads!`);
                }
            } catch (sqlError) {
                console.error("Erro no Fallback SQL:", sqlError);
            }
        }

        return NextResponse.json({
            leads,
            total,
            limit,
            offset,
        });
    } catch (error: any) {
        console.error("Erro ao buscar leads (Prisma):", error);
        return NextResponse.json({
            leads: [],
            total: 0,
            error: error.message
        }, { status: 500 });
    }
}
