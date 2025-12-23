import { Metadata } from 'next'
import { CategoryBrowser } from '@/components/marketplace/category-browser'
import { prisma } from '@/lib/prisma'
import { MOCK_CATEGORIES } from '@/lib/mock-data' // Keep for now if CategoryBrowser relies on it for fallback, or refactor later. 
import { ProductWithRelations, CategoryWithRelations } from '@/types/prisma'
// Actually, CategoryBrowser expects categories prop. We should pass real categories.

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

export default async function SearchPage({
    searchParams,
}: PageProps) {
    const { q } = await searchParams
    const query = typeof q === 'string' ? q : ''

    const products = await prisma.product.findMany({
        where: {
            status: 'ACTIVE',
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { category: { name: { contains: query } } }
            ]
        },
        include: {
            category: {
                select: { id: true, name: true, slug: true }
            },
            seller: {
                select: { id: true, name: true, rating: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    // Fetch categories for filter sidebar
    const categories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true, parentId: true, icon: true }
    })

    // Transform categories
    const mappedCategories = categories.map(c => ({
        ...c,
        level: c.parentId ? 2 : 1,
        parent: c.parentId ? { name: categories.find(p => p.id === c.parentId)?.name || '' } : undefined
    }))

    // Create a dummy category context for the browser
    const searchCategory = {
        id: 'search',
        name: `Resultados para "${query}"`,
        slug: 'search',
        level: 1
    }

    const mappedProducts = products.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category.name
    }))

    return (
        <CategoryBrowser
            initialProducts={mappedProducts}
            category={searchCategory}
            categories={mappedCategories}
            slugs={['search']}
        />
    )
}
