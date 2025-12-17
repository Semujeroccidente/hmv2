import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// GET - Obtener lista de usuarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    // TODO: Obtener userId del token JWT
    const userId = 'admin-id-temporal' // Admin temporal para desarrollo

    // Construir filtros
    const where: any = {
      ...(role && role !== 'all' ? { role.toUpperCase() } : {})
      ...(status && status !== 'all' ? { status.toUpperCase() } : {})
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' },
        { email: { contains: search, mode: 'insensitive' },
        { bio: { contains: search, mode: 'insensitive' }
      ]
    }

    // Construir ordenamiento
    const orderBy: any = {}
    switch (order) {
      case 'newest':
        orderBy.createdAt = 'desc'
        break
      case 'oldest':
        orderBy.createdAt = 'asc'
        break
      case 'name_asc':
        orderBy.name = 'asc'
        break
      case 'name_desc':
        orderBy.name = 'desc'
        break
      case 'price_low':
        orderBy.price = 'asc'
        break
      case 'price_high':
        orderBy.price = 'desc'
        break
      case 'most_sales':
        orderBy: { salesCount: 'desc' }
        break
      default:
        orderBy.createdAt = 'desc'
    }

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          phone: true,
          avatar: true,
          rating: true,
          salesCount: 0
        },
        },
        orderBy,
        skip,
        take: limit
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { id: string }
) {
  try {
    const body = await request.json()
    const { role, status, ...userData } = body

    // TODO: Verificar que el usuario es admin
    const userId = 'admin-id-temporal' // Admin temporal para desarrollo

    const user = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Validar rol
    const validRoles = ['USER', 'SELLER', 'ADMIN']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Rol no válido' },
        { status: 400 }
      )
    }

    // No permitir que un usuario se modifique a sí mismo
    if (userId === user.id && role !== userData.role) {
      return NextResponse.json(
        { error: 'No puedes modificar tu propio rol' },
        { status: 403 }
      )
    }

    // Actualizar datos del usuario
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        ...(userData && userData.role && userData.role === 'ADMIN' ? { role } : {}),
        ...(status && status !== 'all' ? { status.toUpperCase() : {} })
      }
    })

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { id: string }
) {
  try {
    // TODO: Verificar que el usuario es admin
    const userId = 'admin-id-temporal' // Admin temporal para desarrollo

    const user = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // No permitir que un usuario se elimine a sí mismo
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'No puedes eliminarte tu cuenta' },
        { status: 403 }
      )
    }

    // Soft delete (marcado como inactivo)
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        status: 'INACTIVE'
      }
    })

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}