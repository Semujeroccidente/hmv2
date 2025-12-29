'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Package, ShoppingCart } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Métricas avanzadas y análisis de datos
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Crecimiento de Usuarios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Gráfico de crecimiento</p>
                            <p className="text-xs mt-2">Próximamente</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-green-600" />
                            Productos Más Vendidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Top 10 productos</p>
                            <p className="text-xs mt-2">Próximamente</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-purple-600" />
                            Conversión de Ventas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Tasa de conversión</p>
                            <p className="text-xs mt-2">Próximamente</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                        Análisis Detallado
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-500">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Analytics Avanzados</p>
                        <p className="text-sm mt-2">Esta sección estará disponible próximamente</p>
                        <p className="text-xs text-gray-400 mt-4">
                            Incluirá: reportes personalizados, exportación de datos, comparación de períodos, y más
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
