'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    CreditCard,
    User,
    Phone,
    Mail
} from 'lucide-react'

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchOrderDetails()
    }, [params.id])

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/orders/${params.id}`)
            const data = await response.json()

            if (response.ok) {
                setOrder(data.order)
            } else {
                setError(data.error || 'Error al cargar el pedido')
            }
        } catch (err) {
            setError('Error de conexión')
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
        }).format(amount)
    }

    const getStatusColor = (status: string) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            PROCESSING: 'bg-purple-100 text-purple-800',
            SHIPPED: 'bg-indigo-100 text-indigo-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800'
        }
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status: string) => {
        const texts = {
            PENDING: 'Pendiente',
            CONFIRMED: 'Confirmado',
            PROCESSING: 'En Proceso',
            SHIPPED: 'Enviado',
            DELIVERED: 'Entregado',
            CANCELLED: 'Cancelado'
        }
        return texts[status as keyof typeof texts] || status
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando pedido...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido no encontrado</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => router.push('/mis-pedidos')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Mis Pedidos
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/mis-pedidos" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Mis Pedidos
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.orderNumber}</h1>
                            <p className="text-gray-600 mt-1">
                                Realizado el {new Date(order.createdAt).toLocaleDateString('es-HN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Productos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Productos ({order.items?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items?.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                            {item.product?.thumbnail && (
                                                <img
                                                    src={item.product.thumbnail}
                                                    alt={item.product.title}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.product?.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Vendedor: {item.product?.seller?.name}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-gray-600">Cantidad: {item.quantity}</span>
                                                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dirección de envío */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Dirección de Envío
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.shippingAddress && (
                                    <div className="text-gray-700">
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                        <p>{order.shippingAddress.zipCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna lateral */}
                    <div className="space-y-6">
                        {/* Resumen */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Envío:</span>
                                    <span>{formatPrice(order.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Impuestos:</span>
                                    <span>{formatPrice(order.tax)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span className="text-blue-600">{formatPrice(order.total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estado del pago */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Información de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Estado:</span>
                                        <Badge className={
                                            order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                        }>
                                            {order.paymentStatus === 'PAID' ? 'Pagado' :
                                                order.paymentStatus === 'PENDING' ? 'Pendiente' :
                                                    order.paymentStatus === 'FAILED' ? 'Fallido' : 'Reembolsado'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información del cliente */}
                        {order.user && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Información del Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>{order.user.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{order.user.email}</span>
                                    </div>
                                    {order.user.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>{order.user.phone}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
