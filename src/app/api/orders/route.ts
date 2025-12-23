import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus } from '@prisma/client'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'

// GET - Obtener pedidos del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // Verificar autenticación
    const user = await requireAuth(request)
    const userId = user.userId

    // Construir filtros de DB
    const where: Prisma.OrderWhereInput = {
      userId
    }

    if (status) {
      // Validate status is a valid OrderStatus enum value
      if (Object.values(OrderStatus).includes(status as OrderStatus)) {
        where.status = status as OrderStatus
      }
    }

    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  thumbnail: true,
                  images: true,
                  seller: {
                    select: { name: true, rating: true }
                  }
                }
              }
            }
          }
          // shippingAddress field is Json type in schema, so it's included by default
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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
