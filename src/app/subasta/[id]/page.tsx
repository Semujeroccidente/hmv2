'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { AuctionDetailsSkeleton } from '@/components/marketplace/skeletons'
import {
    Heart,
    Gavel,
    Clock,
    TrendingUp,
    Shield,
    AlertCircle,
    ArrowLeft,
    Users
} from 'lucide-react'

interface Auction {
    id: string
    currentPrice: number
    startingPrice: number
    endDate: string
    status: string
    bidCount: number
    product: {
        title: string
        description: string
        images?: string
        thumbnail?: string
        condition: string
        seller: {
            name: string
            rating: number
        }
    }
}

export default function AuctionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [auction, setAuction] = useState<Auction | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [bidAmount, setBidAmount] = useState('')
    const [placingBid, setPlacingBid] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        loadAuction()
    }, [])

    const loadAuction = async () => {
        try {
            const response = await fetch(`/api/auctions/${resolvedParams.id}`)
            if (response.ok) {
                const data = await response.json()
                setAuction(data.auction)
            } else {
                setError('Subasta no encontrada')
            }
        } catch (err) {
            setError('Error cargando la subasta')
        } finally {
            setLoading(false)
        }
    }

    const handleBid = async () => {
        if (!auction || !bidAmount) return

        setPlacingBid(true)
        try {
            const response = await fetch(`/api/auctions/${auction.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(bidAmount) })
            })

            if (response.ok) {
                loadAuction() // Recargar datos
                setBidAmount('')
                alert('¡Puja realizada con éxito!')
            } else {
                const data = await response.json()
                alert(data.error || 'Error al realizar la puja')
            }
        } catch (err) {
            alert('Error de conexión')
        } finally {
            setPlacingBid(false)
        }
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
        }).format(amount)
    }

    if (loading) {
        return <AuctionDetailsSkeleton />
    }

    if (error || !auction) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Subasta no encontrada'}</h1>
                <Link href="/subastas">
                    <Button>Volver a las subastas</Button>
                </Link>
            </div>
        )
    }

    const images = auction.product.images ? JSON.parse(auction.product.images) : [auction.product.thumbnail || '/placeholder-product.svg']

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Link href="/subastas" className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a subastas
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Imágenes */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm aspect-square relative">
                            <Image
                                src={images[selectedImage]}
                                alt={auction.product.title}
                                fill
                                className="object-contain p-4"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-purple-600 hover:bg-purple-700">
                                    En Subasta
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Información */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{auction.product.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{auction.bidCount} pujas</span>
                                    </div>
                                    <span>|</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Termina: {new Date(auction.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <p className="text-sm text-purple-700 font-medium mb-1">Puja actual</p>
                                <div className="text-4xl font-bold text-purple-700 mb-4">
                                    {formatPrice(auction.currentPrice)}
                                </div>

                                <div className="flex gap-3">
                                    <Input
                                        type="number"
                                        placeholder={`Mínimo: ${formatPrice(auction.currentPrice + 1)}`}
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        size="lg"
                                        className="bg-purple-600 hover:bg-purple-700"
                                        onClick={handleBid}
                                        disabled={placingBid}
                                    >
                                        <Gavel className="h-5 w-5 mr-2" />
                                        {placingBid ? 'Pujando...' : 'Pujar'}
                                    </Button>
                                </div>
                                <p className="text-xs text-purple-600 mt-2">
                                    * La siguiente puja mínima es {formatPrice(auction.currentPrice + 10)}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {auction.product.description}
                                </p>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 pt-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    <span>Protección al comprador</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                    <span>Inspeccionado por HonduMarket</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
