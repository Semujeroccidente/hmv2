'use client'

import { useMessages } from '@/hooks/use-messages'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function MessageNotificationBadge() {
    const { unreadCount } = useMessages({
        enablePolling: true,
        pollingInterval: 10000 // 10 segundos
    })

    if (unreadCount === 0) {
        return (
            <Link href="/mensajes" className="relative p-2 hover:bg-azul-600 rounded-lg transition-colors">
                <MessageCircle className="h-5 w-5 text-white" />
            </Link>
        )
    }

    return (
        <Link href="/mensajes" className="relative p-2 hover:bg-azul-600 rounded-lg transition-colors group">
            <MessageCircle className="h-5 w-5 text-white group-hover:text-verde-300 transition-colors" />
            <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse bg-naranja-700 border-0"
            >
                {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
        </Link>
    )
}
