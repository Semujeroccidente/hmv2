const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking categories in DB...');
        // Avoid selecting specific fields that might be missing in stale client
        // Just count and list names
        const count = await prisma.category.count();
        console.log(`Total categories: ${count}`);

        if (count > 0) {
            const categories = await prisma.category.findMany({
                take: 5,
                select: { id: true, name: true, parentId: true, level: true }
            });
            console.log('Sample categories:', categories);
        } else {
            console.log('No categories found. Need to seed?');
        }
    } catch (e) {
        console.error('Error querying DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
