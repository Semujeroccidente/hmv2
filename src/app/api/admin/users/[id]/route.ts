import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Obtener detalles de un usuario
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verificar que el usuario es admin
    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        rating: true,
        salesCount: true,
        createdAt: true,
        updatedAt: true,
        address: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Obtener pedidos del usuario
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                thumbnail: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Calcular estadísticas del vendedor
    const stats = await prisma.order.aggregate({
      where: { userId },
      _count: true,
      _sum: {
        total: true
      },
      _avg: {
        total: true
      }
    })

    return NextResponse.json({
      user: {
        ...user,
        stats,
        orders
      }
    })

  } catch (error) {
    console.error('Error obteniendo detalles del usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}