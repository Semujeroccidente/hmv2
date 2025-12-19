'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Upload, Loader2, Store, Plus, X } from 'lucide-react'
import { CategorySelector } from '@/components/admin/category-selector'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const MAX_IMAGES = 10
const formSchema = z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    price: z.coerce.number().positive('El precio debe ser positivo').max(1000000, 'Precio muy alto'),
    condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
    stock: z.coerce.number().int().min(1, 'El stock debe ser al menos 1').max(10000, 'Stock muy alto'),
    categoryId: z.string().min(1, 'La categoría principal es requerida'),
    otherCategoryIds: z.array(z.string()).optional(),
    imageUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
})

type FormValues = z.output<typeof formSchema>

export default function VenderPage() {
    const router = useRouter()
    const [images, setImages] = useState<string[]>([])
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            stock: 1,
            condition: "NEW" as const,
            imageUrl: "",
            categoryId: "",
            otherCategoryIds: []
        },
        mode: 'onChange' // Validación en tiempo real
    })

    // Verificar si hay imágenes para habilitar submit
    const canSubmit = images.length > 0

    const handleAddImage = () => {
        if (images.length >= MAX_IMAGES) {
            toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas`)
            return
        }

        const url = form.getValues('imageUrl')

        // Validación básica de URL
        if (!url || url.trim().length < 10 || !url.includes('.')) {
            form.setError('imageUrl', {
                type: 'manual',
                message: 'Ingresa una URL válida de imagen'
            })
            return
        }

        // Evitar duplicados
        if (images.includes(url.trim())) {
            toast.error("Esta imagen ya fue agregada")
            return
        }

        setImages([...images, url.trim()])
        form.setValue('imageUrl', '')
        form.clearErrors('imageUrl')
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
        // Remover del set de imágenes cargadas
        setLoadedImages(prev => {
            const newSet = new Set(prev)
            newSet.delete(index)
            return newSet
        })
    }

    const onInvalid = (errors: any) => {
        console.log("Form Validation Errors:", errors)
        const firstError = Object.values(errors)[0] as any
        toast.error("Error en el formulario", {
            description: firstError?.message || "Revisa los campos marcados"
        })
    }

    async function onSubmit(values: FormValues) {
        if (images.length === 0) {
            toast.error("Debes agregar al menos una imagen")
            return
        }

        if (images.length > MAX_IMAGES) {
            toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas`)
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                ...values,
                images: images,
                attributes: {},
            }

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error al crear producto')
            }

            toast.success('¡Producto publicado con éxito!', {
                description: 'Tu producto ya está visible en el mercado.'
            })

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push('/mis-ventas')
            }, 2000)

        } catch (error: any) {
            console.error('Error al crear producto:', error)

            let errorMessage = 'Error al publicar el producto'
            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            }

            toast.error("Error", {
                description: errorMessage
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Limpiar imágenes cargadas cuando se modifica el array
    useEffect(() => {
        setLoadedImages(new Set())
    }, [images])

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
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                                className="space-y-6"
                            >
                                {/* Sección de imágenes */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Imágenes del Producto ({images.length}/{MAX_IMAGES})</Label>
                                        {images.length > 0 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setImages([])}
                                            >
                                                <X className="h-3 w-3 mr-1" /> Limpiar todas
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {/* Opción 1: Subir archivo local */}
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        const reader = new FileReader()
                                                        reader.onloadend = () => {
                                                            const base64 = reader.result as string
                                                            if (images.length < MAX_IMAGES) {
                                                                setImages([...images, base64])
                                                                toast.success('Imagen agregada')
                                                                e.target.value = '' // Reset input
                                                            } else {
                                                                toast.error(`Máximo ${MAX_IMAGES} imágenes`)
                                                            }
                                                        }
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                                className="flex-1"
                                                disabled={images.length >= MAX_IMAGES}
                                            />
                                        </div>

                                        {/* Opción 2: URL de imagen */}
                                        <div className="flex gap-2">
                                            <FormField
                                                control={form.control}
                                                name="imageUrl"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="O pega una URL: https://ejemplo.com/imagen.jpg"
                                                                {...field}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault()
                                                                        handleAddImage()
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleAddImage}
                                                variant="secondary"
                                                disabled={!form.watch('imageUrl') || images.length >= MAX_IMAGES}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                {images.length >= MAX_IMAGES ? 'Límite' : 'Agregar'}
                                            </Button>
                                        </div>
                                    </div>

                                    <FormDescription>
                                        Agrega URLs de imágenes (máximo {MAX_IMAGES}). Presiona Enter después de pegar una URL.
                                    </FormDescription>

                                    {/* Grid de imágenes */}
                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden group bg-gray-100">
                                                    {!loadedImages.has(idx) && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                                        </div>
                                                    )}
                                                    <img
                                                        src={img}
                                                        alt={`Preview ${idx + 1}`}
                                                        className={`object-cover w-full h-full transition-opacity ${!loadedImages.has(idx) ? 'opacity-0' : 'opacity-100'
                                                            }`}
                                                        onLoad={() => setLoadedImages(prev => new Set(prev).add(idx))}
                                                        onError={() => {
                                                            toast.error(`Error al cargar imagen ${idx + 1}`)
                                                            handleRemoveImage(idx)
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                        aria-label="Eliminar imagen"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                        {idx + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {images.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                            <Upload className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                            <p className="text-sm text-gray-500">Agrega imágenes de tu producto</p>
                                            <p className="text-xs text-gray-400 mt-1">Mínimo 1 imagen, máximo {MAX_IMAGES}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Información básica */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título del producto *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: iPhone 14 Pro Max 256GB" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe tu producto en detalle..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Incluye detalles importantes como estado, características, etc.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Precio y Stock */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Precio (L) *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            field.onChange(value === '' ? 0 : parseFloat(value))
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cantidad disponible *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Condición */}
                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Condición *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona la condición" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="NEW">Nuevo</SelectItem>
                                                    <SelectItem value="USED">Usado</SelectItem>
                                                    <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Categorías */}
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría principal *</FormLabel>
                                            <FormControl>
                                                <CategorySelector
                                                    maxSelection={1}
                                                    onSelect={(categories) => {
                                                        if (categories.length >
                                                            0) {
                                                            field.onChange(categories[0].id)
                                                        } else {
                                                            field.onChange('')
                                                        }
                                                    }}
                                                    selectedIds={field.value ? [field.value] : []}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Selecciona la categoría que mejor describa tu producto
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="otherCategoryIds"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categorías adicionales (opcional)</FormLabel>
                                            <FormControl>
                                                <CategorySelector
                                                    maxSelection={2}
                                                    onSelect={(categories) => {
                                                        field.onChange(categories.map(c => c.id))
                                                    }}
                                                    selectedIds={field.value || []}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Puedes agregar hasta 2 categorías adicionales
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-3 pt-6 border-t">
                                    <Link href="/">
                                        <Button variant="ghost" type="button">Cancelar</Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !canSubmit}
                                    >
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isSubmitting ? 'Publicando...' : 'Publicar Anuncio'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}