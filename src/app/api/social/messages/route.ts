import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    // Autenticación real
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'No estás autenticado' },
        { status: 401 }
      )
    }

    const currentUserId = user.userId
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'conversations'
    const conversationId = searchParams.get('conversationId') // userId in this context
    const search = searchParams.get('search') // Búsqueda

    if (type === 'conversations') {
      // Obtener conversaciones
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

        // Aplicar búsqueda si existe
        if (search && !otherUser.name.toLowerCase().includes(search.toLowerCase())) {
          return
        }

        if (!conversationsMap.has(otherUser.id)) {
          conversationsMap.set(otherUser.id, {
            id: otherUser.id,
            user: otherUser,
            lastMessage: msg,
            unreadCount: (msg.receiverId === currentUserId && !msg.read) ? 1 : 0
          })
        } else {
          // Actualizar contador de no leídos
          const conv = conversationsMap.get(otherUser.id)
          if (msg.receiverId === currentUserId && !msg.read) {
            conv.unreadCount++
          }
        }
      })

      return NextResponse.json({
        conversations: Array.from(conversationsMap.values())
      })
    }

    if (conversationId) {
      // Mensajes con usuario específico
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

      // Auto-marcar como leídos los mensajes recibidos
      await prisma.message.updateMany({
        where: {
          senderId: conversationId,
          receiverId: currentUserId,
          read: false
        },
        data: {
          read: true
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
    // Autenticación real
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'No estás autenticado' },
        { status: 401 }
      )
    }

    const currentUserId = user.userId
    const body = await request.json()
    const { receiverId, content, productId } = body

    // Validaciones
    if (!receiverId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    // No permitir enviarse mensajes a sí mismo
    if (receiverId === currentUserId) {
      return NextResponse.json(
        { error: 'No puedes enviarte mensajes a ti mismo' },
        { status: 400 }
      )
    }

    // Verificar que el receptor existe
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const newMessage = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: currentUserId,
        receiverId,
        productId: productId || undefined,
        read: false
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, email: true } },
        receiver: { select: { id: true, name: true, avatar: true, email: true } }
      }
    })

    return NextResponse.json({
      message: 'Mensaje enviado',
      data: newMessage
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}