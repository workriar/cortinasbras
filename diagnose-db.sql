-- ============================================
-- Script de Diagnóstico Completo
-- ============================================

-- 1. Verificar se a tabela User existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'User'
) as tabela_user_existe;

-- 2. Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. Ver estrutura da tabela User
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

-- 4. Contar usuários
SELECT COUNT(*) as total_usuarios FROM "User";

-- 5. Ver todos os usuários (sem mostrar senha completa)
SELECT 
    id, 
    email, 
    name, 
    role,
    LEFT("passwordHash", 20) || '...' as password_preview,
    "createdAt",
    "updatedAt"
FROM "User";

-- 6. Verificar especificamente o admin
SELECT 
    id,
    email,
    name,
    role,
    "passwordHash",
    LENGTH("passwordHash") as hash_length,
    "createdAt",
    "updatedAt"
FROM "User" 
WHERE email = 'admin@cortinasbras.com.br';
