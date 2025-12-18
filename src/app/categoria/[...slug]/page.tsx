import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryBrowser } from '@/components/marketplace/category-browser'
import { prisma } from '@/lib/prisma'

interface PageProps {
    params: Promise<{
        slug: string[]
    }>
}

async function resolveCategory(slugs: string[]) {
    if (!slugs || slugs.length === 0) return null

    // Helper to normalize is good, but in DB we store "slug" field.
    // We should assume the URL slug matches the DB slug (or close to it).
    // The previous logic normalized name to match slug. 
    // Now we should just search by slug.

    // If we have multiple path segments e.g. /categoria/electronica/celulares
    // slugs would be ['electronica', 'celulares']
    // The target category is likely the last one.
    const targetSlug = slugs[slugs.length - 1]

    const category = await prisma.category.findUnique({
        where: { slug: targetSlug },
        include: {
            parent: true
        }
    })

    return category
}

async function getCategoryProducts(categoryId: string) {
    const products = await prisma.product.findMany({
        where: {
            status: 'ACTIVE',
            OR: [
                { categoryId: categoryId },
                { otherCategories: { some: { id: categoryId } } } // Optionally match secondary categories
            ]
        },
        include: {
            seller: { select: { id: true, name: true, rating: true } },
            category: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return products.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category.name // Simplify for component
    }))
}

async function getAllCategories() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            icon: true
        }
    })

    // Transform to expected shape if needed (e.g. add level?)
    // The component might expect a flat list or tree. Let's provide flat list with parent info.
    return categories.map(c => ({
        ...c,
        level: c.parentId ? 2 : 1, // Simplified level logic
        parent: c.parentId ? { name: categories.find(p => p.id === c.parentId)?.name || '' } : undefined
    }))
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { slug } = await params
    const category = await resolveCategory(slug)

    if (!category) {
        return {
            title: 'Categoría no encontrada | HonduMarket'
        }
    }

    return {
        title: `${category.name} | HonduMarket`,
        description: `Encuentra los mejores productos en ${category.name} en HonduMarket. Compra y venta segura en Honduras.`,
        openGraph: {
            title: `${category.name} en HonduMarket`,
            description: `Explora nuestra selección de ${category.name}.`,
        }
    }
}

export default async function CategoryPage({
    params,
}: PageProps) {
    const { slug } = await params
    const category = await resolveCategory(slug)

    if (!category) {
        notFound()
    }

    const products = await getCategoryProducts(category.id)
    const allCategories = await getAllCategories()

    return (
        <CategoryBrowser
            initialProducts={products}
            category={category}
            categories={allCategories as any} // Cast to match expected interface slightly if needed
            slugs={slug}
        />
    )
}
