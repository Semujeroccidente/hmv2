'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { toast } from 'sonner'

interface CartItem {
    id: string
    quantity: number
    price: number
    product: {
        id: string
        title: string
        images?: string
        thumbnail?: string
        condition: string
        seller: {
            id: string
            name: string
            rating: number
        }
        stock: number
    }
}

interface Cart {
    id: string
    userId: string
    status: string
    total: number
    items: CartItem[]
    subtotal: number
    itemCount: number
    shipping: number
    tax: number
    total: number
}

interface CartContextType {
    cart: Cart | null
    isLoading: boolean
    itemCount: number
    subtotal: number
    tax: number
    shipping: number
    total: number
    addToCart: (productId: string, quantity?: number) => Promise<boolean>
    updateQuantity: (itemId: string, quantity: number) => Promise<boolean>
    removeFromCart: (itemId: string) => Promise<boolean>
    clearCart: () => Promise<boolean>
    refreshCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    const loadCart = useCallback(async () => {
        // Avoid double loading if already loading
        // But we might want to refresh, so we don't block it strictly. 
        // We mainly want to avoid initial double fetch.
        setIsLoading(true)
        try {
            const response = await fetch('/api/cart')
            if (response.ok) {
                const data = await response.json()
                setCart(data.cart)
            }
        } catch (error) {
            console.error('Error cargando carrito:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity })
            })

            if (response.ok) {
                const data = await response.json()
                toast.success(data.message)
                await loadCart()
                return true
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Error al añadir al carrito')
                return false
            }
        } catch (error) {
            toast.error('Error de conexión')
            return false
        } finally {
            setIsLoading(false)
        }
    }, [loadCart])

    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            })

            if (response.ok) {
                await loadCart()
                return true
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Error actualizando cantidad')
                return false
            }
        } catch (error) {
            toast.error('Error de conexión')
            return false
        } finally {
            setIsLoading(false)
        }
    }, [loadCart])

    const removeFromCart = useCallback(async (itemId: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                const data = await response.json()
                toast.success(data.message)
                await loadCart()
                return true
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Error eliminando del carrito')
                return false
            }
        } catch (error) {
            toast.error('Error de conexión')
            return false
        } finally {
            setIsLoading(false)
        }
    }, [loadCart])

    const clearCart = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/cart/clear', {
                method: 'POST'
            })

            if (response.ok) {
                const data = await response.json()
                toast.success(data.message)
                await loadCart()
                return true
            } else {
                const errorData = await response.json()
                toast.error(errorData.error || 'Error limpiando carrito')
                return false
            }
        } catch (error) {
            toast.error('Error de conexión')
            return false
        } finally {
            setIsLoading(false)
        }
    }, [loadCart])

    // Load cart ONLY once on mount
    useEffect(() => {
        if (!isInitialized) {
            loadCart()
            setIsInitialized(true)
        }
    }, [loadCart, isInitialized])

    return (
        <CartContext.Provider value={{
            cart,
            isLoading,
            itemCount: cart?.itemCount || 0,
            subtotal: cart?.subtotal || 0,
            tax: cart?.tax || 0,
            shipping: cart?.shipping || 0,
            total: cart?.total || 0,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            refreshCart: loadCart
        }}>
            {children}
        </CartContext.Provider>
    )
}
