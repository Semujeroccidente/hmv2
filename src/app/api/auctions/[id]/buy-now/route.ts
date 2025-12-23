import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'

// POST - Compra inmediata (Buy It Now)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: auctionId } = await params

        // Autenticación requerida
        const authResult = await requireAuth(request)

        if (!authResult.success || !authResult.user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para comprar' },
                { status: 401 }
            )
        }

        const userId = authResult.user.id

        // Obtener subasta
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId },
            include: {
                product: {
                    include: {
                        seller: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        })

        if (!auction) {
            return NextResponse.json(
                { error: 'Subasta no encontrada' },
                { status: 404 }
            )
        }

        // Validaciones
        if (!auction.buyNowEnabled || !auction.buyNowPrice) {
            return NextResponse.json(
                { error: 'Compra inmediata no disponible para esta subasta' },
                { status: 400 }
            )
        }

        if (auction.status !== 'ACTIVE') {
            return NextResponse.json(
                { error: 'La subasta ya no está activa' },
                { status: 400 }
            )
        }

        if (auction.product.sellerId === userId) {
            return NextResponse.json(
                { error: 'No puedes comprar tu propio producto' },
                { status: 403 }
            )
        }

        // Realizar compra inmediata en transacción
        const result = await prisma.$transaction(async (tx) => {
            // 1. Finalizar subasta
            await tx.auction.update({
                where: { id: auctionId },
                data: {
                    status: 'ENDED',
                    buyNowUserId: userId,
                    winnerId: userId,
                    currentPrice: auction.buyNowPrice
                }
            })

            // 2. Marcar producto como vendido
            await tx.product.update({
                where: { id: auction.productId },
                data: { status: 'SOLD' }
            })

            // 3. Crear orden
            const order = await tx.order.create({
                data: {
                    buyerId: userId,
                    sellerId: auction.product.sellerId,
                    productId: auction.productId,
                    totalAmount: auction.buyNowPrice!,
                    status: 'PENDING',
                    shippingAddress: '', // El usuario lo completará después
                    paymentMethod: 'PENDING'
                },
                include: {
                    product: true,
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })

            return order
        })

        return NextResponse.json({
            success: true,
            message: '¡Compra realizada exitosamente!',
            order: result,
            auction: {
                id: auctionId,
                finalPrice: auction.buyNowPrice,
                buyNow: true
            }
        })

    } catch (error) {
        console.error('Error in buy now:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar la compra',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
