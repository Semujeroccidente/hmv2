'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface UseFavoritesReturn {
    favorites: Set<string>
    isFavorite: (productId: string) => boolean
    toggleFavorite: (productId: string) => Promise<boolean>
    isLoading: boolean
    refreshFavorites: () => Promise<void>
}

export function useFavorites(): UseFavoritesReturn {
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)

    // Cargar favoritos al montar el componente
    useEffect(() => {
        refreshFavorites()
    }, [])

    const refreshFavorites = async () => {
        try {
            const response = await fetch('/api/favorites')

            if (response.ok) {
                const data = await response.json()
                const favoriteIds = new Set(
                    data.favorites.map((fav: any) => fav.productId)
                )
                setFavorites(favoriteIds)
            }
        } catch (error) {
            console.error('Error loading favorites:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const isFavorite = (productId: string): boolean => {
        return favorites.has(productId)
    }

    const toggleFavorite = async (productId: string): Promise<boolean> => {
        const wasFavorite = isFavorite(productId)

        try {
            if (wasFavorite) {
                // Eliminar de favoritos
                const response = await fetch(`/api/favorites?productId=${productId}`, {
                    method: 'DELETE'
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || 'Error al eliminar de favoritos')
                }

                // Actualizar estado local
                setFavorites(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(productId)
                    return newSet
                })

                toast.success('Eliminado de favoritos')
                return false
            } else {
                // Agregar a favoritos
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                })

                if (!response.ok) {
                    const error = await response.json()

                    if (response.status === 401) {
                        toast.error('Debes iniciar sesión para agregar favoritos')
                        // Redirigir al login después de un breve delay
                        setTimeout(() => {
                            window.location.href = '/login'
                        }, 1500)
                        return false
                    }

                    throw new Error(error.error || 'Error al agregar a favoritos')
                }

                // Actualizar estado local
                setFavorites(prev => {
                    const newSet = new Set(prev)
                    newSet.add(productId)
                    return newSet
                })

                toast.success('Agregado a favoritos')
                return true
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            toast.error(error instanceof Error ? error.message : 'Error al actualizar favoritos')
            return wasFavorite
        }
    }

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        isLoading,
        refreshFavorites
    }
}
