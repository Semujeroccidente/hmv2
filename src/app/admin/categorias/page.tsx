'use client'

import { useState, useEffect } from 'react'
import { CategoryManagement } from '@/components/admin/category-management'

export default function CategoriasPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/categories')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                setCategories(Array.isArray(data.categories) ? data.categories : [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching categories:', err)
                setCategories([])
                setLoading(false)
            })
    }, [])

    const handleCategoryCreate = async (categoryData: any) => {
        try {
            const response = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            })

            if (response.ok) {
                const newCategory = await response.json()
                setCategories([...categories, newCategory])
            }
        } catch (error) {
            console.error('Error creating category:', error)
        }
    }

    const handleCategoryUpdate = async (categoryId: string, updates: any) => {
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                setCategories(categories.map(c => c.id === categoryId ? { ...c, ...updates } : c))
            }
        } catch (error) {
            console.error('Error updating category:', error)
        }
    }

    const handleCategoryDelete = async (categoryId: string) => {
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setCategories(categories.filter(c => c.id !== categoryId))
            }
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando categorías...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Categorías
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra las categorías y subcategorías del marketplace
                </p>
            </div>

            <CategoryManagement
                categories={categories}
                onCategoryCreate={handleCategoryCreate}
                onCategoryUpdate={handleCategoryUpdate}
                onCategoryDelete={handleCategoryDelete}
            />
        </div>
    )
}
