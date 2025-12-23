'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'
import { useFavorites } from '@/hooks/use-favorites'
import {
    Heart,
    ShoppingCart,
    Star,
    Share2,
    Shield,
    Truck,
    ArrowLeft
} from 'lucide-react'

interface Product {
    id: string
    title: string
    description: string
    price: number
    originalPrice?: number
    images?: string
    thumbnail?: string
    condition: string
    stock: number
    category: {
        id: string
        name: string
    }
    seller: {
        id: string
        name: string
        rating: number
    }
}

interface ProductDetailsProps {
    product: Product
    relatedProducts?: Product[]
}

export function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
    const { addToCart } = useCart()
    const { isFavorite, toggleFavorite } = useFavorites()

    const handleAddToCart = async () => {
        if (!product) return
        setIsAddingToCart(true)
        await addToCart(product.id, 1)
        setIsAddingToCart(false)
    }

    const handleToggleFavorite = async () => {
        setIsTogglingFavorite(true)
        await toggleFavorite(product.id)
        setIsTogglingFavorite(false)
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
        }).format(amount)
    }

    // Parse images safely
    let parsedImages = [product.thumbnail || '/placeholder-product.svg']
    if (product.images) {
        try {
            const parsed = JSON.parse(product.images)
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsedImages = parsed
            }
        } catch (e) {
            // fallback to parsedImages default
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Imágenes */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm aspect-square relative group">
                            <Image
                                src={parsedImages[selectedImage]}
                                alt={product.title}
                                fill
                                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        {parsedImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {parsedImages.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-blue-600' : 'border-transparent'
                                            }`}
                                    >
                                        <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="mb-2">
                                        {product.condition === 'NEW' ? 'Nuevo' : 'Usado'}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`rounded-full transition-all duration-200 ${isFavorite(product.id)
                                                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                                    : 'hover:bg-red-50 hover:text-red-500'
                                                }`}
                                            onClick={handleToggleFavorite}
                                            disabled={isTogglingFavorite}
                                        >
                                            {isTogglingFavorite ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                            ) : (
                                                <Heart className={`h-5 w-5 transition-all duration-200 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span>4.5 (12 reseñas)</span>
                                    </div>
                                    <span>|</span>
                                    <span>{product.stock} disponibles</span>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {formatPrice(product.price)}
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500 line-through">
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                        <span className="text-green-600 font-medium">
                                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105" onClick={handleAddToCart} disabled={isAddingToCart}>
                                    {isAddingToCart ? (
                                        'Agregando...'
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Agregar al carrito
                                        </>
                                    )}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                    onClick={() => {
                                        addToCart(product.id, 1)
                                        window.location.href = '/checkout'
                                    }}
                                >
                                    Comprar ahora
                                </Button>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 pt-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span>Garantía de compra protegida</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-blue-600" />
                                    <span>Envíos a todo el país</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Descripción</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Información del vendedor</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xl border border-gray-200">
                                    {product.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{product.seller.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span>{product.seller.rating} Puntos de vendedor</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Productos Relacionados */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Productos Relacionados</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                                        <Link href={`/producto/${p.id}`}>
                                            <Image
                                                src={p.thumbnail || '/placeholder-product.svg'}
                                                alt={p.title}
                                                fill
                                                className="object-contain hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>
                                    </div>
                                    <Link href={`/producto/${p.id}`}>
                                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">{p.title}</h3>
                                    </Link>
                                    <p className="text-lg font-bold text-blue-600">{formatPrice(p.price)}</p>
                                    <p className="text-xs text-gray-500 mt-1">{p.condition === 'NEW' ? 'Nuevo' : 'Usado'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
