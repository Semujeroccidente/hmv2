import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET - Obtener pedidos del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // TODO: Obtener userId del token JWT
    // Por ahora usamos el primer usuario de la DB
    const user = await prisma.user.findFirst()
    const userId = user?.id

    if (!userId) {
      return NextResponse.json({ orders: [], pagination: { page, limit, total: 0, pages: 0 } })
    }

    // Construir filtros de DB
    const where: Prisma.OrderWhereInput = {
      userId
    }

    if (status) {
      // Validar si el status es válido para el enum si es necesario
      where.status = status as any
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

  } catch (error) {
    console.error('Error general en pedidos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
