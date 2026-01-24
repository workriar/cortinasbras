const nodemailer = require('nodemailer');

// Obtém credenciais dos argumentos ou variáveis de ambiente
// Permite passar host como 5º argumento (node script user pass port host)
const host = process.argv[5] || process.env.MAIL_SERVER || 'smtp.hostinger.com';
// Permite passar porta como 4º argumento (node script user pass port)
const port = Number(process.argv[4]) || Number(process.env.MAIL_PORT) || 465;
const user = process.env.MAIL_USERNAME || process.argv[2];
const pass = process.env.MAIL_PASSWORD || process.argv[3];

if (!user || !pass) {
    console.error('❌ Erro: Usuário ou senha não fornecidos.');
    console.log('Uso: node scripts/test-smtp.js <email> <senha>');
    process.exit(1);
}

console.log(`📧 Testando conexão SMTP com ${host}:${port}...`);
console.log(`👤 Usuário: ${user}`);
if (pass) console.log(`🔑 Senha recebida (${pass.length} caracteres): ${pass.substring(0, 2)}...${pass.substring(pass.length - 2)}`);

const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // True para 465, False para 587 (usa STARTTLS)
    auth: {
        user: user,
        pass: pass
    },
    // name: 'hostinger.com', // Tente descomentar se falhar
    tls: {
        rejectUnauthorized: false // Ignora erros de certificado (debug)
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Falha na conexão:');
        console.error(error);
        process.exit(1);
    } else {
        console.log('✅ Conexão SMTP BEM SUCEDIDA!');
        console.log('Server is ready to take our messages');
        process.exit(0);
    }
});
