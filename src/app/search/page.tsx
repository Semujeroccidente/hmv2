import { Metadata } from 'next'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data'
import { CategoryBrowser } from '@/components/marketplace/category-browser'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: PageProps
): Promise<Metadata> {
    const { q } = await searchParams
    const query = typeof q === 'string' ? q : ''

    return {
        title: `Resultados para "${query}" | HonduMarket`,
        description: `Resultados de búsqueda para ${query} en HonduMarket.`
    }
}

import { prisma } from '@/lib/prisma'

export default async function SearchPage({
    searchParams,
}: PageProps) {
    const { q } = await searchParams
    const query = typeof q === 'string' ? q : ''

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { category: { name: { contains: query } } }
            ]
        },
        include: {
            category: true,
            seller: true
            // we might need more includes depending on Product interface
        }
    })

    // Create a dummy category context for the browser
    const searchCategory = {
        id: 'search',
        name: `Resultados para "${query}"`
    }

    // transform Prisma product to expected Product interface if necessary
    // Assuming Prisma schema matches or is close enough. 
    // If not, we map it. 
    // The previously used Product interface had category as {id, name} which is what include: {category: true} gives.

    return (
        <CategoryBrowser
            initialProducts={products as any} // Cast if types don't strictly align yet
            category={searchCategory}
            categories={MOCK_CATEGORIES} // Could also fetch categories from DB
            slugs={['search']}
        />
    )
}
