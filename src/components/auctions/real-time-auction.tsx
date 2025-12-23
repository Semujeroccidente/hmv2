'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gavel,
  Wifi,
  WifiOff,
  TrendingUp
} from 'lucide-react'

interface Bid {
  id: string
  amount: number
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

interface BidHistoryProps {
  bids: Bid[]
}

interface RealTimeAuctionProps {
  auctionId: string
  currentPrice: number
  bidCount: number
  seller: {
    name: string
    rating: number
  }
  onBidUpdate?: (data: { currentPrice: number; bidCount: number }) => void
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
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-300 font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div>
                    <div className="font-medium text-sm line-clamp-1">{bid.user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(bid.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {formatPrice(bid.amount)}
                    </span>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Ganando
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function RealTimeAuction({
  auctionId,
  currentPrice,
  bidCount,
  seller,
  onBidUpdate
}: RealTimeAuctionProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [latestBid, setLatestBid] = useState<Bid | null>(null)
  const [showBidAnimation, setShowBidAnimation] = useState(false)

  useEffect(() => {
    // Conectar al servicio de WebSockets
    const newSocket = io('http://localhost:3003', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    })

    newSocket.on('connect', () => {
      console.log('✅ Conectado al servicio de subastas')
      setIsConnected(true)
      setConnectionError('')

      // Unirse a la subasta
      newSocket.emit('join_auction', { auctionId })
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Desconectado del servicio de subastas')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error)
      setConnectionError('No se pudo conectar al servicio de subastas en tiempo real')
      setIsConnected(false)
    })

    newSocket.on('auction_joined', (data) => {
      console.log('✅ Unido a subasta:', data)
      toast.success('Conectado a subasta en tiempo real')
    })

    // Escuchar actualizaciones de la subasta
    newSocket.on('auction_update', (update: any) => {
      console.log('📡 Actualización de subasta:', update)

      if (update.type === 'new_bid' && update.data) {
        setLatestBid(update.data)
        setShowBidAnimation(true)

        if (onBidUpdate) {
          onBidUpdate({
            currentPrice: update.data.amount,
            bidCount: bidCount + 1
          })
        }

        toast.success(`Nueva puja: L. ${update.data.amount}`, {
          description: `Por ${update.data.user.name}`
        })

        // Ocultar animación después de 5 segundos
        setTimeout(() => setShowBidAnimation(false), 5000)
      }

      if (update.type === 'auction_ended') {
        toast.info('¡La subasta ha terminado!', {
          description: update.data.winner ? `Ganador: ${update.data.winner.name}` : 'Sin pujas'
        })
      }
    })

    newSocket.on('reserve_price_met', (data) => {
      toast.success('¡Precio de reserva alcanzado!', {
        description: `L. ${data.reservePrice}`
      })
    })

    newSocket.on('bid_error', (data) => {
      toast.error('Error en puja', {
        description: data.message
      })
    })

    newSocket.on('error', (data) => {
      console.error('❌ Error del servidor:', data)
      toast.error(data.message || 'Error en el servicio de subastas')
    })

    setSocket(newSocket)

    return () => {
      if (newSocket) {
        newSocket.emit('leave_auction', { auctionId })
        newSocket.disconnect()
      }
    }
  }, [auctionId])

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                En vivo
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-gray-400" />
              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                Sin conexión en tiempo real
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Connection Error Alert */}
      {connectionError && (
        <Alert variant="destructive">
          <AlertDescription>
            {connectionError}. Las pujas funcionarán pero no verás actualizaciones en tiempo real.
          </AlertDescription>
        </Alert>
      )}

      {/* Latest Bid Animation */}
      <AnimatePresence>
        {showBidAnimation && latestBid && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  ¡Nueva Puja!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>{latestBid.user.name}</strong> pujó{' '}
                  <strong className="text-lg">L. {latestBid.amount.toLocaleString()}</strong>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}