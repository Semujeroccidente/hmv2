import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, handleAuthError } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'conversations'
    const conversationId = searchParams.get('conversationId') // userId in this context

    // TODO: Obtener usuario real de la sesión
    const currentUserId = (await prisma.user.findFirst())?.id || 'demo-user'

    if (type === 'conversations') {
      // Obtener usuarios con los que he chateado
      // En SQL raw seria: SELECT DISTINCT senderId, receiverId FROM Message WHERE ...
      // Prisma no tiene distinct cross-columns facil.
      // Aproximación: Buscar mensajes donde soy sender o receiver, luego extraer IDs unicos.

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUserId },
            { receiverId: currentUserId }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, name: true, avatar: true, email: true } },
          receiver: { select: { id: true, name: true, avatar: true, email: true } }
        }
      })

      const conversationsMap = new Map()

      messages.forEach(msg => {
        const otherUser = msg.senderId === currentUserId ? msg.receiver : msg.sender
        if (!conversationsMap.has(otherUser.id)) {
          conversationsMap.set(otherUser.id, {
            id: otherUser.id,
            user: otherUser,
            lastMessage: msg,
            unreadCount: (msg.receiverId === currentUserId && !msg.read) ? 1 : 0
          })
        } else {
          // Sumar unread si es necesario, pero aqui solo tomamos el ultimo mensaje
          // Si quisieramos count real, deberiamos procesar mas
          if (msg.receiverId === currentUserId && !msg.read) {
            conversationsMap.get(otherUser.id).unreadCount++
          }
        }
      })

      return NextResponse.json({
        conversations: Array.from(conversationsMap.values())
      })
    }

    if (conversationId) {
      // Messages with specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: conversationId },
            { senderId: conversationId, receiverId: currentUserId }
          ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, name: true, avatar: true, email: true } },
          receiver: { select: { id: true, name: true, avatar: true, email: true } }
        }
      })

      return NextResponse.json({ messages })
    }

    return NextResponse.json({ conversations: [], messages: [] })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { receiverId, content } = body

    // TODO: Session User
    const currentUserId = (await prisma.user.findFirst())?.id || 'demo-user'

    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId: currentUserId,
        receiverId,
        read: false
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, email: true } },
        receiver: { select: { id: true, name: true, avatar: true, email: true } }
      }
    })

    return NextResponse.json({
      message: 'Mensaje enviado',
      data: newMessage // Return the formatted message
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}