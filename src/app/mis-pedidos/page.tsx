'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { OrderSkeleton } from '@/components/marketplace/skeletons'
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      title: string
      thumbnail?: string
      images?: string
      seller: {
        name: string
        rating: number
      }
    }
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function MisPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders${filter !== 'all' ? `?status=${filter}` : ''}`)

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        setError('Error cargando los pedidos')
      }
    } catch (error) {
      setError('Error de conexión')
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente'
      case 'CONFIRMED': return 'Confirmado'
      case 'PROCESSING': return 'Procesando'
      case 'SHIPPED': return 'Enviado'
      case 'DELIVERED': return 'Entregado'
      case 'CANCELLED': return 'Cancelado'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'REFUNDED': return 'bg-red-100 text-red-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente'
      case 'PAID': return 'Pagado'
      case 'REFUNDED': return 'Reembolsado'
      case 'FAILED': return 'Fallido'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <OrderSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/perfil" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
            <Button variant="outline" onClick={loadOrders} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Todos ({orders.length})
            </Button>
            <Button
              variant={filter === 'PENDING' ? 'default' : 'outline'}
              onClick={() => setFilter('PENDING')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Pendientes
            </Button>
            <Button
              variant={filter === 'PROCESSING' ? 'default' : 'outline'}
              onClick={() => setFilter('PROCESSING')}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              En Proceso
            </Button>
            <Button
              variant={filter === 'SHIPPED' ? 'default' : 'outline'}
              onClick={() => setFilter('SHIPPED')}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Enviados
            </Button>
            <Button
              variant={filter === 'DELIVERED' ? 'default' : 'outline'}
              onClick={() => setFilter('DELIVERED')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Entregados
            </Button>
            <Button
              variant={filter === 'CANCELLED' ? 'default' : 'outline'}
              onClick={() => setFilter('CANCELLED')}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancelados
            </Button>
          </div>
        </div>

        {/* Lista de pedidos */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No tienes pedidos aún
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ¡Explora nuestro catálogo y encuentra productos increíbles para comprar!
            </p>
            <Link href="/">
              <Button size="lg" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Explorar Productos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.orderNumber}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Items del pedido */}
                    <div>
                      <h4 className="font-medium mb-3">Productos ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            <div className="w-12 h-12 flex-shrink-0">
                              <img
                                src={item.product.thumbnail ||
                                  (item.product.images && JSON.parse(item.product.images)[0]) ||
                                  '/placeholder-product.svg'}
                                alt={item.product.title}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm line-clamp-1">{item.product.title}</h5>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Cantidad: {item.quantity}</span>
                                <span>Precio: {formatPrice(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-center text-sm text-gray-500 py-2">
                            +{order.items.length - 3} productos más
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Información de envío */}
                    <div>
                      <h4 className="font-medium mb-2">Dirección de Envío</h4>
                      <div className="text-sm text-gray-600">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                        {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                      </div>
                    </div>

                    <Separator />

                    {/* Totales */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-medium">{formatPrice(order.subtotal)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-lg text-blue-600">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Link href={`/pedidos/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>

                      {order.status === 'PENDING' && (
                        <Button variant="outline" size="sm">
                          Contactar Vendedor
                        </Button>
                      )}

                      {order.status === 'SHIPPED' && (
                        <Button variant="outline" size="sm">
                          Seguimiento
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}