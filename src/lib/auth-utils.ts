import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

function getJWTSecret(): string {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required')
    }
    return secret
}

export interface JWTPayload {
    userId: string
    email: string
    role: Role
    iat: number
    exp: number
}

export interface AuthUser {
    userId: string
    email: string
    role: Role
}

/**
 * Require admin role for the request
 * Throws error if user is not authenticated or not an admin
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
        throw new Error('UNAUTHORIZED')
    }

    let decoded: any
    try {
        decoded = jwt.verify(token, getJWTSecret())
    } catch {
        throw new Error('INVALID_TOKEN')
    }

    // Validate decoded token structure
    if (!decoded.userId || !decoded.email || !decoded.role) {
        throw new Error('INVALID_TOKEN')
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true }
    })

    if (!user) {
        throw new Error('USER_NOT_FOUND')
    }

    if (user.role !== 'ADMIN') {
        throw new Error('FORBIDDEN')
    }

    return {
        userId: user.id,
        email: user.email,
        role: user.role
    }
}

/**
 * Handle admin authentication errors
 */
export function handleAdminError(error: any): { error: string; status: number } {
    if (error.message === 'UNAUTHORIZED') {
        return { error: 'No autenticado', status: 401 }
    }
    if (error.message === 'INVALID_TOKEN') {
        return { error: 'Token inválido', status: 401 }
    }
    if (error.message === 'FORBIDDEN') {
        return { error: 'No autorizado - Se requiere rol de administrador', status: 403 }
    }
    if (error.message === 'USER_NOT_FOUND') {
        return { error: 'Usuario no encontrado', status: 404 }
    }
    return { error: 'Error interno del servidor', status: 500 }
}
