import { LeadRepository } from '@/repositories/lead.repository';
import { Prisma, Lead } from '@prisma/client';
import { generateOrcamentoPdf } from '@/services/pdf';
import { sendEmailWithPdf } from '@/services/email';

export class LeadService {
    private leadRepository: LeadRepository;

    constructor() {
        this.leadRepository = new LeadRepository();
    }

    async createLead(inputData: any): Promise<{ lead: Lead, pdfBuffer?: Buffer }> {
        // 1. Normalização de dados
        const parseValue = (val: any) => {
            if (!val) return null;
            return parseFloat(String(val).replace(",", "."));
        };

        const parsedData: Prisma.LeadCreateInput = {
            name: inputData.name || inputData.nome || "Sem Nome",
            phone: inputData.phone || inputData.telefone || "0000000000",
            email: inputData.email || null,
            city: inputData.city || inputData.cidade_bairro || "Não especificado",
            width: parseValue(inputData.width || inputData.largura_parede),
            height: parseValue(inputData.height || inputData.altura_parede),
            fabric: inputData.fabric || inputData.tecido || null,
            installation: inputData.installation || inputData.instalacao || null,
            notes: inputData.notes || inputData.observacoes || "",
            source: inputData.source || inputData.origem || "SITE",
            status: inputData.status ? String(inputData.status).toUpperCase() : "NEW",

            // Novos Mapping
            type: inputData.tipo_cortina || null,
            space: inputData.espaco_cortina || null,
            translucency: inputData.translucidez || null,
            lining: inputData.forro || null,
            address: inputData.city || inputData.cidade_bairro || "Não especificado",
        };

        // 2. Persistência
        const lead = await this.leadRepository.create(parsedData);

        // 3. Log de atividade (async fire-and-forget idealmente, mas await aqui por segurança)
        await this.logActivity(lead.id, 'CREATED', `Lead criado via ${parsedData.source}`);

        // 4. PDF e Email (Opcional: processar em background queue no futuro)
        let pdfBuffer: Buffer | undefined;
        try {
            console.log(`[LeadService] Gerando PDF para Lead #${lead.id}...`);
            const leadForPdf = {
                id: lead.id,
                nome: lead.name,
                telefone: lead.phone,
                cidade_bairro: lead.city,
                largura_parede: lead.width,
                altura_parede: lead.height,
                tecido: lead.fabric,
                instalacao: lead.installation,
                observacoes: lead.notes,
                tipo_cortina: lead.type,
                espaco_cortina: lead.space,
                translucidez: lead.translucency,
                forro: lead.lining,
                ...inputData
            };

            pdfBuffer = await generateOrcamentoPdf(leadForPdf);

            if (pdfBuffer) {
                console.log(`[LeadService] Enviando email para Lead #${lead.id}...`);
                // Enviar sem await para não bloquear o retorno da API se for critico tempo
                // Mas aqui vamos aguardar para garantir feedback
                await sendEmailWithPdf(leadForPdf, pdfBuffer).catch(err =>
                    console.error("[LeadService] Falha no envio de email:", err)
                );
            }
        } catch (error) {
            console.error("[LeadService] Falha na geração de PDF/Email:", error);
            // Não falhamos a criação do lead só por causa do PDF
        }

        return { lead, pdfBuffer };
    }

    async updateStatus(leadId: number, status: string, userId?: number): Promise<Lead> {
        const lead = await this.leadRepository.update(leadId, { status });

        await this.logActivity(leadId, 'STATUS_CHANGED', `Status alterado para ${status}`, userId);

        return lead;
    }

    async getLeads(filters: any, pagination?: { skip: number, take: number }) {
        const where: any = {};
        if (filters.status) {
            where.status = { equals: filters.status };
        }

        const [leads, total] = await Promise.all([
            this.leadRepository.findAll({
                where,
                orderBy: { createdAt: 'desc' },
                skip: pagination?.skip,
                take: pagination?.take
            }),
            this.leadRepository.count(where)
        ]);

        return { leads, total };
    }

    // Helper privado para logging
    private async logActivity(leadId: number, type: string, description: string, userId?: number) {
        const { prisma } = require('@/lib/prisma');
        try {
            await prisma.activity.create({
                data: {
                    type,
                    description,
                    leadId,
                    userId
                }
            });
        } catch (e) {
            console.warn("[LeadService] Falha ao logar atividade (possivelmente tabela ainda não criada):", e);
        }
    }
}

export const leadService = new LeadService();
