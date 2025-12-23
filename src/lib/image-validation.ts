import { z } from 'zod'

/**
 * Image validation constants
 */
export const IMAGE_VALIDATION = {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    MAX_DIMENSION: 4096, // 4K
    MIN_DIMENSION: 100,
} as const

/**
 * Image URL schema with validation
 */
export const imageUrlSchema = z.string().url('URL de imagen inválida').refine(
    (url) => {
        try {
            const urlObj = new URL(url)
            const pathname = urlObj.pathname.toLowerCase()
            return IMAGE_VALIDATION.ALLOWED_EXTENSIONS.some(ext => pathname.endsWith(ext))
        } catch {
            return false
        }
    },
    { message: 'La URL debe apuntar a una imagen válida (jpg, png, webp, gif)' }
)

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
    const result = imageUrlSchema.safeParse(url)

    if (!result.success) {
        return {
            valid: false,
            error: result.error.errors[0]?.message || 'URL de imagen inválida'
        }
    }

    return { valid: true }
}

/**
 * Validate base64 image
 */
export function validateBase64Image(base64: string): { valid: boolean; error?: string } {
    try {
        // Check if it's a valid base64 data URL
        if (!base64.startsWith('data:image/')) {
            return {
                valid: false,
                error: 'Debe ser una imagen en formato base64'
            }
        }

        // Extract MIME type
        const mimeMatch = base64.match(/^data:(image\/[a-z]+);base64,/)
        if (!mimeMatch) {
            return {
                valid: false,
                error: 'Formato base64 inválido'
            }
        }

        const mimeType = mimeMatch[1]
        if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(mimeType)) {
            return {
                valid: false,
                error: `Tipo de imagen no permitido. Permitidos: ${IMAGE_VALIDATION.ALLOWED_TYPES.join(', ')}`
            }
        }

        // Extract base64 data
        const base64Data = base64.split(',')[1]
        if (!base64Data) {
            return {
                valid: false,
                error: 'Datos de imagen inválidos'
            }
        }

        // Calculate size
        const sizeInBytes = (base64Data.length * 3) / 4
        if (sizeInBytes > IMAGE_VALIDATION.MAX_SIZE_BYTES) {
            return {
                valid: false,
                error: `La imagen excede el tamaño máximo de ${IMAGE_VALIDATION.MAX_SIZE_MB}MB`
            }
        }

        return { valid: true }
    } catch (error) {
        return {
            valid: false,
            error: 'Error al validar la imagen'
        }
    }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Tipo de archivo no permitido. Permitidos: ${IMAGE_VALIDATION.ALLOWED_EXTENSIONS.join(', ')}`
        }
    }

    // Check file size
    if (file.size > IMAGE_VALIDATION.MAX_SIZE_BYTES) {
        return {
            valid: false,
            error: `El archivo excede el tamaño máximo de ${IMAGE_VALIDATION.MAX_SIZE_MB}MB`
        }
    }

    return { valid: true }
}

/**
 * Get image dimensions from URL (client-side only)
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            resolve({ width: img.width, height: img.height })
        }
        img.onerror = () => {
            reject(new Error('No se pudo cargar la imagen'))
        }
        img.src = url
    })
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
    url: string
): Promise<{ valid: boolean; error?: string }> {
    try {
        const { width, height } = await getImageDimensions(url)

        if (width < IMAGE_VALIDATION.MIN_DIMENSION || height < IMAGE_VALIDATION.MIN_DIMENSION) {
            return {
                valid: false,
                error: `La imagen debe tener al menos ${IMAGE_VALIDATION.MIN_DIMENSION}x${IMAGE_VALIDATION.MIN_DIMENSION} píxeles`
            }
        }

        if (width > IMAGE_VALIDATION.MAX_DIMENSION || height > IMAGE_VALIDATION.MAX_DIMENSION) {
            return {
                valid: false,
                error: `La imagen no debe exceder ${IMAGE_VALIDATION.MAX_DIMENSION}x${IMAGE_VALIDATION.MAX_DIMENSION} píxeles`
            }
        }

        return { valid: true }
    } catch (error) {
        return {
            valid: false,
            error: 'No se pudo validar las dimensiones de la imagen'
        }
    }
}
