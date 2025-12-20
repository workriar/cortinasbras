import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import fs from "fs";

let db: Database | null = null;

export async function getDb() {
  if (db) return db;

  let dbPath = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace("sqlite:", "")
    : path.join(process.cwd(), "leads.db");

  // Se estiver em produção e o caminho for relativo, tenta colocar na pasta /data
  if (process.env.NODE_ENV === "production" && !dbPath.startsWith("/") && !dbPath.startsWith("C:")) {
    dbPath = path.join(process.cwd(), "data", "leads.db");
  }

  // Garante que o diretório pai existe
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

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
