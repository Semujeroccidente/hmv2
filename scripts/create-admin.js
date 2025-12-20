const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash('admin1234', 10)

        // Crear usuario admin
        const admin = await prisma.user.create({
            data: {
                email: 'admin@gmail.com',
                password: hashedPassword,
                name: 'Administrador',
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        })

        console.log('✅ Usuario administrador creado exitosamente:')
        console.log('📧 Email:', admin.email)
        console.log('👤 Nombre:', admin.name)
        console.log('🔑 Rol:', admin.role)
        console.log('🆔 ID:', admin.id)
        console.log('\n🔐 Credenciales de acceso:')
        console.log('Email: admin@gmail.com')
        console.log('Contraseña: admin1234')

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️  El usuario admin@gmail.com ya existe en la base de datos')

            // Actualizar el usuario existente para asegurarnos que sea ADMIN
            const updated = await prisma.user.update({
                where: { email: 'admin@gmail.com' },
                data: {
                    role: 'ADMIN',
                    status: 'ACTIVE',
                    password: await bcrypt.hash('admin1234', 10)
                }
            })

            console.log('✅ Usuario actualizado a ADMIN exitosamente')
            console.log('🆔 ID:', updated.id)
        } else {
            console.error('❌ Error al crear usuario admin:', error)
        }
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
