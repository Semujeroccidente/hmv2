'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  MessageCircle,
  Truck,
  Shield
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItemProps {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    title: string
    images?: string
    thumbnail?: string
    condition: string
    seller: {
      id: string
      name: string
      rating: number
    }
    stock: number
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ 
  id, 
  quantity, 
  price, 
  product,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(quantity)

  const imageUrl = product.thumbnail || 
    (product.images && JSON.parse(product.images)[0]) || 
    '/placeholder-product.svg'

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'NEW': return 'Nuevo'
      case 'USED': return 'Usado'
      case 'REFURBISHED': return 'Reacondicionado'
      default: return condition
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'NEW': return 'bg-green-100 text-green-800'
      case 'USED': return 'bg-orange-100 text-orange-800'
      case 'REFURBISHED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stock) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        setCurrentQuantity(newQuantity)
        onUpdateQuantity(id, newQuantity)
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onRemove(id)
      }
    } catch (error) {
      console.error('Error eliminando item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subtotal = price * currentQuantity

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Imagen del producto */}
          <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
            <Link href={`/producto/${product.id}`}>
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <Badge 
                  className={`absolute top-2 left-2 text-xs ${getConditionColor(product.condition)}`}
                >
                  {getConditionText(product.condition)}
                </Badge>
              </div>
            </Link>
          </div>

          {/* Información del producto */}
          <div className="flex-1 space-y-2">
            <div>
              <Link href={`/producto/${product.id}`}>
                <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span>Vendido por:</span>
                <Link href={`/perfil/${product.seller.id}`}>
                  <span className="font-medium hover:text-blue-600 transition-colors">
                    {product.seller.name}
                  </span>
                </Link>
                <span className="text-yellow-500">★ {product.seller.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Stock: {product.stock}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Envío disponible
              </Badge>
            </div>
          </div>

          {/* Controles y precio */}
          <div className="flex flex-col items-end gap-3 min-w-0">
            {/* Precio */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(subtotal)}
              </div>
              <div className="text-sm text-gray-500">
                {formatPrice(price)} c/u
              </div>
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleQuantityChange(currentQuantity - 1)}
                  disabled={isLoading || currentQuantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={currentQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (!isNaN(val) && val > 0 && val <= product.stock) {
                      handleQuantityChange(val)
                    }
                  }}
                  className="w-16 h-8 text-center border-0"
                  min={1}
                  max={product.stock}
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  disabled={isLoading || currentQuantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleRemove}
                disabled={isLoading}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Acciones adicionales */}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Heart className="h-3 w-3 mr-1" />
                Guardar
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MessageCircle className="h-3 w-3 mr-1" />
                Preguntar
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Barra de protección */}
        <div className="bg-blue-50 px-4 py-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-800">
            Compra protegida • Devolución fácil • Garantía del vendedor
          </span>
        </div>
      </CardContent>
    </Card>
  )
}