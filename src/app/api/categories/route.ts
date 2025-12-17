import { NextRequest, NextResponse } from 'next/server'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional()
})

// GET - Obtener todas las categorías (MOCK)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeChildren = searchParams.get('includeChildren') === 'true'
    const parentId = searchParams.get('parentId')
    const hierarchical = searchParams.get('hierarchical') === 'true'

    // En mock mode simplificamos la lógica jerárquica
    // Asumimos que MOCK_CATEGORIES son padres
    let categories = [...MOCK_CATEGORIES]

    return NextResponse.json({
      categories,
      total: categories.length,
      hierarchical: hierarchical || includeChildren
    })

  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva categoría (MOCK)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = {
      id: `cat-${Date.now()}`,
      ...validatedData
    }

    // Agregar a mock (temporal)
    MOCK_CATEGORIES.push(category as any)

    return NextResponse.json({
      message: 'Categoría creada exitosamente (MOCK)',
      category
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}