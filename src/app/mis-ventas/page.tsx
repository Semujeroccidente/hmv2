'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    Store,
    ArrowLeft
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export default function MisVentasPage() {
    const [searchQuery, setSearchQuery] = useState('')
    // Simulate filtering products where seller is current user (e.g. 'user-id-demo' or similar)
    // In a real app this would be a server component fetching from DB or API
    const myProducts = MOCK_PRODUCTS

    const filteredProducts = myProducts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Link href="/perfil" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al panel
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Ventas</h1>
                        <p className="text-gray-500">Gestiona tus productos y publicaciones.</p>
                    </div>
                    <Link href="/vender">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Productos Activos</p>
                                <h3 className="text-2xl font-bold">{myProducts.length}</h3>
                            </div>
                            <Store className="h-8 w-8 text-blue-500 opacity-20" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Ventas del Mes</p>
                                <h3 className="text-2xl font-bold">L 15,400</h3>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Vistas Totales</p>
                                <h3 className="text-2xl font-bold">1.2k</h3>
                            </div>
                            <Eye className="h-8 w-8 text-purple-500 opacity-20" />
                        </CardContent>
                    </Card>
                </div>

                {/* Products Table/List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Inventario</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar producto..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Producto</th>
                                        <th className="px-4 py-3">Precio</th>
                                        <th className="px-4 py-3">Stock</th>
                                        <th className="px-4 py-3">Estado</th>
                                        <th className="px-4 py-3">Vistas</th>
                                        <th className="px-4 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative">
                                                        {/* Simple placeholder logic for demo */}
                                                        <div className="absolute inset-0 bg-gray-200" />
                                                    </div>
                                                    <span className="truncate max-w-[200px]" title={product.title}>
                                                        {product.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                L {product.price.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.stock}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                                                    {product.stock > 0 ? 'Activo' : 'Agotado'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.views || 0}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver publicación
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
