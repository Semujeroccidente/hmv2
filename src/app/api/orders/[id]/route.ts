import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT - Actualizar estado de un pedido
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, paymentStatus } = body

    // TODO: Verificar que el pedido pertenece al usuario
    const order = await db.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Validar transición de estados
    const validTransitions = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': [], // Estado final
      'CANCELLED': [] // Estado final
    }

    if (status && !validTransitions[order.status as keyof typeof validTransitions]?.includes(status)) {
      return NextResponse.json(
        { error: 'Transición de estado no válida' },
        { status: 400 }
      )
    }

    // Actualizar pedido
    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      }
    })

    return NextResponse.json({
      message: 'Pedido actualizado exitosamente',
      order: updatedOrder
    })

  } catch (error) {
    console.error('Error actualizando pedido:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener detalles de un pedido
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verificar que el pedido pertenece al usuario
    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    rating: true,
                    phone: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Error obteniendo pedido:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}