// Script de debug para testar autenticação
const bcrypt = require('bcryptjs');

async function testAuth() {
    const senha = 'admin123';
    const hashAntigo = '$2b$10$S.7Z7DqV8SNqkxP4rgY7XuCQ1TOZgodRX77ZojBsV5aw.aCKuCvd.';
    const hashNovo = '$2b$10$h8mr.8lgW.L0/QqQUI2fFON42bs7PTgrop4TOb4tDfq7a4wK8hcwC';

    console.log('=== TESTE DE AUTENTICAÇÃO ===\n');

    // Teste 1: Hash antigo
    const validoAntigo = await bcrypt.compare(senha, hashAntigo);
    console.log('1. Hash antigo (no banco):');
    console.log('   Hash:', hashAntigo);
    console.log('   Senha "admin123" válida?', validoAntigo);
    console.log('');

    // Teste 2: Hash novo
    const validoNovo = await bcrypt.compare(senha, hashNovo);
    console.log('2. Hash novo (correto):');
    console.log('   Hash:', hashNovo);
    console.log('   Senha "admin123" válida?', validoNovo);
    console.log('');

    // Teste 3: Gerar novo hash
    const hashGerado = await bcrypt.hash(senha, 10);
    const validoGerado = await bcrypt.compare(senha, hashGerado);
    console.log('3. Hash recém-gerado:');
    console.log('   Hash:', hashGerado);
    console.log('   Senha "admin123" válida?', validoGerado);
    console.log('');

    console.log('=== CONCLUSÃO ===');
    if (!validoAntigo) {
        console.log('❌ O hash no banco está INCORRETO!');
        console.log('✅ Use este hash correto:');
        console.log('   ' + hashNovo);
    } else {
        console.log('✅ O hash no banco está correto');
    }
}

testAuth().catch(console.error);
