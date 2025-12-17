import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// GET - Obtener detalles de un usuario
export async function GET(
  request: NextRequest,
  { params }: { id: string }
) {
  try {
    // TODO: Verificar que el usuario es admin
    const userId = 'admin-id-temporal' // Admin temporal para desarrollo

    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        rating: true,
        salesCount: 0,
        createdAt: true,
        updatedAt: true,
        address: {
          street: null,
          city: null,
          state: null,
          zipCode: null,
          country: 'HN'
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Obtener pedidos del usuario
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          product: {
            include: {
              seller: {
                id: true,
                title: true,
                images: true,
                thumbnail: true
              }
            }
          }
        },
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }
    })

    // Calcular estadísticas del vendedor
    const stats = await db.order.aggregate({
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