'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart,
  Share2,
  ExternalLink,
  Shield,
  Clock,
  Calendar
  User
  Star
  AlertTriangle
} from 'lucide-react'

interface AuctionStatsProps {
  bidCount: number
  views: number
  favoritesCount: number
  seller: {
    name: string
    rating: number
  }
}

export function AuctionStats({ bidCount, views, favoritesCount, seller }: AuctionStatsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{bidCount}</div>
            <div className="text-sm text-gray-500">Pujas</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{views}</div>
            <div className="text-sm text-gray-500">Visitas</div>
          </div>
        </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{favoritesCount}</div>
            <div className="text-sm text-gray-500">Favoritos</div>
          </div>
        </div>
      </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Vendedor:</span>
            <span className="font-medium">{seller.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>Calificación:</span>
            <span className="font-medium">{seller.rating.toFixed(1)}</span>
            <span className="text-gray-400">({seller.rating} reseñas)</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              Vendedor Verificado
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-2">
          <AlertTriangle className="h-4 w-4 inline-block mr-2" />
          <span>
            Compra protegida • Garantía de devolución • Soporte 24/7
          </span>
        </div>
      </CardContent>
    </Card>
  )
}