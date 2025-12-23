/**
 * Cloudinary Utilities for HonduMarket
 * 
 * Funciones para trabajar con imágenes en Cloudinary
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/**
 * Genera una URL optimizada de Cloudinary
 */
export function getOptimizedImageUrl(
    url: string,
    options: {
        width?: number
        height?: number
        quality?: 'auto' | number
        format?: 'auto' | 'webp' | 'avif'
        crop?: 'fill' | 'fit' | 'scale' | 'thumb'
    } = {}
): string {
    if (!url || !url.includes('cloudinary.com')) {
        return url
    }

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto',
        crop = 'fill'
    } = options

    try {
        const urlParts = url.split('/upload/')
        if (urlParts.length !== 2) return url

        const transformations: string[] = []

        if (width) transformations.push(`w_${width}`)
        if (height) transformations.push(`h_${height}`)
        if (crop) transformations.push(`c_${crop}`)
        if (quality) transformations.push(`q_${quality}`)
        if (format) transformations.push(`f_${format}`)

        const transformString = transformations.join(',')
        return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`
    } catch (error) {
        console.error('Error optimizing image URL:', error)
        return url
    }
}

/**
 * Extrae el public_id de una URL de Cloudinary
 */
export function extractPublicId(url: string): string | null {
    if (!url || !url.includes('cloudinary.com')) {
        return null
    }

    try {
        const parts = url.split('/upload/')
        if (parts.length !== 2) return null

        const pathParts = parts[1].split('/')
        // Remover transformaciones si existen
        const relevantParts = pathParts.filter(part => !part.includes('_'))

        // Remover extensión
        const lastPart = relevantParts[relevantParts.length - 1]
        const publicId = lastPart.split('.')[0]

        return relevantParts.slice(0, -1).concat(publicId).join('/')
    } catch (error) {
        console.error('Error extracting public ID:', error)
        return null
    }
}

/**
 * Verifica si una URL es de Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com') || url.includes('cloudinary.com')
}

/**
 * Genera thumbnail URL para preview
 */
export function getThumbnailUrl(url: string): string {
    return getOptimizedImageUrl(url, {
        width: 400,
        height: 400,
        quality: 'auto',
        format: 'auto',
        crop: 'thumb'
    })
}

/**
 * Genera URL para product card
 */
export function getProductCardImageUrl(url: string): string {
    return getOptimizedImageUrl(url, {
        width: 600,
        height: 600,
        quality: 'auto',
        format: 'auto',
        crop: 'fill'
    })
}

/**
 * Genera URL para product detail
 */
export function getProductDetailImageUrl(url: string): string {
    return getOptimizedImageUrl(url, {
        width: 1200,
        height: 1200,
        quality: 'auto',
        format: 'auto',
        crop: 'fit'
    })
}

/**
 * Valida que una URL sea de Cloudinary y del proyecto correcto
 */
export function validateCloudinaryUrl(url: string): boolean {
    if (!isCloudinaryUrl(url)) return false
    if (!CLOUD_NAME) return true // Si no hay cloud name configurado, aceptar cualquier URL de Cloudinary
    return url.includes(CLOUD_NAME)
}
