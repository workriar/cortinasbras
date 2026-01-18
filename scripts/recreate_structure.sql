-- Recriar tabelas complementares (User, Interaction, Message) que foram dropadas para limpeza
-- Compatível com Prisma Schema

-- Tabela User
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Interaction (Linkada a leads)
CREATE TABLE IF NOT EXISTS "Interaction" (
    id SERIAL PRIMARY KEY,
    "leadId" INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Interaction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES leads(id) ON DELETE CASCADE
);

-- Tabela Message (Chat interno e link com leads)
CREATE TABLE IF NOT EXISTS "Message" (
    id SERIAL PRIMARY KEY,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "leadId" INTEGER,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"(id),
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"(id),
    CONSTRAINT "Message_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES leads(id)
);

-- Índices (Prisma defaults)
CREATE INDEX IF NOT EXISTS "idx_interaction_leadId" ON "Interaction"("leadId");
CREATE INDEX IF NOT EXISTS "idx_message_senderId" ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS "idx_message_receiverId" ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS "idx_message_leadId" ON "Message"("leadId");

-- Restaurar Usuário Admin
INSERT INTO "User" (email, name, "passwordHash", role)
VALUES (
    'admin@cortinasbras.com.br',
    'Administrador',
    '$2b$10$S.7Z7DqV8SNqkxP4rgY7XuCQ1TOZgodRX77ZojBsV5aw.aCKuCvd.',
    'ADMIN'
)
ON CONFLICT (email) DO NOTHING;
