import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-middleware'
import { z } from 'zod'

// GET - Obtener detalles de un usuario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin(request)

    const { id: userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        rating: true,
        role: true,
        salesCount: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        bio: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Obtener pedidos del usuario
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                thumbnail: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Calcular estadísticas del usuario
    const stats = await prisma.order.aggregate({
      where: { userId },
      _count: true,
      _sum: {
        total: true
      },
      _avg: {
        total: true
      }
    })

    return NextResponse.json({
      user: {
        ...user,
        stats,
        orders
      }
    })

  } catch (error) {
    return handleAdminError(error)
  }
}

// PATCH - Actualizar usuario (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar que el usuario es admin
    await requireAdmin(request)

    const { id: userId } = await params
    const body = await request.json()

    const updateSchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(['USER', 'SELLER', 'ADMIN']).optional(),
      phone: z.string().optional(),
      bio: z.string().optional()
    })

    const validatedData = updateSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        bio: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }
    return handleAdminError(error)
  }
}

// DELETE - Eliminar usuario (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar que el usuario es admin
    const admin = await requireAdmin(request)

    const { id: userId } = await params

    // No permitir que el admin se elimine a sí mismo
    if (userId === admin.userId) {
      return NextResponse.json(
        { error: 'No puedes eliminarte a ti mismo' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente'
    })

  } catch (error) {
    return handleAdminError(error)
  }
}