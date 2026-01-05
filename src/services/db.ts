import { Pool } from 'pg';

let pool: Pool | null = null;

export async function getDb() {
    if (pool) return pool;

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL não configurado no .env');
    }

    console.log(`📁 Conectando ao PostgreSQL...`);

    pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 20, // Máximo de conexões no pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    // Testar conexão
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL conectado com sucesso');
        client.release();
    } catch (error) {
        console.error('❌ Erro ao conectar PostgreSQL:', error);
        throw error;
    }

    // Criar tabela se não existir
    await initializeDatabase();

    return pool;
}

async function initializeDatabase() {
    if (!pool) return;

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      telefone VARCHAR(20) NOT NULL,
      cidade_bairro VARCHAR(255),
      largura_parede DECIMAL(10,2),
      altura_parede DECIMAL(10,2),
      tecido VARCHAR(100),
      instalacao VARCHAR(100),
      observacoes TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'novo',
      origem VARCHAR(50) DEFAULT 'site'
    );

    CREATE INDEX IF NOT EXISTS idx_leads_telefone ON leads(telefone);
    CREATE INDEX IF NOT EXISTS idx_leads_criado_em ON leads(criado_em DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_cidade_bairro ON leads(cidade_bairro);
  `;

    try {
        await pool.query(createTableQuery);
        console.log('✅ Tabela leads verificada/criada');
    } catch (error) {
        console.error('❌ Erro ao criar tabela:', error);
        throw error;
    }
}

// Helper para executar queries
export async function query(text: string, params?: any[]) {
    const db = await getDb();
    return db.query(text, params);
}

// Helper para transações
export async function transaction(callback: (client: any) => Promise<void>) {
    const db = await getDb();
    const client = await db.connect();

    try {
        await client.query('BEGIN');
        await callback(client);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Fechar pool (útil para testes)
export async function closeDb() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('🔒 Pool PostgreSQL fechado');
    }
}
