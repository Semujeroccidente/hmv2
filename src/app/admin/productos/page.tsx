'use client'

import { useState, useEffect } from 'react'
import { ProductManagement } from '@/components/admin/product-management'

export default function ProductosPage() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch products and categories in parallel
        Promise.all([
            fetch('/api/admin/products').then(res => res.ok ? res.json() : { products: [] }),
            fetch('/api/admin/categories').then(res => res.ok ? res.json() : { categories: [] })
        ])
            .then(([productsData, categoriesData]) => {
                setProducts(Array.isArray(productsData.products) ? productsData.products : [])
                setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching data:', err)
                setProducts([])
                setCategories([])
                setLoading(false)
            })
    }, [])

    const handleProductUpdate = async (productId: string, updates: any) => {
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                setProducts(products.map(p => p.id === productId ? { ...p, ...updates } : p))
            }
        } catch (error) {
            console.error('Error updating product:', error)
        }
    }

    const handleProductCreate = async (productData: any) => {
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            })

            if (response.ok) {
                const newProduct = await response.json()
                setProducts([...products, newProduct])
            }
        } catch (error) {
            console.error('Error creating product:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando productos...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Productos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Modera y administra todos los productos publicados
                </p>
            </div>

            <ProductManagement
                products={products}
                categories={categories}
                onProductUpdate={handleProductUpdate}
                onProductCreate={handleProductCreate}
            />
        </div>
    )
}
