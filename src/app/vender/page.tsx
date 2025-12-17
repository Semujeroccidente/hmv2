'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Upload, Loader2, Store } from 'lucide-react'
import { MOCK_CATEGORIES } from '@/lib/mock-data'

export default function VenderPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        toast.success('¡Producto publicado con éxito!', {
            description: 'Tu producto ya está visible en el mercado.'
        })
        router.push('/mis-ventas')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/perfil" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al panel
                </Link>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Store className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Publicar nuevo producto</CardTitle>
                                <CardDescription>
                                    Completa la información para poner tu artículo a la venta.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Imágenes */}
                            <div className="space-y-2">
                                <Label>Fotografías</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-3">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Sube imágenes de tu producto</h3>
                                        <p className="text-sm text-gray-500 mt-1">Arrastra y suelta o haz clic para seleccionar</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título del producto</Label>
                                    <Input id="title" required placeholder="Ej: iPhone 13 Pro Max" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Precio (HNL)</Label>
                                    <Input id="price" type="number" required placeholder="0.00" min="0" step="0.01" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_CATEGORIES.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.icon} {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="condition">Estado</Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEW">Nuevo</SelectItem>
                                            <SelectItem value="USED">Usado - Como nuevo</SelectItem>
                                            <SelectItem value="FAIR">Usado - Buen estado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción detallada</Label>
                                <Textarea
                                    id="description"
                                    required
                                    placeholder="Describe las características, tiempo de uso, detalles importantes..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Unidades disponibles</Label>
                                    <Input id="stock" type="number" defaultValue="1" min="1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Ubicación del producto</Label>
                                    <Input id="location" placeholder="Ciudad, Departamento" />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 bg-gray-50 border-t p-6 rounded-b-lg">
                        <Link href="/mis-ventas">
                            <Button variant="ghost" type="button">Cancelar</Button>
                        </Link>
                        <Button type="submit" form="create-product-form" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Publicando...' : 'Publicar Anuncio'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
