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

    // Get products with pagination and sorting
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              favorites: true,
              views: true,
              orderItems: true
            }
          }
        }
      }),
      db.product.count({ where })
    ])

    // Transform data for frontend
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      status: product.status,
      condition: product.condition,
      sellerName: product.seller.name,
      sellerEmail: product.seller.email,
      categoryName: product.category.name,
      createdAt: product.createdAt,
      views: product._count.views || 0,
      favoritesCount: product._count.favorites || 0,
      salesCount: product._count.orderItems || 0
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      price,
      condition,
      categoryId,
      sellerId,
      images,
      status = 'ACTIVE'
    } = await request.json()

    // Create new product
    const product = await db.product.create({
      data: {
        title,
        description,
        price,
        condition,
        categoryId,
        sellerId,
        images: images || [],
        status
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    )
  }
}