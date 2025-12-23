import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, handleAdminError } from '@/lib/auth-utils'

// GET - Obtener una categoría específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    await requireAdmin(request)
    
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
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
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar una categoría
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    await requireAdmin(request)
    
    const { name, description, icon, parentId } = await request.json()

    // Validar que no exista otra categoría con el mismo nombre (excepto la actual)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase(),
        id: { not: params.id }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Ya existe una categoría con este nombre' },
        { status: 400 }
      )
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
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
      message: 'Categoría actualizada exitosamente',
      category: updatedCategory
    })
  } catch (error: any) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar parcialmente una categoría
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()

    // Si se actualiza el nombre, verificar que no exista otra categoría con el mismo nombre
    if (updates.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: updates.name.toLowerCase(),
          id: { not: params.id }
        }
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con este nombre' },
          { status: 400 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...updates,
        parentId: updates.parentId || null
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
      message: 'Categoría actualizada exitosamente',
      category: updatedCategory
    })
  } catch (error: any) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una categoría
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role
    await requireAdmin(request)
    
    // Verificar si hay productos asociados
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!categoryWithProducts) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 404 }
      )
    }

    if (categoryWithProducts._count.products > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría que tiene productos asociados' },
        { status: 400 }
      )
    }

    // Verificar si hay subcategorías
    const subcategoriesCount = await prisma.category.count({
      where: { parentId: params.id }
    })

    if (subcategoriesCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría que tiene subcategorías' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Categoría eliminada exitosamente'
    })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}