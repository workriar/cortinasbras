-- Script para criar usuário admin no PostgreSQL
-- Execute este script no pgAdmin ou no console do PostgreSQL

-- 1. Criar tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    "passwordHash" VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inserir usuário admin
-- Email: admin@cortinasbras.com.br
-- Senha: admin123
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

-- 3. Verificar se o usuário foi criado
SELECT id, email, name, role, "createdAt" FROM "User" WHERE email = 'admin@cortinasbras.com.br';
