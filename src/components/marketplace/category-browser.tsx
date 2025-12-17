'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProductCard, Product } from '@/components/marketplace/product-card'
import { ProductGridSkeleton } from '@/components/marketplace/skeletons'
import { Filter, ChevronRight, X, ArrowUpDown } from 'lucide-react'

// Reuse interfaces if possible, or define them here if unique to this view
interface Category {
    id: string
    name: string
    icon?: string
    subcategories?: Category[]
}

interface CategoryBrowserProps {
    initialProducts: Product[]
    category: Category
    categories: Category[]
    slugs: string[]
}

export function CategoryBrowser({
    initialProducts,
    category,
    categories,
    slugs
}: CategoryBrowserProps) {
    const [priceRange, setPriceRange] = useState([0, 50000])
    const [selectedConditions, setSelectedConditions] = useState<string[]>([])
    const [sortBy, setSortBy] = useState("newest")
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const conditions = [
        { id: 'NEW', label: 'Nuevo' },
        { id: 'USED', label: 'Usado' },
        { id: 'REFURBISHED', label: 'Reacondicionado' }
    ]

    // Client-side filtering logic
    const filteredProducts = initialProducts.filter(product => {
        const matchesPrice = product.price !== undefined && product.price >= priceRange[0] && product.price <= priceRange[1];

        let matchesCondition = true
        if (selectedConditions.length > 0) {
            // Map UI condition labels to data values if necessary, or ensure consistency
            // Data uses: 'NEW', 'USED', etc.
            matchesCondition = selectedConditions.includes(product.condition)
        }

        return matchesPrice && matchesCondition
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price
            case 'price-desc':
                return b.price - a.price
            case 'newest':
            default:
                // Assuming createdAt exists and is a string date
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        }
    })

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            style: 'currency',
            currency: 'HNL',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const toggleCondition = (conditionId: string) => {
        setSelectedConditions(prev =>
            prev.includes(conditionId)
                ? prev.filter(c => c !== conditionId)
                : [...prev, conditionId]
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-6 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="font-semibold text-gray-900">{category.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
                        {/* Categorías */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100/50 backdrop-blur-sm">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="h-4 w-4 text-blue-600" /> Categorías
                            </h3>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/categoria/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${cat.id === category.id
                                            ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </div>
                                        {cat.id === category.id && <ChevronRight className="h-4 w-4" />}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Filtros */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100/50">
                            <h3 className="font-semibold text-gray-900 mb-6">Filtros</h3>

                            <div className="space-y-6">
                                {/* Precio */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">Rango de Precio</h4>
                                    <Slider
                                        defaultValue={[0, 50000]}
                                        max={50000}
                                        step={500}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="py-4"
                                    />
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 mt-2">
                                        <div className="px-3 py-1 bg-gray-100 rounded-md tabular-nums">{formatPrice(priceRange[0])}</div>
                                        <div className="text-gray-400">-</div>
                                        <div className="px-3 py-1 bg-gray-100 rounded-md tabular-nums">{formatPrice(priceRange[1])}</div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Estado */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">Condición</h4>
                                    <div className="space-y-3">
                                        {conditions.map((cond) => (
                                            <div key={cond.id} className="flex items-center gap-3">
                                                <Checkbox
                                                    id={cond.id}
                                                    checked={selectedConditions.includes(cond.id)}
                                                    onCheckedChange={() => toggleCondition(cond.id)}
                                                />
                                                <label
                                                    htmlFor={cond.id}
                                                    className="text-sm text-gray-600 cursor-pointer select-none hover:text-gray-900 transition-colors"
                                                >
                                                    {cond.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header Area */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-lg mb-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Filter className="w-64 h-64" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2 relative z-10">{category.name}</h1>
                            <p className="text-blue-100 relative z-10">Encuentra los mejores productos y ofertas exclusivas.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sticky top-20 z-40 bg-gray-50/95 backdrop-blur py-2">
                            <p className="text-gray-600 font-medium">
                                <span className="text-gray-900 font-bold">{filteredProducts.length}</span> resultados
                            </p>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px] bg-white">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpDown className="h-4 w-4 text-gray-500" />
                                            <SelectValue placeholder="Ordenar por" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Más recientes</SelectItem>
                                        <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                                        <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden bg-white">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filtros
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-full sm:w-[400px]">
                                        <div className="py-6 space-y-8 h-full overflow-y-auto">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-xl">Filtros</h3>
                                            </div>

                                            {/* Mobile Filters Content - Same as Sidebar */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-semibold mb-4">Rango de Precio</h4>
                                                    <Slider
                                                        defaultValue={[0, 50000]}
                                                        max={50000}
                                                        step={500}
                                                        value={priceRange}
                                                        onValueChange={setPriceRange}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>{formatPrice(priceRange[0])}</span>
                                                        <span>{formatPrice(priceRange[1])}</span>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h4 className="font-semibold mb-4">Condición</h4>
                                                    <div className="space-y-4">
                                                        {conditions.map((cond) => (
                                                            <div key={cond.id} className="flex items-center gap-3">
                                                                <Checkbox
                                                                    id={`mobile-${cond.id}`}
                                                                    checked={selectedConditions.includes(cond.id)}
                                                                    onCheckedChange={() => toggleCondition(cond.id)}
                                                                />
                                                                <label htmlFor={`mobile-${cond.id}`} className="text-sm font-medium">
                                                                    {cond.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                                                Ver {filteredProducts.length} resultados
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        {/* Active filters display */}
                        {(priceRange[0] > 0 || priceRange[1] < 50000 || selectedConditions.length > 0) && (
                            <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-top-2">
                                {priceRange[0] > 0 && (
                                    <Badge variant="secondary" className="gap-1 pl-1 pr-2 bg-white border border-gray-200 shadow-sm text-gray-700">
                                        Min: {formatPrice(priceRange[0])}
                                    </Badge>
                                )}
                                {priceRange[1] < 50000 && (
                                    <Badge variant="secondary" className="gap-1 pl-1 pr-2 bg-white border border-gray-200 shadow-sm text-gray-700">
                                        Max: {formatPrice(priceRange[1])}
                                    </Badge>
                                )}
                                {selectedConditions.map(c => (
                                    <Badge key={c} variant="secondary" className="gap-1 pl-1 pr-2 bg-white border border-gray-200 shadow-sm text-gray-700">
                                        {conditions.find(cond => cond.id === c)?.label}
                                        <X
                                            className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                                            onClick={() => toggleCondition(c)}
                                        />
                                    </Badge>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        setPriceRange([0, 50000])
                                        setSelectedConditions([])
                                    }}
                                >
                                    Limpiar todo
                                </Button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center py-20">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Filter className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    No hay productos que coincidan con los filtros seleccionados. Intenta ampliar tu búsqueda.
                                </p>
                                <Button onClick={() => {
                                    setPriceRange([0, 50000])
                                    setSelectedConditions([])
                                }}>
                                    Limpiar todos los filtros
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
