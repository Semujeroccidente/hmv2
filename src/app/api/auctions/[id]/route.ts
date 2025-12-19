import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// MOCK DATA para coincidir con el Homepage
const MOCK_AUCTIONS: Record<string, any> = {
  '1': {
    id: '1',
    currentPrice: 18500,
    startingPrice: 15000,
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    bidCount: 12,
    product: {
      title: 'MacBook Pro M1 2020',
      description: 'MacBook Pro en excelente estado. Chip M1, 8GB RAM, 256GB SSD. Incluye cargador original y caja.',
      images: JSON.stringify(['/placeholder-product.svg']),
      thumbnail: '/placeholder-product.svg',
      condition: 'USED',
      seller: {
        name: 'TechStore HN',
        rating: 4.9
      }
    }
  },
  '2': {
    id: '2',
    title: 'PlayStation 5 + 2 Controles',
    currentPrice: 9200,
    startingPrice: 8000,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    bidCount: 8,
    product: {
      title: 'PlayStation 5 + 2 Controles',
      description: 'Consola PS5 versión disco con dos controles DualSense. Poco uso, sin rayones.',
      images: JSON.stringify(['/placeholder-product.svg']),
      thumbnail: '/placeholder-product.svg',
      condition: 'USED',
      seller: {
        name: 'GamerZone',
        rating: 4.8
      }
    }
  }
}

// GET - Obtener detalles de una subasta
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Primero intentar buscar en Mock data (para desarrollo)
    if (MOCK_AUCTIONS[id]) {
      return NextResponse.json({
        auction: MOCK_AUCTIONS[id]
      })
    }

    // Si no es mock, buscar en DB
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                rating: true,
                email: true,
                phone: true
              }
            }
          }
        },
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
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

    return NextResponse.json({ auction })

  } catch (error) {
    console.error('Error obteniendo detalles de subasta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Hacer una puja (Simulado para Mock, Real para DB)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { amount } = body

    if (MOCK_AUCTIONS[id]) {
      // Validate bid amount
      if (!amount || amount <= MOCK_AUCTIONS[id].currentPrice) {
        return NextResponse.json(
          { error: `La puja debe ser mayor a ${MOCK_AUCTIONS[id].currentPrice}` },
          { status: 400 }
        )
      }

      // Update mock auction data
      MOCK_AUCTIONS[id].currentPrice = amount
      MOCK_AUCTIONS[id].bidCount = (MOCK_AUCTIONS[id].bidCount || 0) + 1

      return NextResponse.json({
        message: 'Puja realizada exitosamente',
        bid: {
          id: `mock-bid-${Date.now()}`,
          amount,
          userId: 'demo',
          createdAt: new Date().toISOString()
        },
        auction: MOCK_AUCTIONS[id]
      })
    }

    // Lógica real para DB
    // TODO: Get user from session/auth
    // For development, use first user as fallback
    let userId = request.headers.get('x-user-id')

    if (!userId) {
      const firstUser = await prisma.user.findFirst({ where: { status: 'ACTIVE' } })
      if (!firstUser) {
        return NextResponse.json({ error: 'No hay usuarios disponibles' }, { status: 400 })
      }
      userId = firstUser.id
    }

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1
        }
      }
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Subasta no encontrada' },
        { status: 404 }
      )
    }

    // Validate bid
    const currentHighestBid = auction.bids[0]?.amount || auction.startingPrice
    if (amount <= currentHighestBid) {
      return NextResponse.json(
        { error: `La puja debe ser mayor a ${currentHighestBid}` },
        { status: 400 }
      )
    }

    // Create bid
    const bid = await prisma.bid.create({
      data: {
        amount,
        auctionId: id,
        userId: userId
      }
    })

    // Update auction current price
    await prisma.auction.update({
      where: { id },
      data: { currentPrice: amount }
    })

    return NextResponse.json({
      message: 'Puja realizada exitosamente',
      bid
    })

  } catch (error) {
    console.error('Error placing bid:', error)
    return NextResponse.json({ error: 'Error al realizar la puja' }, { status: 500 })
  }
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ message: 'Actualización simulada' })
}