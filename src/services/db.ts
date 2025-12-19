import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database | null = null;

export async function getDb() {
    if (db) return db;

    const dbPath = path.join(process.cwd(), "leads.db");

    db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      telefone TEXT,
      largura_parede REAL,
      altura_parede REAL,
      tecido TEXT,
      instalacao TEXT,
      observacoes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    return db;
}
