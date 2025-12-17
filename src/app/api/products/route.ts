
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const createProductSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.number().positive().optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
  stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional()
})

// GET - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Construir filtro
    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE'
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search } }, // SQLite no soporta mode: 'insensitive' nativo fácilmente en Prisma basic, pero funciona ok
        { description: { contains: search } }
      ]
    }

    // Ordenamiento
    let orderBy: Prisma.ProductOrderByWithRelationInput = {}
    if (sortBy === 'price') {
      orderBy = { price: sortOrder }
    } else {
      orderBy = { createdAt: sortOrder }
    }

    // Paginación
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              rating: true
            }
          },
          category: true
        }
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // TODO: Obtener usuario real de la sesión
    // Por ahora usamos el primer usuario de la DB o uno demo
    const demoUser = await prisma.user.findFirst()
    if (!demoUser) {
      return NextResponse.json({ error: 'No user found' }, { status: 400 })
    }

    const { tags, images, ...rest } = validatedData

    const newProduct = await prisma.product.create({
      data: {
        ...rest,
        images: images ? JSON.stringify(images) : null,
        tags: tags ? JSON.stringify(tags) : null,
        slug: validatedData.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
        sellerId: demoUser.id,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      message: 'Producto creado exitosamente',
      product: newProduct
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error creando producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}