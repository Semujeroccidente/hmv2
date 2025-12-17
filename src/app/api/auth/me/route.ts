import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Simulamos autenticación obteniendo el primer usuario disponible
    // En el futuro esto se reemplazará por getServerSession(authOptions)
    const user = await prisma.user.findFirst({
      include: {
        // Incluir datos relevantes si es necesario
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error en /me:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}