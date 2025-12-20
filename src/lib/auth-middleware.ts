import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
    userId: string
    email: string
    role: string
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

        const decoded = jwt.verify(token, JWT_SECRET) as any

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
 * Verifica que el usuario sea admin
 * Lanza un error si no está autenticado o no es admin
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
    const user = await requireAuth(request)

    if (user.role !== 'ADMIN') {
        throw new Error('FORBIDDEN')
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
