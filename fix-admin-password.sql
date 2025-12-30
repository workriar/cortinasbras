-- ============================================
-- Corrigir Hash da Senha do Usuário Admin
-- ============================================

-- Atualizar o hash da senha para o correto
UPDATE "User" 
SET "passwordHash" = '$2b$10$h8mr.8lgW.L0/QqQUI2fFON42bs7PTgrop4TOb4tDfq7a4wK8hcwC',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE email = 'admin@cortinasbras.com.br';

-- Verificar a atualização
SELECT id, email, name, role, "passwordHash", "updatedAt" 
FROM "User" 
WHERE email = 'admin@cortinasbras.com.br';
