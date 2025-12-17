import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ProductDetails } from '@/components/marketplace/product-details'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    const product = MOCK_PRODUCTS.find(p => p.id === id)
    return product
}

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return {
            title: 'Producto no encontrado',
        }
    }

    let mainImage = (product as any).thumbnail
    if (!mainImage && product.images) {
        try {
            const parsed = JSON.parse(product.images)
            if (Array.isArray(parsed) && parsed.length > 0) mainImage = parsed[0]
        } catch (e) { }
    }

    return {
        title: `${product.title} | HonduMarket`,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.title,
            description: product.description.substring(0, 160),
            images: mainImage ? [mainImage] : [],
        },
    }
}

async function getRelatedProducts(currentProductId: string, categoryId: string) {
    // Basic mock logic: same category, excluding current
    return MOCK_PRODUCTS
        .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
        .slice(0, 4)
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

    return <ProductDetails product={product} relatedProducts={relatedProducts} />
}
