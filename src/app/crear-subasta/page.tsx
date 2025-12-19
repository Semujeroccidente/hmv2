'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Gavel, Clock, DollarSign, TrendingUp, Info, Upload, X } from 'lucide-react'
import { CategorySelector } from '@/components/admin/category-selector'

export default function CrearSubastaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        condition: 'USED',
        startingPrice: '',
        reservePrice: '',
        bidIncrement: '10',
        duration: '7', // días
        endDate: '',
        images: [] as string[]
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                setImages(prev => [...prev, base64])
                setFormData(prev => ({ ...prev, images: [...prev.images, base64] }))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    }

    const calculateEndDate = (days: string) => {
        const date = new Date()
        date.setDate(date.getDate() + parseInt(days))
        return date.toISOString()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Calculate end date based on duration
            const endDate = calculateEndDate(formData.duration)

            const auctionData = {
                ...formData,
                startingPrice: parseFloat(formData.startingPrice),
                reservePrice: formData.reservePrice ? parseFloat(formData.reservePrice) : null,
                bidIncrement: parseFloat(formData.bidIncrement),
                endDate
            }

            const response = await fetch('/api/auctions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(auctionData)
            })

            if (response.ok) {
                alert('¡Subasta creada exitosamente!')
                router.push('/subastas')
            } else {
                const data = await response.json()
                alert(data.error || 'Error al crear la subasta')
            }
        } catch (error) {
            alert('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/subastas" className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a subastas
                </Link>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Gavel className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Crear Subasta</h1>
                            <p className="text-gray-600">Configura tu subasta y comienza a recibir pujas</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Información Básica */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Producto</CardTitle>
                                <CardDescription>Describe el producto que vas a subastar</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Título de la Subasta *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ej: MacBook Pro M1 2020 - Como nuevo"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Descripción *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe el producto, su estado, accesorios incluidos, etc."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Categoría *</Label>
                                        <CategorySelector
                                            maxSelection={1}
                                            onSelect={(categories) => {
                                                if (categories.length > 0) {
                                                    setFormData({ ...formData, categoryId: categories[0].id })
                                                }
                                            }}
                                            selectedIds={formData.categoryId ? [formData.categoryId] : []}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="condition">Condición *</Label>
                                        <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NEW">Nuevo</SelectItem>
                                                <SelectItem value="USED">Usado</SelectItem>
                                                <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="images">Imágenes del Producto</Label>
                                    <div className="mt-2">
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-600">Click para subir imágenes</p>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                                            </div>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4 mt-4">
                                            {images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Configuración de Subasta */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                    Configuración de Precios
                                </CardTitle>
                                <CardDescription>Define los precios y reglas de la subasta</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startingPrice">Precio Inicial (HNL) *</Label>
                                        <Input
                                            id="startingPrice"
                                            type="number"
                                            value={formData.startingPrice}
                                            onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                                            placeholder="15000"
                                            required
                                            min="1"
                                            step="0.01"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">El precio desde el cual comenzará la subasta</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="reservePrice">Precio de Reserva (HNL)</Label>
                                        <Input
                                            id="reservePrice"
                                            type="number"
                                            value={formData.reservePrice}
                                            onChange={(e) => setFormData({ ...formData, reservePrice: e.target.value })}
                                            placeholder="20000 (opcional)"
                                            min="1"
                                            step="0.01"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Precio mínimo para vender (opcional)</p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="bidIncrement">Incremento Mínimo de Puja (HNL) *</Label>
                                    <Select value={formData.bidIncrement} onValueChange={(value) => setFormData({ ...formData, bidIncrement: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">L 10</SelectItem>
                                            <SelectItem value="50">L 50</SelectItem>
                                            <SelectItem value="100">L 100</SelectItem>
                                            <SelectItem value="500">L 500</SelectItem>
                                            <SelectItem value="1000">L 1,000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1">Monto mínimo que debe aumentar cada puja</p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-800">
                                            <p className="font-medium mb-1">Sobre el precio de reserva:</p>
                                            <p>Si estableces un precio de reserva, la subasta solo se completará si la puja final alcanza o supera este monto. Si no se alcanza, no estás obligado a vender.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Duración */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                    Duración de la Subasta
                                </CardTitle>
                                <CardDescription>¿Por cuánto tiempo estará activa tu subasta?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="duration">Duración *</Label>
                                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 día</SelectItem>
                                            <SelectItem value="3">3 días</SelectItem>
                                            <SelectItem value="5">5 días</SelectItem>
                                            <SelectItem value="7">7 días (recomendado)</SelectItem>
                                            <SelectItem value="10">10 días</SelectItem>
                                            <SelectItem value="14">14 días</SelectItem>
                                            <SelectItem value="30">30 días</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        La subasta finalizará automáticamente después de este período
                                    </p>
                                </div>

                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-purple-800">
                                            <p className="font-medium mb-1">Consejo:</p>
                                            <p>Las subastas de 7 días suelen obtener más pujas y mejores precios finales, ya que dan tiempo suficiente para que más personas descubran tu producto.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Botones */}
                        <div className="flex gap-4 justify-end pt-6 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                                <Gavel className="h-4 w-4 mr-2" />
                                {loading ? 'Creando...' : 'Crear Subasta'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
