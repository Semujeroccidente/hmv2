'use client'

import { useState, useEffect } from 'react'
import { AuctionManagement } from '@/components/admin/auction-management'

export default function SubastasPage() {
    const [auctions, setAuctions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/auctions')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                setAuctions(Array.isArray(data.auctions) ? data.auctions : [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching auctions:', err)
                setAuctions([])
                setLoading(false)
            })
    }, [])

    const handleAuctionUpdate = async (auctionId: string, updates: any) => {
        try {
            const response = await fetch(`/api/admin/auctions/${auctionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                setAuctions(auctions.map(a => a.id === auctionId ? { ...a, ...updates } : a))
            }
        } catch (error) {
            console.error('Error updating auction:', error)
        }
    }

    const handleAuctionCancel = async (auctionId: string) => {
        try {
            const response = await fetch(`/api/admin/auctions/${auctionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' })
            })

            if (response.ok) {
                setAuctions(auctions.map(a => a.id === auctionId ? { ...a, status: 'CANCELLED' } : a))
            }
        } catch (error) {
            console.error('Error cancelling auction:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando subastas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Subastas
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra todas las subastas activas, programadas y finalizadas
                </p>
            </div>

            <AuctionManagement
                auctions={auctions}
                onAuctionUpdate={handleAuctionUpdate}
                onAuctionCancel={handleAuctionCancel}
            />
        </div>
    )
}
