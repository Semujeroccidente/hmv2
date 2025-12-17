import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock-data'
import { CategoryBrowser } from '@/components/marketplace/category-browser'

interface PageProps {
    params: Promise<{
        slug: string[]
    }>
}

function resolveCategory(slugs: string[]) {
    if (!slugs || slugs.length === 0) return null

    // Helper to normalize strings: lowercase, remove accents, replace spaces with dashes
    const normalize = (str: string) =>
        str.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')

    const targetSlug = normalize(decodeURIComponent(slugs[0]))

    return MOCK_CATEGORIES.find(cat =>
        normalize(cat.name) === targetSlug
    )
}

function getCategoryProducts(categoryId: string) {
    return MOCK_PRODUCTS.filter(p => p.categoryId === categoryId)
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { slug } = await params
    const category = resolveCategory(slug)

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
    const category = resolveCategory(slug)

    if (!category) {
        notFound()
    }

    const products = getCategoryProducts(category.id)

    return (
        <CategoryBrowser
            initialProducts={products}
            category={category}
            categories={MOCK_CATEGORIES}
            slugs={slug}
        />
    )
}
