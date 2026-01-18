const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

const OLD_DB_PATH = '/root/instance/leads.db';

async function migrate() {
    console.log('Iniciando migração de leads...');

    const db = new sqlite3.Database(OLD_DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('Erro ao abrir banco antigo:', err.message);
            process.exit(1);
        }
        console.log('Banco antigo conectado.');
    });

    db.all("SELECT * FROM lead", async (err, rows) => {
        if (err) {
            console.error('Erro ao ler tabela lead:', err);
            return;
        }

        console.log(`Encontrados ${rows.length} leads para migrar.`);

        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
            try {
                // Verificar se já existe (por telefone ou nome + data)
                // Vamos tentar inserir, se der conflito de ID (não deve pois é autoincrement novo)

                // Tratar data
                let createdAt = new Date();
                if (row.criado_em) {
                    createdAt = new Date(row.criado_em);
                }

                // Concatenar janela e endereço nas observações se não tiver campo
                let notes = row.observacoes || '';
                if (row.largura_janela || row.altura_janela) {
                    notes += `\n[Migração] Janela: ${row.largura_janela || '?'}x${row.altura_janela || '?'}`;
                }
                if (row.endereco) {
                    notes += `\n[Migração] Endereço: ${row.endereco}`;
                }

                await prisma.lead.create({
                    data: {
                        name: row.nome || 'Sem Nome',
                        phone: row.telefone || 'Sem Telefone',
                        width: row.largura_parede ? parseFloat(row.largura_parede) : null,
                        height: row.altura_parede ? parseFloat(row.altura_parede) : null,
                        fabric: row.tecido,
                        installation: row.instalacao,
                        notes: notes,
                        status: 'NEW', // Default para importados
                        source: 'MIGRATION',
                        createdAt: createdAt,
                        // Mapeamento cidade_bairro pode pegar endereço? Talvez não
                    }
                });
                successCount++;
                process.stdout.write('.');
            } catch (e) {
                console.error(`\nErro ao migrar lead ${row.id}:`, e.message);
                errorCount++;
            }
        }

        console.log(`\n\nMigração concluída!`);
        console.log(`Sucesso: ${successCount}`);
        console.log(`Erros: ${errorCount}`);

        db.close();
        await prisma.$disconnect();
    });
}

migrate();
