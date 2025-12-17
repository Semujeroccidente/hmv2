'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Gavel, 
  Users, 
  Eye, 
  Heart,
  Share2,
  ExternalLink,
  Shield,
  Clock,
  Calendar,
  User,
  Star,
  Check,
  XCircle
} from 'lucide-react'

interface BidHistoryProps {
  bids: Array<{
    id: string
    amount: number
    createdAt: string
    user: {
      id: string
      name: string
      email: string
      avatar?: string
    }
  }>
}

interface RealTimeAuctionProps {
  auctionId: string
  currentPrice: number
  bidCount: number
  seller: {
    name: string
    rating: number
  }
  onBidUpdate: (bid: any) => void
}

export function BidHistory({ bids }: BidHistoryProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-purple-600" />
          <h3>Historial de Pujas</h3>
          <Badge variant="secondary">{bids.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {bids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-lg">Aún no hay pujas</div>
              <div className="text-sm">
                Sé el primero en pujar por este producto
              </div>
            </div>
          ) : (
            bids.map((bid, index) => (
              <div key={bid.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div>
                    <div className="font-medium text-sm line-clamp-1">{bid.user.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(bid.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-600">
                      {formatPrice(bid.amount)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      #{bids.length - index}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RealTimeAuction({ auctionId, currentPrice, bidCount, seller, onBidUpdate }: RealTimeAuctionProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')

  useEffect(() => {
    // Conectar al servicio de WebSockets
    const newSocket = io('http://localhost:3003', {
      withCredentials: false
    })

    newSocket.on('connect', () => {
      console.log('Conectado al servicio de subastas')
      setSocket(newSocket)
      setIsConnected(true)
      setConnectionError('')
      
      // Unirse a la subasta
      newSocket.emit('join_auction', { auctionId })
    })

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servicio de subastas')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión:', error)
      setConnectionError('No se pudo conectar al servicio de subastas')
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [auctionId])

  useEffect(() => {
    if (!socket) return

    // Escuchar actualizaciones de la subasta
    socket.on('auction_update', (update: any) => {
      console.log('Actualización de subasta:', update)
      onBidUpdate(update)
    })

    // Escuchar notificaciones de nuevas pujas
    socket.on('new_bid', (bid: any) => {
      console.log('Nueva puja recibida:', bid)
      onBidUpdate(bid)
    })

    // Escuchar cuando la subasta termina
    socket.on('auction_ended', (data: any) => {
      console.log('Subasta terminada:', data)
    })

    // Escuchar cuando se alcanza el precio de reserva
    socket.on('reserve_price_met', (data: any) => {
      console.log('Precio de reserva alcanzado:', data)
    })

    // Escuchar detalles de la subasta
    socket.on('auction_details', (data: any) => {
      console.log('Detalles de subasta:', data)
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [auctionId])

  return (
    <div>
      {connectionError && (
        <Alert className="mb-4">
          <AlertDescription>
            No se puede conectar al servicio de subastas. Por favor, intenta recargar la página.
          </AlertDescription>
        </Alert>
      )}
      
      {!isConnected && (
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Conectado a subasta en tiempo real</span>
        </div>
      )}
    </div>
  )
}