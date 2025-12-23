import { prisma } from '@/lib/prisma'

interface ProxyBidResult {
    counterBidPlaced: boolean
    counterBidAmount?: number
    counterBidUserId?: string
}

/**
 * Procesa pujas automáticas (proxy bidding)
 * Cuando alguien puja, verifica si hay pujas automáticas que pueden superarla
 */
export async function processProxyBid(
    auctionId: string,
    newBidAmount: number,
    newBidUserId: string,
    bidIncrement: number = 50
): Promise<ProxyBidResult> {
    try {
        // 1. Obtener todas las pujas proxy activas que puedan superar la nueva puja
        const proxyBids = await prisma.bid.findMany({
            where: {
                auctionId,
                isProxy: true,
                maxAmount: { gte: newBidAmount + bidIncrement },
                userId: { not: newBidUserId } // Excluir al usuario que acaba de pujar
            },
            orderBy: [
                { maxAmount: 'desc' }, // Mayor monto máximo primero
                { createdAt: 'asc' }   // Si empatan, el más antiguo gana
            ],
            take: 1 // Solo necesitamos el mejor
        })

        if (proxyBids.length === 0) {
            return { counterBidPlaced: false }
        }

        const topProxyBid = proxyBids[0]

        // 2. Calcular la contra-puja automática
        // Solo puja lo necesario para superar la nueva puja
        const counterBidAmount = Math.min(
            newBidAmount + bidIncrement,
            topProxyBid.maxAmount!
        )

        // 3. Crear la contra-puja automática
        const counterBid = await prisma.bid.create({
            data: {
                auctionId,
                userId: topProxyBid.userId,
                amount: counterBidAmount,
                maxAmount: topProxyBid.maxAmount,
                isProxy: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        // 4. Actualizar la subasta
        await prisma.auction.update({
            where: { id: auctionId },
            data: {
                currentPrice: counterBidAmount,
                bidCount: { increment: 1 },
                lastBidder: topProxyBid.userId,
                lastBidTime: new Date()
            }
        })

        console.log(`🤖 Proxy bid placed: L.${counterBidAmount} by ${counterBid.user.name}`)

        return {
            counterBidPlaced: true,
            counterBidAmount,
            counterBidUserId: topProxyBid.userId
        }

    } catch (error) {
        console.error('Error processing proxy bid:', error)
        return { counterBidPlaced: false }
    }
}

/**
 * Verifica si un usuario tiene una puja proxy activa en una subasta
 */
export async function hasActiveProxyBid(
    auctionId: string,
    userId: string
): Promise<boolean> {
    const proxyBid = await prisma.bid.findFirst({
        where: {
            auctionId,
            userId,
            isProxy: true,
            maxAmount: { gt: 0 }
        }
    })

    return !!proxyBid
}

/**
 * Obtiene la puja proxy activa de un usuario
 */
export async function getUserProxyBid(
    auctionId: string,
    userId: string
) {
    return await prisma.bid.findFirst({
        where: {
            auctionId,
            userId,
            isProxy: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

/**
 * Cancela todas las pujas proxy de un usuario en una subasta
 */
export async function cancelUserProxyBids(
    auctionId: string,
    userId: string
): Promise<number> {
    const result = await prisma.bid.updateMany({
        where: {
            auctionId,
            userId,
            isProxy: true
        },
        data: {
            maxAmount: null,
            isProxy: false
        }
    })

    return result.count
}
