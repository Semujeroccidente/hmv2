import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from './auth-middleware'

/**
 * Verifica que el usuario esté autenticado Y sea administrador
 * Lanza un error si no cumple los requisitos
 */
export async function requireAdmin(request: NextRequest) {
    const user = await verifyAuth(request)

    if (!user) {
        throw new Error('UNAUTHORIZED')
    }

    if (user.role !== 'ADMIN') {
        throw new Error('FORBIDDEN')
    }

    return user
}

/**
 * Maneja errores de autenticación admin
 */
export function handleAdminError(error: any) {
    if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
            { error: 'No estás autenticado' },
            { status: 401 }
        )
    }

    if (error.message === 'FORBIDDEN') {
        return NextResponse.json(
            { error: 'No tienes permisos de administrador' },
            { status: 403 }
        )
    }

    console.error('Admin error:', error)
    return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
    )
}
