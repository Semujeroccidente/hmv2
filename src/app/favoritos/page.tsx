'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Heart,
    ArrowLeft,
    Trash2,
    ShoppingCart,
    Package,
    Info
} from 'lucide-react'

interface FavoriteProduct {
    id: string
    name: string
    price: number
    image: string
    seller: string
    inStock: boolean
}

export default function FavoritosPage() {
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simular carga de favoritos
        // En el futuro, esto se conectará a la API
        setIsLoading(false)
    }, [])

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
        }).format(amount)
    }

    const handleRemoveFavorite = (id: string) => {
        setFavorites(favorites.filter(item => item.id !== id))
    }

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a la tienda
                        </Link>

                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="h-12 w-12 text-red-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Tu lista de favoritos está vacía
                            </h1>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Guarda los productos que te gustan para encontrarlos fácilmente más tarde.
                                ¡Explora nuestro catálogo y marca tus favoritos!
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
                                    Mis Favoritos
                                </h1>
                                <p className="text-gray-600">
                                    {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alert informativo */}
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            Los productos en tu lista de favoritos se guardan automáticamente.
                            Recibe notificaciones cuando bajen de precio.
                        </AlertDescription>
                    </Alert>

                    {/* Grid de productos favoritos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((product) => (
                            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                                        onClick={() => handleRemoveFavorite(product.id)}
                                    >
                                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                                    </Button>
                                    {!product.inStock && (
                                        <Badge className="absolute top-2 left-2 bg-red-500">
                                            Agotado
                                        </Badge>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Vendido por {product.seller}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {formatPrice(product.price)}
                                        </span>
                                        <Button
                                            size="sm"
                                            disabled={!product.inStock}
                                            className="flex items-center gap-2"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            Agregar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Sugerencias */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-lg">Productos recomendados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">
                                    Descubre más productos que podrían interesarte
                                </p>
                                <Link href="/">
                                    <Button variant="outline" className="flex items-center gap-2 mx-auto">
                                        <Package className="h-4 w-4" />
                                        Explorar más productos
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
