'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CartItem } from '@/components/marketplace/cart-item'
import { CartSkeleton } from '@/components/marketplace/skeletons'
import { useCart } from '@/hooks/use-cart'
import {
  ShoppingCart,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react'

export default function CartPage() {
  const {
    cart,
    isLoading,
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
    clearCart,
    refreshCart
  } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
      await clearCart()
    }
  }

  if (isLoading && !cart) {
    return <CartSkeleton />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tu carrito está vacío
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Parece que aún no has añadido productos a tu carrito.
                ¡Explora nuestro catálogo y encuentra algo increíble!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Explorar productos
                  </Button>
                </Link>
                <Link href="/subastas">
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    Ver subastas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la tienda
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mi Carrito
                </h1>
                <p className="text-gray-600">
                  {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={refreshCart}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpiar carrito
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  quantity={item.quantity}
                  price={item.price}
                  product={item.product}
                  onUpdateQuantity={() => refreshCart()}
                  onRemove={() => refreshCart()}
                />
              ))}

              {/* Alerta de protección */}
              <Alert className="bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Compra Protegida:</strong> Todos tus compras están protegidas
                  por nuestra garantía de devolución de 30 días y soporte 24/7.
                </AlertDescription>
              </Alert>

              {/* Sugerencias */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Te podría gustar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Añade más productos para obtener envío gratis
                    </p>
                    <Link href="/">
                      <Button variant="outline" className="flex items-center gap-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        Explorar más productos
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del pedido */}
            <div className="space-y-4">
              {/* Resumen */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemCount} productos)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <div className="text-right">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-medium">Gratis</span>
                        ) : (
                          <span>{formatPrice(shipping)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Impuestos (15% ISV)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Badge de envío gratis */}
                  {shipping === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-800">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          ¡Envío gratis en tu pedido!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    <Link href="/checkout" className="block">
                      <Button className="w-full" size="lg" disabled={isLoading}>
                        Proceder al pago
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>

                    <Link href="/" className="block">
                      <Button variant="outline" className="w-full">
                        Seguir comprando
                      </Button>
                    </Link>
                  </div>

                  {/* Métodos de pago */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">
                      Métodos de pago aceptados:
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Visa</Badge>
                      <Badge variant="outline">Mastercard</Badge>
                      <Badge variant="outline">PayPal</Badge>
                      <Badge variant="outline">Bitcoin</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de seguridad */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Envío a todo Honduras</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-purple-600" />
                      <span>Devoluciones fáciles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}