'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Shield,
  Check,
  AlertTriangle
} from 'lucide-react'

interface PaymentFormProps {
  paymentMethod: string
  onChange: (method: string) => void
  onValidationComplete: (isValid: boolean) => void
}

export function PaymentForm({ paymentMethod, onChange, onValidationComplete }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const paymentMethods = [
    {
      value: 'CARD',
      label: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      value: 'PAYPAL',
      label: 'PayPal',
      icon: Smartphone,
      description: 'Pago seguro con tu cuenta PayPal'
    },
    {
      value: 'CASH',
      label: 'Pago contra entrega',
      icon: DollarSign,
      description: 'Paga cuando recibas tu pedido'
    },
    {
      value: 'TRANSFER',
      label: 'Transferencia bancaria',
      icon: Smartphone,
      description: 'Transferencia desde tu banco'
    }
  ]

  const handlePaymentMethodChange = (value: string) => {
    onChange(value)
    // Validar según el método seleccionado
    if (value === 'CARD') {
      const isValid = cardNumber.length >= 16 && cardName && cardExpiry && cardCvv.length >= 3
      onValidationComplete(isValid)
    } else if (value === 'PAYPAL') {
      onValidationComplete(true) // PayPal maneja su propia validación
    } else if (value === 'CASH') {
      onValidationComplete(true) // Pago contra entrega siempre válido
    } else if (value === 'TRANSFER') {
      const isValid = phoneNumber && email
      onValidationComplete(isValid)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    return matches ? matches.join(' ') : v
  }

  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={method.value} id={method.value} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Separator />

        {/* Formulario de tarjeta de crédito */}
        {paymentMethod === 'CARD' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Información de la Tarjeta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Número de Tarjeta</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  maxLength={19}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Titular</label>
                <input
                  type="text"
                  placeholder="JUAN PÉREZ"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Vencimiento</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-2 border rounded-md"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Formulario de transferencia */}
        {paymentMethod === 'TRANSFER' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Información de Transferencia</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Número de Teléfono</label>
                <input
                  type="tel"
                  placeholder="+504 1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Información de PayPal */}
        {paymentMethod === 'PAYPAL' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-blue-600 mb-2">
              <Smartphone className="h-8 w-8 mx-auto mb-2" />
            </div>
            <h3 className="font-medium mb-2">Serás redirigido a PayPal</h3>
            <p className="text-sm text-gray-600 mb-4">
              Completa tu compra de forma segura con tu cuenta PayPal. 
              Podrás usar tu saldo o tarjeta guardada.
            </p>
            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Continuar con PayPal
            </Button>
          </div>
        )}

        {/* Información de pago contra entrega */}
        {paymentMethod === 'CASH' && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 mb-2">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
            </div>
            <h3 className="font-medium mb-2">Pago contra Entrega</h3>
            <p className="text-sm text-gray-600 mb-4">
              Paga cuando recibas tu pedido. Ten efectivo listo para el repartidor.
            </p>
            <div className="bg-yellow-100 border border-yellow-300 p-3 rounded">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  <strong>Importante:</strong> Solo disponible en Tegucigalpa y San Pedro Sula.
                </span>
              </div>
            </div>
          </div>
        )}

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Pago 100% Seguro:</strong> Tu información está protegida con encriptación SSL. 
            No almacenamos tus datos de tarjeta.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}