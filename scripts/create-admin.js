const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
    console.log('🔐 Creando usuario administrador...\n')

    try {
        const adminPassword = await bcrypt.hash('admin123', 12)

        const admin = await prisma.user.upsert({
            where: { email: 'admin@hondumarket.com' },
            update: {
                password: adminPassword,
                role: 'ADMIN'
            },
            create: {
                name: 'Administrador',
                email: 'admin@hondumarket.com',
                password: adminPassword,
                role: 'ADMIN',
                rating: 5.0,
                bio: 'Administrador del sistema HonduMarket'
            }
        })

        console.log('✅ Usuario administrador creado exitosamente!\n')
        console.log('📧 Email: admin@hondumarket.com')
        console.log('🔑 Contraseña: admin123\n')
        console.log('Puedes iniciar sesión en: http://localhost:3000/login\n')
    } catch (error) {
        console.error('❌ Error al crear administrador:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
