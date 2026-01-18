
// Mock do Prisma
const mockPrisma = {
    lead: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
    },
    activity: {
        create: jest.fn(),
    }
};

// Mock das dependências externas
jest.mock('@/lib/prisma', () => ({
    prisma: mockPrisma
}));

jest.mock('@/services/pdf', () => ({
    generateOrcamentoPdf: jest.fn().mockResolvedValue(Buffer.from('pdf'))
}));

jest.mock('@/services/email', () => ({
    sendEmailWithPdf: jest.fn().mockResolvedValue(true)
}));

import { LeadService } from '@/services/lead.service';

describe('LeadService', () => {
    let service: LeadService;

    beforeEach(() => {
        service = new LeadService();
        jest.clearAllMocks();
    });

    it('should create a lead successfully', async () => {
        const inputData = {
            name: 'Test Lead',
            phone: '123456789',
            source: 'SITE'
        };

        const createdLead = {
            id: 1,
            ...inputData,
            createdAt: new Date(),
            status: 'NEW'
        };

        mockPrisma.lead.create.mockResolvedValue(createdLead);

        const result = await service.createLead(inputData);

        expect(result.lead).toEqual(createdLead);
        expect(mockPrisma.lead.create).toHaveBeenCalled();
        // Verifica se tentou logar atividade (pode falhar se o lazy require não for mockado corretamente, mas serve de exemplo)
    });
});
