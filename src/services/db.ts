import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

// O banco de dados será salvo na raiz do projeto em dev
// e no volume persistente em produção
const DB_PATH = process.env.DATABASE_FILE || path.join(process.cwd(), 'data', 'leads.db');

let db: Database | null = null;

export async function getDb() {
    if (db) return db;

    // Garantir que o diretório data existe
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    await initializeDatabase();

    return db;
}

async function initializeDatabase() {
    if (!db) return;

    // Tabela de Leads
    await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      cidade_bairro TEXT,
      largura_parede REAL,
      altura_parede REAL,
      tecido TEXT,
      instalacao TEXT,
      observacoes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'novo',
      origem TEXT DEFAULT 'site'
    );
  `);

    // Indices para melhorar performance
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_telefone ON leads(telefone)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_criado_em ON leads(criado_em DESC)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`);
}

// Helper para testes e scripts
export async function closeDb() {
    if (db) {
        await db.close();
        db = null;
    }
}
