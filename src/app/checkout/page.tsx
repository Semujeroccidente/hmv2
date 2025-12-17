'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ShippingForm } from '@/components/checkout/shipping-form'
import { PaymentForm } from '@/components/checkout/payment-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { useCart } from '@/hooks/use-cart'
import { 
  ArrowLeft, 
  ShoppingBag, 
  CheckCircle,
  AlertTriangle,
  Truck,
  Shield,
  Clock
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { 
    cart, 
    isLoading, 
    itemCount, 
    subtotal, 
    tax, 
    shippingCost, 
    total,
    clearCart
  } = useCart()

  const [currentStep, setCurrentStep] = useState(1)
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'HN'
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isPaymentValid, setIsPaymentValid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push('/carrito')
    }
  }, [cart, router])

  const validateShipping = () => {
    const newErrors = {}
    
    if (!shippingAddress.street.trim()) {
      newErrors.street = 'La calle es requerida'
    }
    if (!shippingAddress.city.trim()) {
      newErrors.city = 'La ciudad es requerida'
    }
    if (!shippingAddress.state.trim()) {
      newErrors.state = 'El departamento es requerido'
    }
    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleShippingNext = () => {
    if (validateShipping()) {
      setCurrentStep(2)
    }
  }

  const handlePaymentNext = () => {
    if (isPaymentValid) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCheckout = async () => {
    if (!validateShipping()) {
      setErrors({ ...errors, general: 'Por favor completa la información de envío' })
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress,
          paymentMethod
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOrderData(data.order)
        setOrderComplete(true)
        await clearCart()
        setCurrentStep(4)
      } else {
        setErrors({ general: data.error })
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pedido Completado!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Tu pedido #{orderData?.orderNumber} ha sido creado exitosamente.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Número de pedido:</span>
                <span className="font-medium">#{orderData?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium text-lg">{formatPrice(orderData?.total || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-yellow-600">Pendiente de pago</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            <Button onClick={() => router.push('/mis-pedidos')} className="w-full">
              Ver Mis Pedidos
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              Seguir Comprando
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Truck className="h-4 w-4" />
              <span className="text-sm font-medium">
                Recibirás tu pedido en 2-3 días hábiles
              </span>
            </div>
          </div>
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
            <div className="flex items-center gap-4">
              <Link href="/carrito" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Carrito
              </Link>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Checkout</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Paso {currentStep} de 3</span>
              <div className="flex gap-1">
                <div className={`w-8 h-2 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-2 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-2 rounded-full ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <ShippingForm
                  address={shippingAddress}
                  onChange={setShippingAddress}
                  errors={errors}
                />
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <PaymentForm
                  paymentMethod={paymentMethod}
                  onChange={setPaymentMethod}
                  onValidationComplete={setIsPaymentValid}
                />
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Revisa tu Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          Por favor revisa cuidadosamente tu pedido antes de confirmar. 
                          Una vez confirmado, no podrás hacer cambios.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Dirección de Envío</h4>
                        <p className="text-sm">
                          {shippingAddress.street}<br />
                          {shippingAddress.city}, {shippingAddress.state}<br />
                          {shippingAddress.zipCode}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-3">Método de Pago</h4>
                        <p className="text-sm capitalize">
                          {paymentMethod === 'CARD' && 'Tarjeta de Crédito/Débito'}
                          {paymentMethod === 'PAYPAL' && 'PayPal'}
                          {paymentMethod === 'CASH' && 'Pago contra Entrega'}
                          {paymentMethod === 'TRANSFER' && 'Transferencia Bancaria'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleBack}>
                        Anterior
                      </Button>
                      <Button onClick={handleCheckout} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            Confirmar Pedido
                          <Truck className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Columna derecha - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={cart?.items || []}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                subtotal={subtotal}
                shippingCost={shippingCost}
                tax={tax}
                total={total}
                onCheckout={currentStep === 3 ? handleCheckout : () => {}}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error general */}
      {errors.general && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}