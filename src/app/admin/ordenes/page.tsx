'use client'

import { useState, useEffect } from 'react'
import { OrderManagement } from '@/components/admin/order-management'

export default function OrdenesPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                setOrders(Array.isArray(data.orders) ? data.orders : [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching orders:', err)
                setOrders([])
                setLoading(false)
            })
    }, [])

    const handleOrderUpdate = async (orderId: string, updates: any) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o))
            }
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando órdenes...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Órdenes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra y da seguimiento a todas las órdenes
                </p>
            </div>

            <OrderManagement
                orders={orders}
                onOrderUpdate={handleOrderUpdate}
            />
        </div>
    )
}
