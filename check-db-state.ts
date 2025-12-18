
import { prisma } from './src/lib/prisma'

async function main() {
    console.log('Checking database state...')

    const userCount = await prisma.user.count()
    console.log(`Users found: ${userCount}`)

    if (userCount > 0) {
        const firstUser = await prisma.user.findFirst()
        console.log('First user:', firstUser?.email, firstUser?.id)
    }

    const categoryCount = await prisma.category.count()
    console.log(`Categories found: ${categoryCount}`)

    if (categoryCount === 0) {
        console.log('WARNING: No categories found! Product creation will fail.')
    } else {
        const categories = await prisma.category.findMany({ take: 5 })
        console.log('Sample categories:', categories.map(c => c.name))
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
