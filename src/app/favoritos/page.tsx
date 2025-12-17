'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'

export default function FavoritosPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Mis Favoritos</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Guarda los productos que te encantan. Esta función estará disponible muy pronto.
                </p>
                <Link href="/">
                    <Button size="lg" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>
        </div>
    )
}
