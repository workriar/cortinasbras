#!/usr/bin/env node

/**
 * Script para adicionar NEXT_PUBLIC_SITE_URL ao .env se não existir
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Verificar se .env existe
if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env não encontrado!');
    console.log('📝 Criando .env a partir de .env.example...');

    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Arquivo .env criado com sucesso!');
        console.log('⚠️  IMPORTANTE: Edite o .env e configure suas credenciais SMTP');
    } else {
        console.log('❌ Arquivo .env.example não encontrado!');
        process.exit(1);
    }
}

// Ler conteúdo do .env
let envContent = fs.readFileSync(envPath, 'utf8');

// Verificar se NEXT_PUBLIC_SITE_URL já existe
if (envContent.includes('NEXT_PUBLIC_SITE_URL=')) {
    console.log('✅ NEXT_PUBLIC_SITE_URL já está configurado no .env');

    // Mostrar valor atual
    const match = envContent.match(/NEXT_PUBLIC_SITE_URL=(.+)/);
    if (match) {
        console.log(`📍 Valor atual: ${match[1]}`);
    }
} else {
    console.log('⚠️  NEXT_PUBLIC_SITE_URL não encontrado no .env');
    console.log('📝 Adicionando variável...');

    // Adicionar variável
    const newLine = '\n# URL do site\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n';

    // Adicionar no final do arquivo
    envContent += newLine;

    // Salvar
    fs.writeFileSync(envPath, envContent);

    console.log('✅ NEXT_PUBLIC_SITE_URL adicionado ao .env');
    console.log('📍 Valor padrão: http://localhost:3000');
    console.log('');
    console.log('💡 Para produção, altere para: https://cortinasbras.com.br');
}

console.log('');
console.log('🎉 Configuração concluída!');
console.log('');
console.log('Próximos passos:');
console.log('1. Verifique o arquivo .env e configure suas credenciais SMTP');
console.log('2. Execute: npm run verify');
console.log('3. Execute: npm run dev');
