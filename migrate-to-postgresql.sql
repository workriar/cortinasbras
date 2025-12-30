-- ============================================
-- Script Completo de Migração para PostgreSQL
-- Cortinas Brás - Todas as Tabelas do Prisma
-- ============================================

-- 1. Tabela User (já criada, mas vamos garantir)
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela Lead
CREATE TABLE IF NOT EXISTS "Lead" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(255),
    source VARCHAR(50) DEFAULT 'SITE',
    status VARCHAR(50) DEFAULT 'NEW',
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER,
    FOREIGN KEY ("ownerId") REFERENCES "User"(id)
);

-- 3. Tabela Interaction
CREATE TABLE IF NOT EXISTS "Interaction" (
    id SERIAL PRIMARY KEY,
    "leadId" INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("leadId") REFERENCES "Lead"(id) ON DELETE CASCADE
);

-- 4. Tabela Message
CREATE TABLE IF NOT EXISTS "Message" (
    id SERIAL PRIMARY KEY,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "leadId" INTEGER,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("senderId") REFERENCES "User"(id),
    FOREIGN KEY ("receiverId") REFERENCES "User"(id),
    FOREIGN KEY ("leadId") REFERENCES "Lead"(id)
);

-- 5. Criar índices para performance
CREATE INDEX IF NOT EXISTS "idx_lead_ownerId" ON "Lead"("ownerId");
CREATE INDEX IF NOT EXISTS "idx_lead_status" ON "Lead"(status);
CREATE INDEX IF NOT EXISTS "idx_lead_source" ON "Lead"(source);
CREATE INDEX IF NOT EXISTS "idx_lead_createdAt" ON "Lead"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_interaction_leadId" ON "Interaction"("leadId");
CREATE INDEX IF NOT EXISTS "idx_message_senderId" ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS "idx_message_receiverId" ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS "idx_message_leadId" ON "Message"("leadId");

-- 6. Inserir usuário admin (se não existir)
INSERT INTO "User" (email, name, "passwordHash", role)
VALUES (
    'admin@cortinasbras.com.br',
    'Administrador',
    '$2b$10$S.7Z7DqV8SNqkxP4rgY7XuCQ1TOZgodRX77ZojBsV5aw.aCKuCvd.',
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE
SET 
    name = EXCLUDED.name,
    "passwordHash" = EXCLUDED."passwordHash",
    role = EXCLUDED.role,
    "updatedAt" = CURRENT_TIMESTAMP;

-- 7. Verificar tabelas criadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 8. Verificar usuário admin
SELECT id, email, name, role, "createdAt" FROM "User" WHERE email = 'admin@cortinasbras.com.br';
