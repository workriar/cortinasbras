#!/usr/bin/env node

/**
 * Script de verificação do ambiente de produção
 * Testa se todos os componentes necessários estão funcionando
 */

// Carregar variáveis de ambiente
require('dotenv').config();

const http = require('http');
const https = require('https');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
    log(`✓ ${message}`, colors.green);
}

function error(message) {
    log(`✗ ${message}`, colors.red);
}

function info(message) {
    log(`ℹ ${message}`, colors.blue);
}

function warn(message) {
    log(`⚠ ${message}`, colors.yellow);
}

// Verificar variáveis de ambiente
function checkEnvironment() {
    info('Verificando variáveis de ambiente...');

    const requiredVars = [
        'NEXT_PUBLIC_SITE_URL',
        'MAIL_SERVER',
        'MAIL_PORT',
        'MAIL_USERNAME',
        'MAIL_PASSWORD',
    ];

    const optionalVars = [
        'DATABASE_URL',
        'PUPPETEER_EXECUTABLE_PATH',
    ];

    let allPresent = true;

    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            success(`${varName} está configurado`);
        } else {
            error(`${varName} NÃO está configurado`);
            allPresent = false;
        }
    });

    optionalVars.forEach(varName => {
        if (process.env[varName]) {
            info(`${varName}: ${process.env[varName]}`);
        } else {
            warn(`${varName} não está configurado (opcional)`);
        }
    });

    return allPresent;
}

// Verificar se o Chromium está instalado
async function checkChromium() {
    info('Verificando instalação do Chromium...');

    const { execSync } = require('child_process');
    const fs = require('fs');
    const os = require('os');
    const path = require('path');

    try {
        // Verificar se está no Docker
        const isDocker = fs.existsSync('/.dockerenv');

        if (isDocker) {
            info('Ambiente Docker detectado');

            // Verificar Chromium no Alpine Linux
            try {
                execSync('which chromium-browser', { stdio: 'pipe' });
                success('Chromium encontrado em /usr/bin/chromium-browser');
                return true;
            } catch (e) {
                error('Chromium NÃO encontrado no sistema');
                info('Execute: apk add --no-cache chromium');
                return false;
            }
        } else {
            info('Ambiente local detectado');

            // Verificar cache do Puppeteer
            const homeDir = os.homedir();
            const cacheDir = path.join(homeDir, '.cache', 'puppeteer', 'chrome');

            if (fs.existsSync(cacheDir)) {
                const versions = fs.readdirSync(cacheDir);
                if (versions.length > 0) {
                    success(`Chromium encontrado (versões: ${versions.join(', ')})`);
                    return true;
                } else {
                    error('Diretório do Chromium existe mas está vazio');
                    info('Execute: npx puppeteer browsers install chrome');
                    return false;
                }
            } else {
                error('Chromium NÃO encontrado');
                info('Execute: npx puppeteer browsers install chrome');
                return false;
            }
        }
    } catch (err) {
        error(`Erro ao verificar Chromium: ${err.message}`);
        return false;
    }
}

// Verificar banco de dados
function checkDatabase() {
    info('Verificando banco de dados...');

    const fs = require('fs');
    const path = require('path');

    const dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './leads.db';
    const dbDir = path.dirname(dbPath);

    // Verificar se o diretório existe
    if (!fs.existsSync(dbDir)) {
        warn(`Diretório do banco não existe: ${dbDir}`);
        try {
            fs.mkdirSync(dbDir, { recursive: true });
            success(`Diretório criado: ${dbDir}`);
        } catch (err) {
            error(`Erro ao criar diretório: ${err.message}`);
            return false;
        }
    }

    // Verificar se o arquivo existe
    if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        success(`Banco de dados encontrado: ${dbPath} (${stats.size} bytes)`);
        return true;
    } else {
        warn(`Banco de dados não existe ainda: ${dbPath}`);
        info('Será criado automaticamente no primeiro uso');
        return true;
    }
}

// Testar geração de PDF
async function testPdfGeneration() {
    info('Verificando módulo de geração de PDF...');

    try {
        const fs = require('fs');
        const path = require('path');

        const pdfServicePath = path.join(__dirname, '..', 'src', 'services', 'pdf.ts');

        if (fs.existsSync(pdfServicePath)) {
            success(`Módulo de PDF encontrado: ${pdfServicePath}`);
            info('Teste de geração de PDF requer Next.js rodando');
            info('Para testar: Acesse http://localhost:3000 e envie o formulário');
            return true;
        } else {
            error(`Módulo de PDF não encontrado: ${pdfServicePath}`);
            return false;
        }
    } catch (err) {
        error(`Erro ao verificar módulo de PDF: ${err.message}`);
        return false;
    }
}

// Verificar servidor HTTP
function checkServer(url) {
    return new Promise((resolve) => {
        info(`Verificando servidor: ${url}`);

        const client = url.startsWith('https') ? https : http;

        const req = client.get(url, (res) => {
            if (res.statusCode === 200) {
                success(`Servidor respondendo: ${url} (${res.statusCode})`);
                resolve(true);
            } else {
                warn(`Servidor respondeu com status ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on('error', (err) => {
            error(`Erro ao conectar ao servidor: ${err.message}`);
            resolve(false);
        });

        req.setTimeout(5000, () => {
            error('Timeout ao conectar ao servidor');
            req.destroy();
            resolve(false);
        });
    });
}

// Executar todas as verificações
async function runChecks() {
    console.log('\n' + '='.repeat(60));
    log('🔍 VERIFICAÇÃO DO AMBIENTE - CORTINAS BRÁS', colors.blue);
    console.log('='.repeat(60) + '\n');

    const results = {
        environment: false,
        chromium: false,
        database: false,
        pdf: false,
        server: false,
    };

    // 1. Variáveis de ambiente
    console.log('\n📋 1. VARIÁVEIS DE AMBIENTE');
    console.log('-'.repeat(60));
    results.environment = checkEnvironment();

    // 2. Chromium
    console.log('\n🌐 2. CHROMIUM');
    console.log('-'.repeat(60));
    results.chromium = await checkChromium();

    // 3. Banco de dados
    console.log('\n💾 3. BANCO DE DADOS');
    console.log('-'.repeat(60));
    results.database = checkDatabase();

    // 4. Geração de PDF
    console.log('\n📄 4. GERAÇÃO DE PDF');
    console.log('-'.repeat(60));
    if (results.chromium) {
        results.pdf = await testPdfGeneration();
    } else {
        warn('Pulando teste de PDF (Chromium não disponível)');
    }

    // 5. Servidor
    console.log('\n🌍 5. SERVIDOR HTTP');
    console.log('-'.repeat(60));
    const serverUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    results.server = await checkServer(serverUrl);

    // Resumo
    console.log('\n' + '='.repeat(60));
    log('📊 RESUMO', colors.blue);
    console.log('='.repeat(60));

    const total = Object.keys(results).length;
    const passed = Object.values(results).filter(Boolean).length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`\nTestes passados: ${passed}/${total} (${percentage}%)\n`);

    Object.entries(results).forEach(([name, passed]) => {
        const label = name.charAt(0).toUpperCase() + name.slice(1);
        if (passed) {
            success(label);
        } else {
            error(label);
        }
    });

    console.log('\n' + '='.repeat(60) + '\n');

    if (passed === total) {
        success('✨ TODOS OS TESTES PASSARAM! Sistema pronto para produção.');
        process.exit(0);
    } else {
        error(`⚠️  ${total - passed} teste(s) falharam. Verifique os erros acima.`);
        process.exit(1);
    }
}

// Executar
runChecks().catch(err => {
    error(`Erro fatal: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});
