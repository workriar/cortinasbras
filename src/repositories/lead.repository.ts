import { PrismaClient, Lead, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class LeadRepository {
    async create(data: Prisma.LeadCreateInput): Promise<Lead> {
        return prisma.lead.create({
            data,
        });
    }

    async findById(id: number): Promise<Lead | null> {
        return prisma.lead.findUnique({
            where: { id },
            include: {
                activities: {
                    orderBy: { createdAt: 'desc' }
                },
                messages: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.LeadWhereUniqueInput;
        where?: Prisma.LeadWhereInput;
        orderBy?: Prisma.LeadOrderByWithRelationInput;
    }): Promise<Lead[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return prisma.lead.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async update(id: number, data: Prisma.LeadUpdateInput): Promise<Lead> {
        return prisma.lead.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Lead> {
        return prisma.lead.delete({
            where: { id },
        });
    }

    async count(where?: Prisma.LeadWhereInput): Promise<number> {
        return prisma.lead.count({
            where,
        });
    }
}
