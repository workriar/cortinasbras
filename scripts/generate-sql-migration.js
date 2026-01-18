const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const OLD_DB_PATH = '/root/instance/leads.db';
const OUTPUT_FILE = '/root/migration_inserts.sql';

async function generate() {
    console.log('Gerando SQL de migração...');

    const db = new sqlite3.Database(OLD_DB_PATH, sqlite3.OPEN_READONLY);

    db.all("SELECT * FROM lead", (err, rows) => {
        if (err) {
            console.error('Erro:', err);
            return;
        }

        let sql = '-- Inserção de leads migrados do SQLite\n';

        rows.forEach(row => {
            // Escapar strings simples
            const escape = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

            const nome = escape(row.nome);
            const telefone = escape(row.telefone);
            const largura = row.largura_parede || 'NULL';
            const altura = row.altura_parede || 'NULL';
            const tecido = escape(row.tecido);
            const instalacao = escape(row.instalacao);
            let obs = row.observacoes || '';
            if (row.largura_janela || row.altura_janela) {
                obs += `\n[Migração] Janela: ${row.largura_janela || '?'}x${row.altura_janela || '?'}`;
            }
            if (row.endereco) {
                obs += `\n[Migração] Endereço: ${row.endereco}`;
            }
            const observacoes = escape(obs);
            const criado_em = escape(row.criado_em);

            // Inserir na tabela 'leads' (minúscula, postgres)
            // colunas: nome, telefone, largura_parede, altura_parede, tecido, instalacao, observacoes, criado_em, status, origem
            sql += `INSERT INTO leads (nome, telefone, largura_parede, altura_parede, tecido, instalacao, observacoes, criado_em, status, origem) VALUES (${nome}, ${telefone}, ${largura}, ${altura}, ${tecido}, ${instalacao}, ${observacoes}, ${criado_em}::timestamp, 'novo', 'migracao');\n`;
        });

        fs.writeFileSync(OUTPUT_FILE, sql);
        console.log(`SQL gerado em ${OUTPUT_FILE} (${rows.length} leads).`);
    });
}

generate();
