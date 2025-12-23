import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

// PATCH - Marcar toda una conversación como leída
export async function PATCH(request: NextRequest) {
    try {
        // Autenticación
        const user = await verifyAuth(request)
        if (!user) {
            return NextResponse.json(
                { error: 'No estás autenticado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { senderId } = body

        if (!senderId) {
            return NextResponse.json(
                { error: 'senderId es requerido' },
                { status: 400 }
            )
        }

        // Marcar todos los mensajes de este remitente como leídos
        const result = await prisma.message.updateMany({
            where: {
                senderId: senderId,
                receiverId: user.userId,
                read: false
            },
            data: {
                read: true
            }
        })

        return NextResponse.json({
            message: 'Conversación marcada como leída',
            count: result.count
        })

    } catch (error) {
        console.error('Error marking conversation as read:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
