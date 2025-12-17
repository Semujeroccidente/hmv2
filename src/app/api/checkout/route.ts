import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().positive()
  })),
  shippingAddress: z.object({
    street: z.string().min(1, 'La calle es requerida'),
    city: z.string().min(1, 'La ciudad es requerida'),
    state: z.string().min(1, 'El departamento es requerido'),
    zipCode: z.string().min(1, 'El código postal es requerido'),
    country: z.string().default('HN')
  }),
  paymentMethod: z.enum(['CARD', 'PAYPAL', 'CASH', 'TRANSFER']),
  notes: z.string().optional()
})

// POST - Procesar checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // TODO: Obtener userId del token JWT
    const userId = 'user-id-temporal' // Usuario temporal para desarrollo

    // Verificar stock disponible para todos los items
    for (const item of validatedData.items) {
      // ... handled by regex replacement in actual diff ...
      // Actually, I should use replace_file_content multiple times or use multi_replace.
      // Since 'db.' appears many times, strict replace_file_content with regex isn't supported directly like that.
      // I'll just replace the whole file content or use multi_replace for specific blocks if I can match them.
      // But wait, allow_multiple=true is supported.
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 400 }
        )
      }

      if (product.status !== 'ACTIVE' || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Producto ${product.title} no tiene stock suficiente` },
          { status: 400 }
        )
      }
    }

    // Calcular totales
    const subtotal = validatedData.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)

    const shippingCost = calculateShippingCost(subtotal, validatedData.shippingAddress)
    const tax = subtotal * 0.15 // 15% ISV Honduras
    const total = subtotal + shippingCost + tax

    // Generar número de pedido único
    const orderNumber = generateOrderNumber()

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: validatedData.shippingAddress,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Actualizar stock de productos
    for (const item of validatedData.items) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // Convertir carrito a estado CONVERTED
    const cart = await db.cart.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      }
    })

    if (cart) {
      await db.cart.update({
        where: { id: cart.id },
        data: {
          status: 'CONVERTED'
        }
      })
    }

    return NextResponse.json({
      message: 'Pedido creado exitosamente',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal,
        shippingCost,
        tax,
        total,
        items: order.items.length
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error en checkout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para calcular costo de envío
function calculateShippingCost(subtotal: number, address: any): number {
  // Lógica simple de envío para Honduras
  if (subtotal >= 5000) {
    return 0 // Envío gratis para compras mayores a L.5,000
  }

  // Tarifas básicas por departamento
  const shippingRates = {
    'Francisco Morazán': 150,
    'Cortés': 120,
    'Atlántida': 130,
    'Yoro': 140,
    'Copán': 110,
    'Olancho': 160,
    'Santa Bárbara': 100,
    'Gracias a Dios': 90,
    'Lempira': 120,
    'Intibucá': 110,
    'La Paz': 100,
    'Islas de la Bahía': 150,
    'Valle': 130,
    'Choluteca': 110
  }

  return shippingRates[address.state] || 100
}

// Función para generar número de pedido único
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `HN-${timestamp}-${random}`
}