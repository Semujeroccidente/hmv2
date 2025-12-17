'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Eye, Star, Plus, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'

export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  images?: string | string[]
  thumbnail?: string
  condition: string
  views: number
  favoritesCount: number
  category: string | { name: string }
  seller: {
    name: string
    rating: number
  }
  isAuction?: boolean
  auctionEndDate?: Date | string
  currentBid?: number
  createdAt?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    title,
    price,
    originalPrice,
    images,
    thumbnail,
    condition,
    views,
    favoritesCount,
    category,
    seller,
    isAuction,
    auctionEndDate,
    currentBid
  } = product

  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()

  // Handle images: try thumbnail, then parse images if string, or use array if array
  let mainImage = thumbnail
  if (!mainImage && images) {
    if (Array.isArray(images) && images.length > 0) {
      mainImage = images[0]
    } else if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images)
        if (Array.isArray(parsed) && parsed.length > 0) {
          mainImage = parsed[0]
        }
      } catch (e) {
        // If not JSON, maybe it's a direct URL string
        if (images.startsWith('http') || images.startsWith('/')) {
          mainImage = images
        }
      }
    }
  }
  const imageUrl = mainImage || '/placeholder-product.svg'

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

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

  const getCategoryName = (cat: string | { name: string }) => {
    if (typeof cat === 'string') return cat
    return cat.name
  }

  const handleAddToCart = async () => {
    if (isAuction) return // No se pueden añadir subastas al carrito directamente

    setIsAddingToCart(true)
    const success = await addToCart(id, 1)
    if (success) {
      setIsInCart(true)
    }
    setIsAddingToCart(false)
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implementar lógica de favoritos
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Link href={`/producto/${id}`}>
            <div className="aspect-square relative">
              <Image
                src={imageUrl}
                alt={title || 'Producto'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}
            <Badge className={getConditionColor(condition)}>
              {getConditionText(condition)}
            </Badge>
            {isAuction && (
              <Badge className="bg-purple-500 text-white">
                Subasta
              </Badge>
            )}
          </div>

          {/* Botón de favoritos */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {getCategoryName(category)}
            </Badge>
          </div>

          <Link href={`/producto/${id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Precio */}
          <div className="mb-3">
            {isAuction ? (
              <div>
                <p className="text-sm text-gray-500">Puja actual</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatPrice(currentBid || price)}
                </p>
                {auctionEndDate && (
                  <p className="text-xs text-gray-500">
                    Termina: {new Date(auctionEndDate).toLocaleDateString('es-HN')}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(price)}
                </p>
                {originalPrice && originalPrice > price && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Información del vendedor */}
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{seller?.rating?.toFixed(1) || '0.0'}</span>
              <span>{seller?.name || 'Vendedor'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{favoritesCount}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAuction || isAddingToCart || isInCart}
            >
              {isInCart ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  En el carrito
                </>
              ) : isAddingToCart ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Añadiendo...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAuction ? 'Pujar' : 'Comprar'}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleFavorite}
              className={isFavorite ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}