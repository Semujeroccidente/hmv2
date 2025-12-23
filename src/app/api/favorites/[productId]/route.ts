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

// GET - Verificar si un producto está en favoritos
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const userId = await getUserFromToken(request)
        const { productId } = await params

        if (!userId) {
            return NextResponse.json(
                { isFavorite: false },
                { status: 200 }
            )
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })

        return NextResponse.json({
            isFavorite: !!favorite,
            favoriteId: favorite?.id
        })
    } catch (error) {
        console.error('Error checking favorite status:', error)
        return NextResponse.json(
            { error: 'Error al verificar favorito' },
            { status: 500 }
        )
    }
}
