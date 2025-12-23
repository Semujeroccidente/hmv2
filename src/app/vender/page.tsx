'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Store } from 'lucide-react'
import { CategorySelector } from '@/components/admin/category-selector'
import { ImageUpload } from '@/components/ui/image-upload'
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
    images: z.array(z.string().url()).min(1, 'Debes agregar al menos una imagen').max(MAX_IMAGES, `Máximo ${MAX_IMAGES} imágenes`),
})

type FormValues = z.output<typeof formSchema>

export default function VenderPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            stock: 1,
            condition: "NEW" as const,
            categoryId: "",
            otherCategoryIds: [],
            images: []
        },
        mode: 'onChange'
    })

    const onInvalid = (errors: any) => {
        console.log("Form Validation Errors:", errors)
        const firstError = Object.values(errors)[0] as { message?: string }
        toast.error("Error en el formulario", {
            description: firstError?.message || "Revisa los campos marcados"
        })
    }

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)

        try {
            const payload = {
                ...values,
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
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Imágenes del Producto *</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    maxImages={MAX_IMAGES}
                                                    maxSizeMB={5}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Arrastra o selecciona hasta {MAX_IMAGES} imágenes. La primera será la imagen principal.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                                        disabled={isSubmitting}
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