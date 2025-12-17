'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export interface Auction {
  id: string
  title: string
  startingPrice: number
  currentPrice: number
  reservePrice?: number
  endDate: Date | string
  status: string
  product: {
    id: string
    title: string
    images?: string | string[]
    thumbnail?: string
    condition: string
  }
  bidCount: number
  seller: {
    name: string
    rating: number
  }
}

interface AuctionCardProps {
  auction: Auction
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const {
    id,
    title,
    startingPrice,
    currentPrice,
    reservePrice,
    endDate,
    status,
    product,
    bidCount,
    seller
  } = auction

  // Handle images: try thumbnail, then parse images if string, or use array if array
  let mainImage = product.thumbnail
  if (!mainImage && product.images) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      mainImage = product.images[0]
    } else if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images)
        if (Array.isArray(parsed) && parsed.length > 0) {
          mainImage = parsed[0]
        }
      } catch (e) {
        if (product.images.startsWith('http') || product.images.startsWith('/')) {
          mainImage = product.images
        }
      }
    }
  }
  const imageUrl = mainImage || '/placeholder-product.svg'

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return 'Finalizada'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getProgressPercentage = () => {
    const now = new Date()
    const end = new Date(endDate)
    // Estimate start time as 7 days before end if not provided, purely for visual progress
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)

    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  const getStatusColor = () => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'ENDED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'ACTIVE': return 'Activa'
      case 'ENDED': return 'Finalizada'
      case 'CANCELLED': return 'Cancelada'
      default: return status
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/subasta/${id}`}>
            <div className="aspect-square relative">
              <Image
                src={imageUrl}
                alt={title || 'Subasta'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          {/* Badge de estado */}
          <div className="absolute top-2 left-2">
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>

          {/* Indicador de tiempo */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeRemaining()}
          </div>
        </div>

        {/* Información de la subasta */}
        <div className="p-4">
          <Link href={`/subasta/${id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Precios */}
          <div className="mb-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Puja actual:</span>
              <span className="text-xl font-bold text-purple-600">
                {formatPrice(currentPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Precio inicial:</span>
              <span className="text-gray-700">
                {formatPrice(startingPrice)}
              </span>
            </div>
            {reservePrice && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Reserva:</span>
                <span className="text-gray-700">
                  {currentPrice >= reservePrice ? 'Alcanzada' : 'No alcanzada'}
                </span>
              </div>
            )}
          </div>

          {/* Progreso de tiempo */}
          {status === 'ACTIVE' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Tiempo restante</span>
                <span>{getTimeRemaining()}</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}

          {/* Estadísticas */}
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{bidCount} pujas</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{((currentPrice - startingPrice) / startingPrice * 100).toFixed(1)}% aumento</span>
            </div>
          </div>

          {/* Información del vendedor */}
          <div className="mb-3 text-sm text-gray-600">
            <span>Vendedor: {seller?.name || 'Vendedor'}</span>
          </div>

          {/* Botón de acción */}
          <Button
            className="w-full"
            disabled={status !== 'ACTIVE'}
            onClick={() => {/* Lógica para pujar */ }}
          >
            {status === 'ACTIVE' ? 'Hacer una puja' :
              status === 'ENDED' ? 'Subasta finalizada' :
                'Subasta cancelada'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}