import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addToCartSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1')
})

// GET - Obtener carrito
export async function GET(request: NextRequest) {
  try {
    // TODO: Obtener usuario real
    const user = await prisma.user.findFirst()
    const userId = user?.id || 'demo-user'

    let cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: { id: true, name: true, rating: true }
                }
              }
            }
          }
        }
      }
    })

    if (!cart && user) {
      cart = await prisma.cart.create({
        data: { userId, status: 'ACTIVE' },
        include: { items: { include: { product: { include: { seller: { select: { id: true, name: true, rating: true } } } } } } }
      })
    }

    // Transformar datos para compatibilidad con el frontend si es necesario
    // Pero el frontend usa lo que devolvemos aqui.
    // Necesitamos calcular totales si no están actualizados en DB (normalmente se hace al modificar)

    // Simplificación: Devolver cart tal cual, asumiendo que el frontend maneja la estructura

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Error obteniendo carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Añadir al carrito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = addToCartSchema.parse(body)

    // TODO: Obtener usuario real
    const user = await prisma.user.findFirst()
    const userId = user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Asegurar carrito activo
    let cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, status: 'ACTIVE' }
      })
    }

    // Verificar producto
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    // Upsert item
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: validatedData.productId }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + validatedData.quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
          price: product.price
        }
      })
    }

    // Recalcular totales (simple)
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true }
    })

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subtotal * 0.15
    const total = subtotal + tax

    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: { total }, // Nota: Schema tiene solo 'total', podríamos agregar subtotal/tax si quisiéramos persistir eso
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: { id: true, name: true, rating: true }
                }
              }
            }
          }
        }
      }
    })

    // Inject computed fields for frontend
    const responseCart = {
      ...updatedCart,
      subtotal,
      tax,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
      shipping: 0 // Mock shipping
    }

    return NextResponse.json({
      message: 'Producto añadido',
      cart: responseCart
    }, { status: 201 })

  } catch (error) {
    console.error('Error cart:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}