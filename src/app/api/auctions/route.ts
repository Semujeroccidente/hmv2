import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createAuctionSchema = z.object({
  productId: z.string(),
  startingPrice: z.number().positive(),
  reservePrice: z.number().positive().optional(),
  duration: z.number().int().min(1).max(30), // Duración en días
  description: z.string().optional()
})

const placeBidSchema = z.object({
  amount: z.number().positive(),
  maxAmount: z.number().positive().optional()
})

// GET - Obtener subastas activas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'ending_soon'
    const status = searchParams.get('status') || 'ACTIVE'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      status
    }

    if (category) {
      where.product = {
        categoryId: category
      }
    }

    if (minPrice || maxPrice) {
      where.currentPrice = {}
      if (minPrice) where.currentPrice.gte = parseFloat(minPrice)
      if (maxPrice) where.currentPrice.lte = parseFloat(maxPrice)
    }

    // Construir ordenamiento
    const orderBy: any = {}
    switch (sortBy) {
      case 'ending_soon':
        orderBy.endDate = 'asc'
        break
      case 'newest':
        orderBy.createdAt = 'desc'
        break
      case 'price_low':
        orderBy.currentPrice = 'asc'
        break
      case 'price_high':
        orderBy.currentPrice = 'desc'
        break
      case 'most_bids':
        orderBy.bidCount = 'desc'
        break
      default:
        orderBy.endDate = 'asc'
    }

    const [auctions, total] = await Promise.all([
      db.auction.findMany({
        where,
        include: {
          product: {
            include: {
              seller: {
                select: {
                  id: true,
                  name: true,
                  rating: true
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
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      db.auction.count({ where })
    ])

    return NextResponse.json({
      auctions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo subastas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva subasta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAuctionSchema.parse(body)

    // TODO: Obtener userId del token JWT
    const userId = 'user-id-temporal' // Usuario temporal para desarrollo

    // Verificar que el producto existe y está disponible
    const product = await db.product.findUnique({
      where: { id: validatedData.productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'El producto no está disponible para subasta' },
        { status: 400 }
      )
    }

    // Crear la subasta
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + validatedData.duration)

    const auction = await db.auction.create({
      data: {
        productId: validatedData.productId,
        startingPrice: validatedData.startingPrice,
        currentPrice: validatedData.startingPrice,
        reservePrice: validatedData.reservePrice,
        endDate,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      message: 'Subasta creada exitosamente',
      auction: {
        id: auction.id,
        productId: auction.productId,
        startingPrice: auction.startingPrice,
        currentPrice: auction.currentPrice,
        reservePrice: auction.reservePrice,
        endDate: auction.endDate,
        status: auction.status,
        bidCount: 0,
        createdAt: auction.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creando subasta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}