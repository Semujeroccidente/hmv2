import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { JWTPayload, AuthUser } from '@/types/auth'

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

/**
 * Verifica el token JWT de las cookies y devuelve el usuario autenticado
 * @param request - NextRequest object
 * @returns AuthUser si el token es válido, null si no hay token o es inválido
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            return null
        }

        const decoded: any = jwt.verify(token, getJWTSecret())

        // Validate structure
        if (!decoded.userId || !decoded.email || !decoded.role) {
            return null
        }

        return {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        }
    } catch (error) {
        console.error('Error verifying auth token:', error)
        return null
    }
}

/**
 * Verifica que el usuario esté autenticado
 * Lanza un error si no está autenticado
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
    const user = await verifyAuth(request)

    if (!user) {
        throw new Error('UNAUTHORIZED')
    }

    return user
}

/**
 * Maneja errores de autenticación y devuelve la respuesta apropiada
 */
export function handleAuthError(error: any) {
    if (error.message === 'UNAUTHORIZED') {
        return {
            error: 'No estás autenticado',
            status: 401
        }
    }

    if (error.message === 'FORBIDDEN') {
        return {
            error: 'No tienes permisos para realizar esta acción',
            status: 403
        }
    }

    return {
        error: 'Error interno del servidor',
        status: 500
    }
}
