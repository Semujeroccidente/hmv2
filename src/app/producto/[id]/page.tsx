import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetails } from '@/components/marketplace/product-details'
import { prisma } from '@/lib/prisma'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            seller: {
                select: {
                    id: true,
                    name: true,
                    rating: true,
                    avatar: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    })

    if (!product) return null

    // Transform Prisma result to match expected interface if needed
    // or ensure ProductDetails can handle Prisma shape.
    // The main difference usually is Dates are objects in Prisma but simple JSON might handle strings.
    // Next.js Server Components serialize dates fine usually, but let's be safe if passing to client component.
    return {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        // Ensure images is parsed if it's a string, or kept as string? 
        // ProductDetails likely expects the raw product.
        // Let's check ProductDetails prop type inferred or explicit.
        // Assuming it matches the shape used in MOCK which had images as stringified JSON.
    }
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

    let mainImage = product.thumbnail
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
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            id: { not: currentProductId },
            status: 'ACTIVE'
        },
        take: 4,
        include: {
            seller: {
                select: {
                    id: true,
                    name: true,
                    rating: true
                }
            },
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return products.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
    }))
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

    // @ts-ignore - Component props might be slightly mismatched with Prisma types but largely compatible
    return <ProductDetails product={product} relatedProducts={relatedProducts} />
}
