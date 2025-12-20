import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, handleAuthError } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where = {}

    if (search) {
      where['product'] = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    if (status) {
      where['status'] = status
    }

    // Get auctions with pagination and sorting
    const [auctions, totalCount] = await Promise.all([
      prisma.auction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          id: true,
          startingPrice: true,
          currentPrice: true,
          reservePrice: true,
          status: true,
          endDate: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              title: true,
              description: true,
              condition: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              bids: true
            }
          }
        }
      }),
      prisma.auction.count({ where })
    ])

    // Transform data for frontend
    const transformedAuctions = auctions.map(auction => ({
      id: auction.id,
      title: auction.product.title,
      description: auction.product.description,
      startingPrice: auction.startingPrice,
      currentPrice: auction.currentPrice,
      reservePrice: auction.reservePrice,
      status: auction.status,
      endDate: auction.endDate,
      sellerName: auction.product.seller.name,
      sellerEmail: auction.product.seller.email,
      productName: auction.product.title,
      productCondition: auction.product.condition,
      bidCount: auction._count.bids || 0,
      createdAt: auction.createdAt
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      auctions: transformedAuctions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    })
  } catch (error: any) {
    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin(request)
    const {
      startingPrice,
      reservePrice,
      endDate,
      productId
    } = await request.json()

    // Create new auction
    const auction = await prisma.auction.create({
      data: {
        startingPrice,
        currentPrice: startingPrice,
        reservePrice,
        endDate: new Date(endDate),
        productId,
        status: 'ACTIVE'
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            condition: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(auction, { status: 201 })
  } catch (error: any) {
    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}