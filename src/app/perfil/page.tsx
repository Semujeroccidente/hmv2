'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    User,
    Package,
    ShoppingBag,
    Settings,
    CreditCard,
    LogOut,
    TrendingUp,
    Heart,
    MapPin,
    Store,
    ArrowLeft
} from 'lucide-react'

// Mock user stats - In a real app these would come from an API/Server Component
const MOCK_STATS = {
    ordersFound: 12,
    activeListings: 5,
    totalSales: 45000,
    favorites: 8
}

export default function PerfilPage() {
    // In a real app we would use the session here
    const user = {
        name: 'Usuario Demo',
        email: 'demo@hondumarket.com',
        role: 'USER',
        memberSince: 'Enero 2024'
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Link>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / User Info Card */}
                    <aside className="w-full md:w-80 space-y-6">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl font-bold">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Miembro desde {user.memberSince}
                                </div>

                                <div className="mt-8 space-y-2 text-left">
                                    <h3 className="font-semibold text-sm text-gray-900 mb-2 px-2">Navegación</h3>
                                    <Link href="/">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Store className="mr-2 h-4 w-4" />
                                            Volver al Inicio
                                        </Button>
                                    </Link>
                                    <Link href="/mis-pedidos">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Package className="mr-2 h-4 w-4" />
                                            Mis Pedidos
                                        </Button>
                                    </Link>
                                    <Link href="/mis-ventas">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <StoreIcon className="mr-2 h-4 w-4" />
                                            Mis Ventas
                                        </Button>
                                    </Link>
                                    <Link href="/favoritos">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Heart className="mr-2 h-4 w-4" />
                                            Favoritos
                                        </Button>
                                    </Link>
                                    <Link href="/configuracion">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Configuración
                                        </Button>
                                    </Link>
                                    <div className="pt-4 border-t border-gray-100 mt-4">
                                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Cerrar Sesión
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Pedidos</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{MOCK_STATS.ordersFound}</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                        <StoreIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ventas Activas</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{MOCK_STATS.activeListings}</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ingresos</p>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL', maximumFractionDigits: 0 }).format(MOCK_STATS.totalSales)}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 flex items-center space-x-4">
                                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                        <Heart className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Favoritos</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{MOCK_STATS.favorites}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <Card className="col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Pedidos Recientes</CardTitle>
                                    <Link href="/mis-pedidos" className="text-sm text-blue-600 hover:underline">Ver todo</Link>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-md relative overflow-hidden">
                                                        {/* Placeholder image */}
                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                            <Package className="h-6 w-6" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Pedido #{1000 + i}</p>
                                                        <p className="text-xs text-gray-500">hace 2 días</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold">L 1,500.00</p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        Entregado
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <Link href="/vender">
                                        <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                            <StoreIcon className="h-6 w-6" />
                                            <span>Vender Artículo</span>
                                        </Button>
                                    </Link>
                                    <Link href="/configuracion">
                                        <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
                                            <MapPin className="h-6 w-6" />
                                            <span>Direcciones</span>
                                        </Button>
                                    </Link>
                                    <Link href="/configuracion">
                                        <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
                                            <CreditCard className="h-6 w-6" />
                                            <span>Métodos de Pago</span>
                                        </Button>
                                    </Link>
                                    <Link href="/configuracion">
                                        <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-gray-50">
                                            <Settings className="h-6 w-6" />
                                            <span>Seguridad</span>
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

function StoreIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
    )
}
