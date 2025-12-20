'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Gavel,
  Users,
  TrendingUp,
  Plus,
  Filter,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react'

export default function SubastasPage() {
  const [auctions, setAuctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [categories, setCategories] = useState([
    { id: '1', name: 'Electrónica', icon: '📱' },
    { id: '2', name: 'Ropa y Accesorios', icon: '👕' },
    { id: '3', name: 'Hogar y Jardín', icon: '🏠' },
    { id: '4', name: 'Vehículos', icon: '🚗' },
    { id: '5', name: 'Propiedades', icon: '🏢' },
    { id: '6', name: 'Servicios', icon: '💼' }
  ])

  useEffect(() => {
    loadCategories()
    loadAuctions()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error cargando categorías:', error)
    }
  }

  const loadAuctions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/auctions${filter !== 'all' ? `?status=${filter}` : ''}`)

      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions || [])
      } else {
        setAuctions([])
      }
    } catch (error) {
      console.error('Error cargando subastas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'ENDED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activa'
      case 'ENDED': return 'Finalizada'
      case 'CANCELLED': return 'Cancelada'
      default: return status
    }
  }

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const remaining = endDate.getTime() - now.getTime()
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return `${Math.ceil(remaining / 1000)}s`
    }
  }

  const getProgressPercentage = (endDate: Date) => {
    const now = new Date()
    const start = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000))
    const elapsed = now.getTime() - start.getTime()
    return Math.min(100, (elapsed / (7 * 24 * 60 * 1000) * 1000))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gavel className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white">Cargando subastas...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Gavel className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">HonduMarket</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-sm">Subastas</span>
                <Badge className="ml-2 bg-purple-600 text-white">
                  {auctions.length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Subastas en Tiempo Real
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Participa en nuestras subastas en tiempo real y gana increíbles premios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Gavel className="mr-2 h-5 w-5" />
                Explorar Subastas
              </Button>
              <Link href="/crear-subasta">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Crear Subasta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y categorías */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorar Subastas</h2>
            <p className="text-gray-600">
              Filtra por categorías, precio y tiempo restante
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="flex items-center gap-2"
            >
              Todas
            </Button>
            <Button
              variant={filter === 'ACTIVE' ? 'default' : 'outline'}
              onClick={() => setFilter('ACTIVE')}
              className="flex items-center gap-2"
            >
              Activas
            </Button>
            <Button
              variant={filter === 'ENDED' ? 'default' : 'outline'}
              onClick={() => setFilter('ENDED')}
              className="flex items-center gap-2"
            >
              Finalizadas
            </Button>
            <Button
              variant={filter === 'CANCELLED' ? 'default' : 'outline'}
              onClick={() => setFilter('CANCELLED')}
              className="flex items-center gap-2"
            >
              Canceladas
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? 'default' : 'outline'}
                onClick={() => setFilter(category.id)}
                className="flex items-center gap-2 px-3 py-2"
              >
                <span>{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de subastas */}
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gavel className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white">Cargando subastas...</h2>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{auction.title}</span>
                      <Badge className={getStatusColor(auction.status)}>
                        {getStatusText(auction.status)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Precio actual</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPrice(auction.currentPrice || auction.startingPrice)}
                        </p>
                      </div>
                      {auction.endDate && (
                        <div>
                          <p className="text-sm text-gray-600">Tiempo restante</p>
                          <p className="text-lg font-semibold">
                            {getTimeRemaining(new Date(auction.endDate))}
                          </p>
                        </div>
                      )}
                      <Link href={`/subasta/${auction.id}`}>
                        <Button className="w-full">
                          <Gavel className="mr-2 h-4 w-4" />
                          Ver subasta
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && auctions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gavel className="h-12 w-12 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">No hay subastas activas</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No hay subastas activas en este momento.
                ¡Sé el primero en crear una!
              </p>
              <Link href="/crear-subasta" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Button size="lg" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Subasta
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}