import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

// GET - Obtener contador de mensajes no leídos
export async function GET(request: NextRequest) {
    try {
        // Autenticación
        const user = await verifyAuth(request)
        if (!user) {
            return NextResponse.json(
                { unreadCount: 0 },
                { status: 200 }
            )
        }

        // Contar mensajes no leídos
        const unreadCount = await prisma.message.count({
            where: {
                receiverId: user.userId,
                read: false
            }
        })

        return NextResponse.json({
            unreadCount
        })

    } catch (error) {
        console.error('Error getting unread count:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
