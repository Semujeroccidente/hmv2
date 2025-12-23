import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'
import { processProxyBid } from '@/lib/proxy-bidding'
import { checkTimeExtension } from '@/lib/time-extension'

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

// POST - Hacer una puja con validaciones completas
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: auctionId } = await params
    const body = await request.json()
    const { amount, maxAmount } = body // Agregar maxAmount para proxy bidding

    // Mock data handling (para desarrollo)
    if (MOCK_AUCTIONS[auctionId]) {
      if (!amount || amount <= MOCK_AUCTIONS[auctionId].currentPrice) {
        return NextResponse.json(
          { error: `La puja debe ser mayor a L. ${MOCK_AUCTIONS[auctionId].currentPrice}` },
          { status: 400 }
        )
      }

      MOCK_AUCTIONS[auctionId].currentPrice = amount
      MOCK_AUCTIONS[auctionId].bidCount = (MOCK_AUCTIONS[auctionId].bidCount || 0) + 1

      return NextResponse.json({
        success: true,
        message: 'Puja realizada exitosamente',
        bid: {
          id: `mock-bid-${Date.now()}`,
          amount,
          userId: 'demo',
          createdAt: new Date().toISOString()
        },
        auction: MOCK_AUCTIONS[auctionId]
      })
    }

    // Autenticación (intentar obtener usuario autenticado)
    const authResult = await requireAuth(request)
    let userId: string

    if (authResult.success && authResult.user) {
      userId = authResult.user.id
    } else {
      // Fallback para desarrollo: usar primer usuario activo
      const firstUser = await prisma.user.findFirst({ where: { status: 'ACTIVE' } })
      if (!firstUser) {
        return NextResponse.json({ error: 'Debes iniciar sesión para pujar' }, { status: 401 })
      }
      userId = firstUser.id
    }

    // 1. Obtener subasta con producto y pujas
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true }
            }
          }
        },
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

    // 2. Validar que la subasta está activa
    if (auction.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'La subasta ya ha terminado' },
        { status: 400 }
      )
    }

    // 3. Validar que no ha expirado
    if (new Date(auction.endDate) < new Date()) {
      return NextResponse.json(
        { error: 'La subasta ha expirado' },
        { status: 400 }
      )
    }

    // 4. Validar que el usuario no es el vendedor
    if (auction.product.sellerId === userId) {
      return NextResponse.json(
        { error: 'No puedes pujar en tu propia subasta' },
        { status: 403 }
      )
    }

    // 5. Validar monto mínimo
    const currentHighest = auction.bids[0]?.amount || auction.startingPrice
    const minBid = currentHighest + (auction.bidIncrement || 50)

    if (amount < minBid) {
      return NextResponse.json({
        error: `La puja mínima es L. ${minBid.toFixed(2)}`,
        minBid,
        currentPrice: currentHighest
      }, { status: 400 })
    }

    // 6. Crear puja y actualizar subasta en transacción
    const isProxyBid = maxAmount && maxAmount > amount

    const result = await prisma.$transaction(async (tx) => {
      const bid = await tx.bid.create({
        data: {
          auctionId,
          userId,
          amount,
          maxAmount: isProxyBid ? maxAmount : null,
          isProxy: isProxyBid || false
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      })

      await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: amount,
          bidCount: { increment: 1 },
          lastBidder: userId,
          lastBidTime: new Date(),
          hasProxyBids: isProxyBid ? true : undefined
        }
      })

      return bid
    })

    // 7. Verificar extensión de tiempo (anti-snipe)
    const timeExtension = await checkTimeExtension(auctionId, new Date())

    // 8. Procesar pujas automáticas (proxy bidding)
    const proxyResult = await processProxyBid(
      auctionId,
      amount,
      userId,
      auction.bidIncrement || 50
    )

    return NextResponse.json({
      success: true,
      message: 'Puja realizada exitosamente',
      bid: result,
      auction: {
        currentPrice: proxyResult.counterBidPlaced ? proxyResult.counterBidAmount! : amount,
        bidCount: auction.bidCount + 1 + (proxyResult.counterBidPlaced ? 1 : 0)
      },
      proxyBid: isProxyBid ? {
        enabled: true,
        maxAmount,
        message: `Puja automática configurada hasta L. ${maxAmount}`
      } : undefined,
      timeExtension: timeExtension.extended ? {
        extended: true,
        newEndDate: timeExtension.newEndDate,
        extensionMinutes: timeExtension.extensionMinutes,
        message: `Subasta extendida ${timeExtension.extensionMinutes} minutos`
      } : undefined,
      counterBid: proxyResult.counterBidPlaced ? {
        placed: true,
        amount: proxyResult.counterBidAmount,
        message: 'Otra puja automática te superó'
      } : undefined
    })

  } catch (error) {
    console.error('Error placing bid:', error)
    return NextResponse.json({
      error: 'Error al realizar la puja',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ message: 'Actualización simulada' })
}