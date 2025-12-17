import { NextRequest, NextResponse } from 'next/server'
import { globalStore } from '@/lib/mock-data'

// POST - Limpiar todo el carrito
export async function POST(request: NextRequest) {
  try {
    // Limpiar items
    globalStore.cart.items = []

    // Resetear totales
    globalStore.cart.subtotal = 0
    globalStore.cart.tax = 0
    globalStore.cart.shipping = 0
    globalStore.cart.total = 0
    globalStore.cart.itemCount = 0

    return NextResponse.json({
      message: 'Carrito limpiado exitosamente'
    })

  } catch (error) {
    console.error('Error limpiando carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}