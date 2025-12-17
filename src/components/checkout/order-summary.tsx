'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Truck, 
  Clock, 
  Shield,
  Check,
  AlertTriangle,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

interface OrderSummaryProps {
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
    product: {
      thumbnail?: string
      images?: string
    }
  }>
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  onCheckout: () => void
  isProcessing?: boolean
}

export function OrderSummary({ 
  items, 
  shippingAddress, 
  paymentMethod, 
  subtotal, 
  shippingCost, 
  tax, 
  total, 
  onCheckout,
  isProcessing = false
}: OrderSummaryProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const getPaymentMethodName = (method: string) => {
    const methods = {
      'CARD': 'Tarjeta de Crédito/Débito',
      'PAYPAL': 'PayPal',
      'CASH': 'Pago contra Entrega',
      'TRANSFER': 'Transferencia Bancaria'
    }
    return methods[method] || method
  }

  const getImageUrl = (item: any) => {
    return item.product?.thumbnail || 
           (item.product?.images && JSON.parse(item.product.images)[0]) || 
           '/placeholder-product.svg'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          Resumen del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items del pedido */}
        <div>
          <h3 className="font-medium mb-4">Productos ({items.length})</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 flex-shrink-0">
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Dirección de envío */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-600" />
            Dirección de Envío
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm">
              {shippingAddress.street}<br />
              {shippingAddress.city}, {shippingAddress.state}<br />
              {shippingAddress.zipCode}, Honduras
            </p>
          </div>
        </div>

        <Separator />

        {/* Método de pago */}
        <div>
          <h3 className="font-medium mb-3">Método de Pago</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">{getPaymentMethodName(paymentMethod)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Totales */}
        <div>
          <h3 className="font-medium mb-4">Totales</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <div className="text-right">
                {shippingCost === 0 ? (
                  <Badge className="bg-green-100 text-green-800">Gratis</Badge>
                ) : (
                  <span>{formatPrice(shippingCost)}</span>
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

          {shippingCost === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
              <div className="flex items-center gap-2 text-green-800">
                <Truck className="h-4 w-4" />
                <span className="text-sm font-medium">
                  ¡Envío gratis en tu pedido!
                </span>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Alertas informativas */}
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-800">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">
                Compra Protegida
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Tu compra está protegida por nuestra garantía de devolución de 30 días y soporte 24/7.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Tiempo de Entrega Estimado
              </span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              2-3 días hábiles para ciudades principales, 3-5 días para zonas rurales.
            </p>
          </div>
        </div>

        {/* Botón de checkout */}
        <Button
          onClick={onCheckout}
          disabled={isProcessing || items.length === 0}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Procesando pedido...
            </>
          ) : (
            <>
              Completar Pedido
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {items.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-2">
            Debes añadir productos al carrito antes de continuar
          </div>
        )}
      </CardContent>
    </Card>
  )
}