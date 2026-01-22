import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Get credentials from environment or use defaults
        const email = process.env.ADMIN_EMAIL || 'admin@cortinasbras.com.br';
        const password = process.env.ADMIN_PASSWORD || 'Admin@2024';
        const name = process.env.ADMIN_NAME || 'Administrador';

        console.log('🔐 Creating admin user...');
        console.log('📧 Email:', email);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log('⚠️  User already exists. Updating password...');

            // Hash the new password
            const passwordHash = await bcrypt.hash(password, 10);

            // Update existing user
            await prisma.user.update({
                where: { email },
                data: {
                    passwordHash,
                    role: 'ADMIN',
                    name,
                    isActive: true
                }
            });

            console.log('✅ Admin user updated successfully!');
        } else {
            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create new user
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    passwordHash,
                    role: 'ADMIN',
                    isActive: true
                }
            });

            console.log('✅ Admin user created successfully!');
            console.log('👤 User ID:', user.id);
        }

        console.log('\n📋 Login credentials:');
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('\n🔗 Login URL: http://localhost:3000/admin/login');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
