import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
        return null
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        return decoded.userId
    } catch (error) {
        return null
    }
}

// GET - Obtener todos los favoritos del usuario
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserFromToken(request)

        if (!userId) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                product: {
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            favorites: favorites.map(fav => ({
                id: fav.id,
                productId: fav.productId,
                product: fav.product,
                createdAt: fav.createdAt
            }))
        })
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return NextResponse.json(
            { error: 'Error al obtener favoritos' },
            { status: 500 }
        )
    }
}

// POST - Agregar producto a favoritos
export async function POST(request: NextRequest) {
    try {
        const userId = await getUserFromToken(request)

        if (!userId) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId } = body

        if (!productId) {
            return NextResponse.json(
                { error: 'productId es requerido' },
                { status: 400 }
            )
        }

        // Verificar que el producto existe
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            )
        }

        // Verificar si ya existe en favoritos
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })

        if (existingFavorite) {
            return NextResponse.json(
                { error: 'El producto ya está en favoritos' },
                { status: 400 }
            )
        }

        // Crear favorito
        const favorite = await prisma.favorite.create({
            data: {
                userId,
                productId
            },
            include: {
                product: {
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
                }
            }
        })

        // Actualizar contador de favoritos del producto
        await prisma.product.update({
            where: { id: productId },
            data: {
                favoritesCount: {
                    increment: 1
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Producto agregado a favoritos',
            favorite
        })
    } catch (error) {
        console.error('Error adding to favorites:', error)
        return NextResponse.json(
            { error: 'Error al agregar a favoritos' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar producto de favoritos
export async function DELETE(request: NextRequest) {
    try {
        const userId = await getUserFromToken(request)

        if (!userId) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json(
                { error: 'productId es requerido' },
                { status: 400 }
            )
        }

        // Verificar que existe el favorito
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })

        if (!favorite) {
            return NextResponse.json(
                { error: 'Favorito no encontrado' },
                { status: 404 }
            )
        }

        // Eliminar favorito
        await prisma.favorite.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })

        // Actualizar contador de favoritos del producto
        await prisma.product.update({
            where: { id: productId },
            data: {
                favoritesCount: {
                    decrement: 1
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Producto eliminado de favoritos'
        })
    } catch (error) {
        console.error('Error removing from favorites:', error)
        return NextResponse.json(
            { error: 'Error al eliminar de favoritos' },
            { status: 500 }
        )
    }
}
