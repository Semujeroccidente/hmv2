import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener historial de pujas de una subasta
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: auctionId } = await params
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Verificar que la subasta existe
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId },
            select: { id: true, status: true }
        })

        if (!auction) {
            return NextResponse.json(
                { error: 'Subasta no encontrada' },
                { status: 404 }
            )
        }

        // Obtener pujas con paginación
        const [bids, total] = await Promise.all([
            prisma.bid.findMany({
                where: { auctionId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip: offset
            }),
            prisma.bid.count({
                where: { auctionId }
            })
        ])

        // Calcular estadísticas
        const stats = {
            total,
            highestBid: bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0,
            lowestBid: bids.length > 0 ? Math.min(...bids.map(b => b.amount)) : 0,
            averageBid: bids.length > 0 ? bids.reduce((sum, b) => sum + b.amount, 0) / bids.length : 0,
            uniqueBidders: new Set(bids.map(b => b.userId)).size
        }

        return NextResponse.json({
            bids,
            stats,
            pagination: {
                limit,
                offset,
                total,
                hasMore: offset + limit < total
            }
        })

    } catch (error) {
        console.error('Error obteniendo historial de pujas:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
