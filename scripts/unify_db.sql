-- 1. Migrar dados da tabela fantasma 'Lead' para a oficial 'leads'
INSERT INTO leads (nome, telefone, cidade_bairro, status, origem, criado_em, atualizado_em)
SELECT 
    l.name, 
    l.phone, 
    l.city, 
    l.status, 
    l.source, 
    l."createdAt", 
    l."updatedAt"
FROM "Lead" l
WHERE NOT EXISTS (
    SELECT 1 FROM leads target 
    WHERE target.telefone = l.phone OR target.nome = l.name
);

-- 2. Atualizar sequência de IDs da tabela leads para evitar erros de insert futuro
SELECT setval('leads_id_seq', (SELECT MAX(id) FROM leads));

-- 3. Limpar tabelas da estrutura antiga (que apontavam para 'Lead')
-- Como validamos que Interaction está vazia e Message só tem 1 teste, é seguro limpar para recriar as FKs corretas.
DROP TABLE IF EXISTS "Interaction" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Lead" CASCADE; -- A tabela fantasma
DROP TABLE IF EXISTS "User" CASCADE; -- Recriar User corretamente linkado

-- Nota: O Prisma irá recriar User, Interaction e Message corretamente apontando para 'leads' no próximo 'db push'.
