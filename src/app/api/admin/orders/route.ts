import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-middleware'
import { createAuditLog } from '@/lib/audit-log'

export async function GET(request: NextRequest) {
  try {
    // Verify admin role
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
      where['OR'] = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { buyer: { name: { contains: search, mode: 'insensitive' } } },
        { buyer: { email: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (status) {
      where['status'] = status
    }

    // Get orders with pagination and sorting
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  price: true
                }
              }
            }
          },
          shippingAddress: true
        }
      }),
      prisma.order.count({ where })
    ])

    // Transform data for frontend
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      buyerName: order.buyer.name,
      buyerEmail: order.buyer.email,
      itemCount: order.orderItems.length,
      items: order.orderItems.map(item => ({
        id: item.id,
        productName: item.product.title,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    })
  } catch (error: any) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin role
    await requireAdmin(request)

    const {
      buyerId,
      orderItems,
      shippingAddress,
      status = 'PENDING'
    } = await request.json()

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingCost = 250 // Fixed shipping cost
    const tax = subtotal * 0.15 // 15% tax
    const total = subtotal + shippingCost + tax

    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    // Create new order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId,
        subtotal,
        shippingCost,
        tax,
        total,
        status,
        shippingAddress: {
          create: shippingAddress
        },
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          }))
        }
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true
              }
            }
          }
        },
        shippingAddress: true
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    )
  }
}