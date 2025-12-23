'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
    maxImages?: number
    maxSizeMB?: number
    disabled?: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function ImageUpload({
    value = [],
    onChange,
    maxImages = 10,
    maxSizeMB = 5,
    disabled = false
}: ImageUploadProps) {
    const [uploading, setUploading] = useState<boolean[]>([])
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'hondumarket_products')
        formData.append('folder', 'hondumarket/products')

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        if (!cloudName) {
            throw new Error('Cloudinary no está configurado')
        }

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Error al subir imagen')
        }

        const data = await response.json()
        return data.secure_url
    }

    const validateFile = (file: File): string | null => {
        // Validar tipo
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `Tipo de archivo no permitido. Usa: JPG, PNG, WebP o GIF`
        }

        // Validar tamaño
        const maxSize = maxSizeMB * 1024 * 1024
        if (file.size > maxSize) {
            return `La imagen es muy grande. Máximo ${maxSizeMB}MB`
        }

        return null
    }

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        if (disabled) return

        const filesArray = Array.from(files)

        // Validar límite de imágenes
        if (value.length + filesArray.length > maxImages) {
            toast.error(`Máximo ${maxImages} imágenes permitidas`)
            return
        }

        // Validar cada archivo
        for (const file of filesArray) {
            const error = validateFile(file)
            if (error) {
                toast.error(error)
                return
            }
        }

        // Subir archivos
        const newUploading = [...uploading]
        const uploadPromises = filesArray.map(async (file, index) => {
            const uploadIndex = value.length + index
            newUploading[uploadIndex] = true
            setUploading([...newUploading])

            try {
                const url = await uploadToCloudinary(file)
                return url
            } catch (error) {
                console.error('Error uploading:', error)
                toast.error(`Error al subir ${file.name}`)
                return null
            } finally {
                newUploading[uploadIndex] = false
                setUploading([...newUploading])
            }
        })

        const urls = await Promise.all(uploadPromises)
        const validUrls = urls.filter((url): url is string => url !== null)

        if (validUrls.length > 0) {
            onChange([...value, ...validUrls])
            toast.success(`${validUrls.length} imagen(es) subida(s) correctamente`)
        }
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (disabled) return

        const files = e.dataTransfer.files
        handleFiles(files)
    }, [disabled, value, maxImages])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (disabled) return
        handleFiles(e.target.files)
    }

    const handleRemove = (index: number) => {
        if (disabled) return
        const newValue = value.filter((_, i) => i !== index)
        onChange(newValue)
        toast.success('Imagen eliminada')
    }

    const openFileDialog = () => {
        if (disabled) return
        fileInputRef.current?.click()
    }

    const canAddMore = value.length < maxImages

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-600'}
          ${!canAddMore ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={canAddMore && !disabled ? openFileDialog : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_TYPES.join(',')}
                    onChange={handleChange}
                    disabled={disabled || !canAddMore}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                    {canAddMore ? (
                        <>
                            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Arrastra imágenes aquí o haz clic para seleccionar
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    JPG, PNG, WebP o GIF (máx. {maxSizeMB}MB por imagen)
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-12 w-12 text-orange-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Límite de {maxImages} imágenes alcanzado
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Image Counter */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                    {value.length} de {maxImages} imágenes
                </span>
                {value.length > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onChange([])}
                        disabled={disabled}
                    >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar todas
                    </Button>
                )}
            </div>

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div
                            key={url}
                            className="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group bg-gray-100 dark:bg-gray-800"
                        >
                            {uploading[index] ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            ) : (
                                <>
                                    <Image
                                        src={url}
                                        alt={`Imagen ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        disabled={disabled}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                        aria-label="Eliminar imagen"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>

                                    {/* Image Number */}
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        #{index + 1}
                                    </div>

                                    {/* Primary Badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            Principal
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {value.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay imágenes agregadas</p>
                    <p className="text-xs mt-1">Mínimo 1 imagen, máximo {maxImages}</p>
                </div>
            )}
        </div>
    )
}
