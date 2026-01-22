const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const adminEmail = 'admin@cortinasbras.com.br';
    console.log('Verificando usuário admin...');

    const existing = await prisma.user.findUnique({ where: { email: adminEmail } }).catch(() => null);
    if (existing) {
      console.log('Admin já existe:', { id: existing.id, email: existing.email });
      process.exit(0);
    }

    console.log('Criando admin...');
    const hashed = await bcrypt.hash('admin123', 10);
    const created = await prisma.user.create({ data: { email: adminEmail, name: 'Administrador', passwordHash: hashed, role: 'ADMIN', updatedAt: new Date() } });
    console.log('Admin criado:', { id: created.id, email: created.email });
    process.exit(0);
  } catch (e) {
    console.error('Erro ao criar admin:', e && e.message ? e.message : e);
    process.exit(2);
  }
})();
