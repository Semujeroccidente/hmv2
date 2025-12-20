
import { prisma } from './src/lib/prisma'
import { compare } from 'bcryptjs'

async function main() {
    const email = 'juan@ejemplo.com'
    const password = 'password123'

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log('User not found')
        return
    }

    console.log('User found:', user.email)
    console.log('Stored hash:', user.password.substring(0, 10) + '...')

    const isValid = await compare(password, user.password)
    console.log(`Password '${password}' is valid: ${isValid}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
