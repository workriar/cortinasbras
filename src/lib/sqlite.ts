import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getSqliteConnection(dbPath: string) {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    return db;
}
