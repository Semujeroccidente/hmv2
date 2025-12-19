import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
      prisma.auction.findMany({
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
      prisma.auction.count({ where })
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

    // Schema for creating auction with product
    const auctionSchema = z.object({
      title: z.string().min(5),
      description: z.string().min(20),
      categoryId: z.string(),
      condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
      startingPrice: z.number().positive(),
      reservePrice: z.number().positive().optional().nullable(),
      bidIncrement: z.number().positive(),
      endDate: z.string(),
      images: z.array(z.string()).optional()
    })

    const validatedData = auctionSchema.parse(body)

    // Get user from auth or use first user as fallback
    let userId = request.headers.get('x-user-id')

    if (!userId) {
      const firstUser = await prisma.user.findFirst({ where: { status: 'ACTIVE' } })
      if (!firstUser) {
        return NextResponse.json({ error: 'No hay usuarios disponibles' }, { status: 400 })
      }
      userId = firstUser.id
    }

    // Create product and auction in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate slug from title
      const slug = validatedData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

      // Create the product first
      const product = await tx.product.create({
        data: {
          title: validatedData.title,
          slug,
          description: validatedData.description,
          price: validatedData.startingPrice, // Set initial price
          categoryId: validatedData.categoryId,
          condition: validatedData.condition,
          status: 'ACTIVE',
          sellerId: userId,
          images: validatedData.images ? JSON.stringify(validatedData.images) : null,
          thumbnail: validatedData.images?.[0] || null,
          stock: 1 // Auction items are unique
        }
      })

      // Create the auction
      const auction = await tx.auction.create({
        data: {
          productId: product.id,
          startingPrice: validatedData.startingPrice,
          currentPrice: validatedData.startingPrice,
          reservePrice: validatedData.reservePrice,
          endDate: new Date(validatedData.endDate),
          status: 'ACTIVE'
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
              }
            }
          }
        }
      })

      return auction
    })

    return NextResponse.json({
      message: 'Subasta creada exitosamente',
      auction: result
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