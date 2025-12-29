import { PrismaClient } from "@prisma/client";

// Instância singleton para evitar múltiplas conexões em dev
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    // @ts-ignore - global para hot reload no dev
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

export { prisma };
