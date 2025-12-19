import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'

const updateCartSchema = z.object({
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1')
})

// PUT - Actualizar cantidad de un item en el carrito
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const user = await requireAuth(request)

    const body = await request.json()
    const validatedData = updateCartSchema.parse(body)

    // Buscar el item del carrito
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: {
        cart: true,
        product: true
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item no encontrado en el carrito' },
        { status: 404 }
      )
    }

    // Verificar que el carrito pertenece al usuario
    if (cartItem.cart.userId !== user.userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este carrito' },
        { status: 403 }
      )
    }

    // Verificar stock
    if (cartItem.product.stock < validatedData.quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      )
    }

    // Actualizar cantidad
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity: validatedData.quantity },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, rating: true }
            }
          }
        }
      }
    })

    // Recalcular totales del carrito
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cartItem.cartId }
    })

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subtotal * 0.15
    const shipping = subtotal > 1000 ? 0 : 150
    const total = subtotal + tax + shipping

    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { total }
    })

    return NextResponse.json({
      message: 'Cantidad actualizada',
      item: updatedItem
    })

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}

// DELETE - Eliminar un item del carrito
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const user = await requireAuth(request)

    // Buscar el item del carrito
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: {
        cart: true
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Item no encontrado en el carrito' },
        { status: 404 }
      )
    }

    // Verificar que el carrito pertenece al usuario
    if (cartItem.cart.userId !== user.userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este carrito' },
        { status: 403 }
      )
    }

    // Eliminar item
    await prisma.cartItem.delete({
      where: { id: params.id }
    })

    // Recalcular totales del carrito
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cartItem.cartId }
    })

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subtotal * 0.15
    const shipping = subtotal > 1000 ? 0 : 150
    const total = subtotal + tax + shipping

    await prisma.cart.update({
      where: { id: cartItem.cartId },
      data: { total }
    })

    return NextResponse.json({
      message: 'Item eliminado del carrito'
    })

  } catch (error: any) {
    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}