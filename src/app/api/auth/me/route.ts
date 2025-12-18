import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true
        }
      })

      if (!user) {
        return NextResponse.json({ user: null }, { status: 200 })
      }

      return NextResponse.json({ user })

    } catch (error) {
      // Token inválido o expirado
      return NextResponse.json({ user: null }, { status: 200 })
    }

  } catch (error) {
    console.error('Error en /me:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}