import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            rating: true,
            avatar: true
          }
        },
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // En una app real, validaríamos que el usuario sea el dueño
    const product = await prisma.product.update({
      where: { id },
      data: body
    })

    return NextResponse.json({ message: 'Producto actualizado incorrectamente', product })
  } catch (error) {
    return NextResponse.json({ error: 'Error actualizando producto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // En una app real, validariamos el dueño
    await prisma.product.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error eliminando producto' }, { status: 500 })
  }
}