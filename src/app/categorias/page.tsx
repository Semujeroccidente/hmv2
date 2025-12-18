import { prisma } from "@/lib/prisma"
import { CategoryGrid } from "@/components/marketplace/category-menu"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Todas las Categorías | HonduMarket",
    description: "Explora todas las categorías de productos disponibles en HonduMarket.",
}

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        where: {
            parentId: null, // Only root categories
            active: true
        },
        include: {
            children: true,
            _count: {
                select: { products: true }
            }
        },
        orderBy: {
            visualOrder: 'asc'
        }
    })

    // We need to map to the interface expected by CategoryGrid
    // The prisma result has 'children' and '_count' which match
    // We need to ensure types align.
    const mappedCategories = categories.map(cat => ({
        ...cat,
        // Ensure nulls are handled if interface is strict, but Prisma returns nulls.
        // Parent is missing since we filtered parentId: null
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorar Categorías</h1>
            <p className="text-gray-600 mb-8">Encuentra todo lo que buscas en nuestras categorías principales.</p>

            <CategoryGrid categories={mappedCategories as any} />
            {/* 'as any' to avoid strict type mismatch on dates/Json fields if they differ slightly from Interface in component */}
        </div>
    )
}
