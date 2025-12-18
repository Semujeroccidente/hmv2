import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'

const addToCartSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1')
})

// GET - Obtener carrito
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await requireAuth(request)
    const userId = user.userId

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

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, status: 'ACTIVE' },
        include: { items: { include: { product: { include: { seller: { select: { id: true, name: true, rating: true } } } } } } }
      })
    }

    return NextResponse.json({ cart })
  } catch (error: any) {
    const authError = handleAuthError(error)
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    )
  }
}

// POST - Añadir al carrito
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = addToCartSchema.parse(body)

    // Verificar autenticación
    const user = await requireAuth(request)
    const userId = user.userId

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
      data: { total },
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

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.issues }, { status: 400 })
    }

    const authError = handleAuthError(error)
    return NextResponse.json({ error: authError.error }, { status: authError.status })
  }
}