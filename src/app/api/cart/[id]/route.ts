import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { globalStore } from '@/lib/mock-data'

const updateCartSchema = z.object({
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1')
})

// PUT - Actualizar cantidad de un item en el carrito
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateCartSchema.parse(body)

    // Buscar item en el carrito global
    const itemIndex = globalStore.cart.items.findIndex((item: any) => item.id === params.id)

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item no encontrado en el carrito' },
        { status: 404 }
      )
    }

    // Verificar stock (simulado)
    const currentItem = globalStore.cart.items[itemIndex]
    if (currentItem.product.stock < validatedData.quantity) {
      return NextResponse.json(
        { error: 'Stock insuficiente' },
        { status: 400 }
      )
    }

    // Actualizar cantidad
    globalStore.cart.items[itemIndex].quantity = validatedData.quantity

    // Recalcular totales
    let subtotal = 0
    globalStore.cart.items.forEach((item: any) => {
      subtotal += item.price * item.quantity
    })

    globalStore.cart.subtotal = subtotal
    globalStore.cart.tax = subtotal * 0.15
    globalStore.cart.shipping = subtotal > 1000 ? 0 : 150
    globalStore.cart.total = subtotal + globalStore.cart.tax + globalStore.cart.shipping
    globalStore.cart.itemCount = globalStore.cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0)

    return NextResponse.json({
      message: 'Cantidad actualizada',
      item: globalStore.cart.items[itemIndex]
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error actualizando item del carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un item del carrito
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const itemIndex = globalStore.cart.items.findIndex((item: any) => item.id === params.id)

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item no encontrado en el carrito' },
        { status: 404 }
      )
    }

    // Eliminar item
    globalStore.cart.items.splice(itemIndex, 1)

    // Recalcular totales
    let subtotal = 0
    globalStore.cart.items.forEach((item: any) => {
      subtotal += item.price * item.quantity
    })

    globalStore.cart.subtotal = subtotal
    globalStore.cart.tax = subtotal * 0.15
    globalStore.cart.shipping = subtotal > 1000 ? 0 : 150
    globalStore.cart.total = subtotal + globalStore.cart.tax + globalStore.cart.shipping
    globalStore.cart.itemCount = globalStore.cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0)

    return NextResponse.json({
      message: 'Item eliminado del carrito'
    })

  } catch (error) {
    console.error('Error eliminando item del carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}