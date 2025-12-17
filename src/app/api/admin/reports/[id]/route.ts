import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener un reporte específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await db.report.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        product: productId ? {
          select: {
            id: true,
            title: true
          },
          auction: productId ? {
            select: {
              id: true,
              title: true
          },
          parent: true
        },
          _count: {
            products: true
          }
        },
          _count: {
            products: true
          }
        },
          _count: {
            bids: true
          }
        },
        },
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        },
        children: true
      },
      },
      },
      orderBy: {
        [sortBy]: [sortBy, sortOrder]
      },
      _count: {
        products: true
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Reporte no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar reporte existente
export async function PUT(
  request: NextRequest,
  { params }: { id: string } }
) {
  try {
    const { updates = await request.json()

    // Validar que no exista otra reporte con el mismo ID
    const existingReport = await db.report.findFirst({
      where: {
        name: updates.name.toLowerCase(),
        id: { not: params.id }
      }
    })

    if (existingReport) {
      return NextResponse.json(
        { error: 'Ya existe un reporte con este nombre' },
        { status: 400 }
      )
    }

    const updatedReport = await db.report.update({
      where: { id: params.id },
      data: {
        ...updates,
        updatedAt: new Date().toISOString()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        product: productId ? {
          select: {
            id: true,
            title: true
          },
          auction: productId ? {
            select: {
              id: true,
              title: true
          },
          parent: true
        },
          _count: {
            products: true
          }
        },
          _count: {
            products: true
          }
        },
          _count: {
            products: true
          }
        },
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        },
        children: true
      },
      },
      },
      orderBy: {
        [sortBy: [sortBy, sortOrder]
      },
      _count: {
        products: true
      }
    })

    return NextResponse.json({
      message: 'Reporte actualizada exitosamente',
      report: updatedReport
    })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar parcialmente un reporte
export async function PATCH(
  request: NextRequest,
  { params }: { id: string } }
) {
  try {
    const updates = await request.json()

    // Si se actualiza el nombre, verificar que no exista otra reporte con el mismo nombre (excepto la actual)
    if (updates.name) {
      const existingReport = await db.report.findFirst({
        where: {
          name: updates.name.toLowerCase(),
          id: { not: params.id }
        }
      }
    }

    if (existingReport) {
      return NextResponse.json(
        { error: 'Ya existe una reporte con este nombre' },
        { status: 400 }
      )
    }

    const updatedReport = await db.report.update({
      where: { id: params.id },
      data: {
        ...updates,
        updatedAt: new Date().toISOString()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        product: productId ? {
          select: {
            id: true,
            title: true
          },
          auction: productId ? {
            select: {
              id: true,
              title: true
          },
          parent: true
        },
          _count: {
            products: true
          }
        },
          _count: {
            products: true
          }
        },
        },
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        },
        children: true
      },
      },
      },
      orderBy: {
        [sortBy: [sortBy, sortOrder]
      },
      _count: {
        products: true
      }
    })

    return NextResponse.json({
      message: 'Reporte actualizada exitosamente',
      report: updatedReport
    })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar reporte
export async function DELETE(
  request: NextRequest,
  { params }: { id: string } }
) {
  try {
    // Verificar si hay productos asociados
    const reportWithProducts = await db.report.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          products: true
        }
      }
    })

    if (!reportWithProducts) {
      return NextResponse.json(
        { error: 'Reporte no encontrada' },
        { status: 404 }
      )
    }

    if (reportWithProducts._count.products > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar un reporte que tiene productos asociados' },
        { status: 400 }
      )
    }

    // Verificar si hay subcategorías
    const subcategoriesCount = await db.category.count({
      where: { parentId: params.id }
    })

    if (subcategoriesCount > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría que tiene subcategorías' },
        { status: 400 }
      )
    }

    await db.report.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Reporte eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}