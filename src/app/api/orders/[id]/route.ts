import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'

// PUT - Actualizar estado de un pedido
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, paymentStatus } = body

    // Verificar autenticación
    const user = await requireAuth(request)

    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el pedido pertenece al usuario
    if (order.userId !== user.userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este pedido' },
        { status: 403 }
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
    const updatedOrder = await prisma.order.update({
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

  } catch (error: any) {
    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}

// GET - Obtener detalles de un pedido
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const user = await requireAuth(request)

    const order = await prisma.order.findUnique({
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

    // Verificar que el pedido pertenece al usuario
    if (order.userId !== user.userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para ver este pedido' },
        { status: 403 }
      )
    }

    return NextResponse.json({ order })

  } catch (error: any) {
    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}