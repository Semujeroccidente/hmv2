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
import { RealTimeAuction, BidHistory } from '@/components/auctions/real-time-auction'
import { toast } from 'sonner'
import {
    Heart,
    Gavel,
    Clock,
    TrendingUp,
    Shield,
    AlertCircle,
    ArrowLeft,
    Users,
    Star,
    Loader2
} from 'lucide-react'

interface Bid {
    id: string
    amount: number
    createdAt: string
    user: {
        id: string
        name: string
        email: string
        avatar?: string
    }
}

interface Auction {
    id: string
    currentPrice: number
    startingPrice: number
    reservePrice?: number
    bidIncrement?: number
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
            id: string
            name: string
            rating: number
        }
    }
    bids?: Bid[]
}

export default function AuctionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [auction, setAuction] = useState<Auction | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [bidAmount, setBidAmount] = useState('')
    const [placingBid, setPlacingBid] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)
    const [bids, setBids] = useState<Bid[]>([])
    const [loadingBids, setLoadingBids] = useState(false)

    useEffect(() => {
        loadAuction()
        loadBids()
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

    const loadBids = async () => {
        setLoadingBids(true)
        try {
            const response = await fetch(`/api/auctions/${resolvedParams.id}/bids?limit=20`)
            if (response.ok) {
                const data = await response.json()
                setBids(data.bids)
            }
        } catch (err) {
            console.error('Error loading bids:', err)
        } finally {
            setLoadingBids(false)
        }
    }

    const handleBid = async () => {
        if (!auction || !bidAmount) {
            toast.error('Ingresa un monto válido')
            return
        }

        const amount = parseFloat(bidAmount)
        const minBid = auction.currentPrice + (auction.bidIncrement || 50)

        if (amount < minBid) {
            toast.error(`La puja mínima es L. ${minBid.toFixed(2)}`)
            return
        }

        setPlacingBid(true)
        try {
            const response = await fetch(`/api/auctions/${auction.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('¡Puja realizada con éxito!', {
                    description: `Tu puja de L. ${amount.toLocaleString()} ha sido registrada`
                })
                setBidAmount('')
                // Actualizar datos localmente
                if (auction) {
                    setAuction({
                        ...auction,
                        currentPrice: amount,
                        bidCount: auction.bidCount + 1
                    })
                }
                // Recargar historial
                loadBids()
            } else {
                toast.error(data.error || 'Error al realizar la puja', {
                    description: data.minBid ? `Mínimo: L. ${data.minBid}` : undefined
                })
            }
        } catch (err) {
            toast.error('Error de conexión')
        } finally {
            setPlacingBid(false)
        }
    }

    const handleBidUpdate = (data: { currentPrice: number; bidCount: number }) => {
        if (auction) {
            setAuction({
                ...auction,
                currentPrice: data.currentPrice,
                bidCount: data.bidCount
            })
        }
        // Recargar historial cuando hay nueva puja
        loadBids()
    }

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL'
        }).format(amount)
    }

    const getTimeRemaining = () => {
        if (!auction) return ''
        const now = new Date().getTime()
        const end = new Date(auction.endDate).getTime()
        const diff = end - now

        if (diff <= 0) return 'Finalizada'

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) return `${days}d ${hours}h`
        if (hours > 0) return `${hours}h ${minutes}m`
        return `${minutes}m`
    }

    if (loading) {
        return <AuctionDetailsSkeleton />
    }

    if (error || !auction) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || 'Subasta no encontrada'}</h1>
                <Link href="/subastas">
                    <Button>Volver a las subastas</Button>
                </Link>
            </div>
        )
    }

    const images = auction.product.images ? JSON.parse(auction.product.images) : [auction.product.thumbnail || '/placeholder-product.svg']
    const minBid = auction.currentPrice + (auction.bidIncrement || 50)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <Link href="/subastas" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a subastas
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Izquierda: Imágenes */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Imagen Principal */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm aspect-square relative">
                            <Image
                                src={images[selectedImage]}
                                alt={auction.product.title}
                                fill
                                className="object-contain p-4"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-purple-600 hover:bg-purple-700">
                                    En Subasta
                                </Badge>
                                {auction.status === 'ACTIVE' && (
                                    <Badge variant="outline" className="bg-white/90 backdrop-blur">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {getTimeRemaining()}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Miniaturas */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                            ? 'border-purple-600 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${auction.product.title} ${idx + 1}`}
                                            width={100}
                                            height={100}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Descripción */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4">Descripción</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {auction.product.description}
                                </p>

                                <Separator className="my-6" />

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        <span>Protección al comprador</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        <span>Inspeccionado por HonduMarket</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span>Vendedor: {auction.product.seller.name} ({auction.product.seller.rating}⭐)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Historial de Pujas */}
                        {loadingBids ? (
                            <Card>
                                <CardContent className="p-6 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                                </CardContent>
                            </Card>
                        ) : (
                            <BidHistory bids={bids} />
                        )}
                    </div>

                    {/* Columna Derecha: Información y Pujas */}
                    <div className="space-y-6">
                        {/* Información Principal */}
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {auction.product.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{auction.bidCount} pujas</span>
                                        </div>
                                        <Badge variant="outline">
                                            {auction.product.condition}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Precio Actual */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">
                                        Puja actual
                                    </p>
                                    <div className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-1">
                                        {formatPrice(auction.currentPrice)}
                                    </div>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                        Precio inicial: {formatPrice(auction.startingPrice)}
                                    </p>
                                </div>

                                {/* Formulario de Puja */}
                                {auction.status === 'ACTIVE' && (
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <Input
                                                type="number"
                                                placeholder={`Mínimo: ${formatPrice(minBid)}`}
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                className="flex-1"
                                                min={minBid}
                                                step={auction.bidIncrement || 50}
                                            />
                                            <Button
                                                size="lg"
                                                className="bg-purple-600 hover:bg-purple-700"
                                                onClick={handleBid}
                                                disabled={placingBid || !bidAmount}
                                            >
                                                {placingBid ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                        Pujando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Gavel className="h-5 w-5 mr-2" />
                                                        Pujar
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            * Puja mínima: {formatPrice(minBid)} (incremento de {formatPrice(auction.bidIncrement || 50)})
                                        </p>
                                    </div>
                                )}

                                {auction.status === 'ENDED' && (
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                                            Esta subasta ha finalizado
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Componente de Tiempo Real */}
                        <RealTimeAuction
                            auctionId={auction.id}
                            currentPrice={auction.currentPrice}
                            bidCount={auction.bidCount}
                            seller={auction.product.seller}
                            onBidUpdate={handleBidUpdate}
                        />

                        {/* Información Adicional */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Información de la Subasta
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Termina:</span>
                                        <span className="font-medium">
                                            {new Date(auction.endDate).toLocaleString('es-HN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Total de pujas:</span>
                                        <span className="font-medium">{auction.bidCount}</span>
                                    </div>
                                    {auction.reservePrice && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Precio de reserva:</span>
                                            <span className="font-medium">{formatPrice(auction.reservePrice)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Condición:</span>
                                        <Badge variant="outline">{auction.product.condition}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
