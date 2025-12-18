import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Crear una nueva categoría (admin)
export async function POST(request: NextRequest) {
  try {
    const { name, description, icon, parentId } = await request.json()

    // Validar que no exista una categoría con el mismo nombre
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase()
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con este nombre' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon,
        parentId: parentId || null
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Categoría creada exitosamente',
      category
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener todas las categorías (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeChildren = searchParams.get('includeChildren') === 'true'
    const parentId = searchParams.get('parentId')
    const hierarchical = searchParams.get('hierarchical') === 'true'

    let categories

    if (hierarchical) {
      // Get hierarchical structure (parent with children)
      categories = await prisma.category.findMany({
        where: {
          parentId: null // Only parent categories
        },
        include: {
          children: {
            include: {
              _count: {
                select: {
                  products: true
                }
              }
            },
            orderBy: {
              name: 'asc'
            }
          },
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } else if (parentId !== undefined) {
      // Get subcategories of a specific parent
      categories = await prisma.category.findMany({
        where: {
          parentId: parentId === 'null' ? null : parentId
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true
            }
          },
          children: includeChildren ? {
            include: {
              _count: {
                select: {
                  products: true
                }
              }
            },
            orderBy: {
              name: 'asc'
            }
          } : false,
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
    } else {
      // Get all categories (flat list with relationships)
      categories = await prisma.category.findMany({
        include: {
          parent: {
            select: {
              id: true,
              name: true
            }
          },
          children: includeChildren ? {
            select: {
              id: true,
              name: true
            }
          } : false,
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: [
          { parentId: 'asc' }, // Parent categories first
          { name: 'asc' }
        ]
      })
    }

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