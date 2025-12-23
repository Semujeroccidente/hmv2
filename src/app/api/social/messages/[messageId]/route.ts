import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

// PATCH - Marcar mensaje específico como leído
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ messageId: string }> }
) {
    try {
        // Autenticación
        const user = await verifyAuth(request)
        if (!user) {
            return NextResponse.json(
                { error: 'No estás autenticado' },
                { status: 401 }
            )
        }

        const { messageId } = await params

        // Buscar mensaje
        const message = await prisma.message.findUnique({
            where: { id: messageId }
        })

        if (!message) {
            return NextResponse.json(
                { error: 'Mensaje no encontrado' },
                { status: 404 }
            )
        }

        // Solo el receptor puede marcar como leído
        if (message.receiverId !== user.userId) {
            return NextResponse.json(
                { error: 'No tienes permiso para marcar este mensaje' },
                { status: 403 }
            )
        }

        // Actualizar mensaje
        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: { read: true },
            include: {
                sender: { select: { id: true, name: true, avatar: true, email: true } },
                receiver: { select: { id: true, name: true, avatar: true, email: true } }
            }
        })

        return NextResponse.json({
            message: 'Mensaje marcado como leído',
            data: updatedMessage
        })

    } catch (error) {
        console.error('Error marking message as read:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
