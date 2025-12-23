import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    try {
      let decoded: any
    try {
      decoded = jwt.verify(token, getJWTSecret())
    } catch {
      throw new Error('INVALID_TOKEN')
    }
    
    // Validate token structure
    if (!decoded.userId || !decoded.email || !decoded.role) {
      throw new Error('INVALID_TOKEN')
    }

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