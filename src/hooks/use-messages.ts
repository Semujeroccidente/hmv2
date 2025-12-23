'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface Message {
    id: string
    content: string
    senderId: string
    receiverId: string
    productId?: string
    read: boolean
    createdAt: string
    sender: {
        id: string
        name: string
        email: string
        avatar?: string
    }
    receiver: {
        id: string
        name: string
        email: string
        avatar?: string
    }
}

interface Conversation {
    id: string
    user: {
        id: string
        name: string
        email: string
        avatar?: string
    }
    lastMessage: Message
    unreadCount: number
}

interface UseMessagesReturn {
    conversations: Conversation[]
    messages: Message[]
    unreadCount: number
    isLoading: boolean
    sendMessage: (receiverId: string, content: string, productId?: string) => Promise<boolean>
    fetchConversations: (search?: string) => Promise<void>
    fetchMessages: (userId: string) => Promise<void>
    markAsRead: (messageId: string) => Promise<void>
    markConversationAsRead: (senderId: string) => Promise<void>
    refreshUnreadCount: () => Promise<void>
}

export function useMessages(options?: {
    enablePolling?: boolean
    pollingInterval?: number
}): UseMessagesReturn {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const enablePolling = options?.enablePolling ?? true
    const pollingInterval = options?.pollingInterval ?? 5000 // 5 segundos por defecto

    // Obtener conversaciones
    const fetchConversations = useCallback(async (search?: string) => {
        try {
            const url = search
                ? `/api/social/messages?type=conversations&search=${encodeURIComponent(search)}`
                : '/api/social/messages?type=conversations'

            const response = await fetch(url)

            if (response.ok) {
                const data = await response.json()
                setConversations(data.conversations)
            } else if (response.status === 401) {
                // Usuario no autenticado
                setConversations([])
            }
        } catch (error) {
            console.error('Error fetching conversations:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Obtener mensajes de una conversación
    const fetchMessages = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`/api/social/messages?conversationId=${userId}`)

            if (response.ok) {
                const data = await response.json()
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }, [])

    // Enviar mensaje
    const sendMessage = useCallback(async (
        receiverId: string,
        content: string,
        productId?: string
    ): Promise<boolean> => {
        try {
            const response = await fetch('/api/social/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId,
                    content: content.trim(),
                    productId
                })
            })

            if (response.ok) {
                const data = await response.json()
                // Agregar mensaje a la lista local
                setMessages(prev => [...prev, data.data])
                // Actualizar conversaciones
                await fetchConversations()
                return true
            } else {
                const error = await response.json()
                toast.error(error.error || 'Error al enviar mensaje')
                return false
            }
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Error de conexión')
            return false
        }
    }, [fetchConversations])

    // Marcar mensaje como leído
    const markAsRead = useCallback(async (messageId: string) => {
        try {
            const response = await fetch(`/api/social/messages/${messageId}`, {
                method: 'PATCH'
            })

            if (response.ok) {
                // Actualizar mensaje local
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId ? { ...msg, read: true } : msg
                ))
                await refreshUnreadCount()
            }
        } catch (error) {
            console.error('Error marking message as read:', error)
        }
    }, [])

    // Marcar conversación completa como leída
    const markConversationAsRead = useCallback(async (senderId: string) => {
        try {
            const response = await fetch('/api/social/messages/mark-read', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId })
            })

            if (response.ok) {
                // Actualizar mensajes locales
                setMessages(prev => prev.map(msg =>
                    msg.senderId === senderId ? { ...msg, read: true } : msg
                ))
                await refreshUnreadCount()
                await fetchConversations()
            }
        } catch (error) {
            console.error('Error marking conversation as read:', error)
        }
    }, [fetchConversations])

    // Obtener contador de no leídos
    const refreshUnreadCount = useCallback(async () => {
        try {
            const response = await fetch('/api/social/messages/unread-count')

            if (response.ok) {
                const data = await response.json()
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            console.error('Error fetching unread count:', error)
        }
    }, [])

    // Cargar datos iniciales
    useEffect(() => {
        fetchConversations()
        refreshUnreadCount()
    }, [fetchConversations, refreshUnreadCount])

    // Polling para actualizaciones en tiempo real
    useEffect(() => {
        if (!enablePolling) return

        const intervalId = setInterval(() => {
            fetchConversations()
            refreshUnreadCount()
        }, pollingInterval)

        return () => clearInterval(intervalId)
    }, [enablePolling, pollingInterval, fetchConversations, refreshUnreadCount])

    return {
        conversations,
        messages,
        unreadCount,
        isLoading,
        sendMessage,
        fetchConversations,
        fetchMessages,
        markAsRead,
        markConversationAsRead,
        refreshUnreadCount
    }
}
