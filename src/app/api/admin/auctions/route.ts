import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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
      where['OR'] = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status) {
      where['status'] = status
    }

    // Get auctions with pagination and sorting
    const [auctions, totalCount] = await Promise.all([
      db.auction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
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
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              bids: true
            }
          }
        }
      }),
      db.auction.count({ where })
    ])

    // Transform data for frontend
    const transformedAuctions = auctions.map(auction => ({
      id: auction.id,
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice,
      currentPrice: auction.currentPrice,
      reservePrice: auction.reservePrice,
      status: auction.status,
      endDate: auction.endDate,
      sellerName: auction.seller.name,
      sellerEmail: auction.seller.email,
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
  } catch (error) {
    console.error('Error fetching admin auctions:', error)
    return NextResponse.json(
      { error: 'Error fetching auctions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      startingPrice,
      reservePrice,
      endDate,
      productId,
      sellerId
    } = await request.json()

    // Create new auction
    const auction = await db.auction.create({
      data: {
        title,
        description,
        startingPrice,
        currentPrice: startingPrice,
        reservePrice,
        endDate: new Date(endDate),
        productId,
        sellerId,
        status: 'ACTIVE'
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
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
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(auction, { status: 201 })
  } catch (error) {
    console.error('Error creating auction:', error)
    return NextResponse.json(
      { error: 'Error creating auction' },
      { status: 500 }
    )
  }
}