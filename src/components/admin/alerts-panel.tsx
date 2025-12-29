'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    AlertTriangle,
    Package,
    ShoppingCart,
    Users,
    Gavel,
    ArrowRight
} from 'lucide-react'

interface Alert {
    id: string
    type: 'report' | 'product' | 'order' | 'user' | 'auction'
    title: string
    description: string
    count?: number
    href: string
    severity: 'high' | 'medium' | 'low'
}

const alertIcons = {
    report: AlertTriangle,
    product: Package,
    order: ShoppingCart,
    user: Users,
    auction: Gavel
}

const severityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

interface AlertsPanelProps {
    alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Alertas y Pendientes</CardTitle>
                    <Badge variant="destructive">{alerts.length}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alerts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No hay alertas pendientes</p>
                            <p className="text-sm">¡Todo está bajo control!</p>
                        </div>
                    ) : (
                        alerts.map((alert) => {
                            const Icon = alertIcons[alert.type]

                            return (
                                <Link
                                    key={alert.id}
                                    href={alert.href}
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors hover:shadow-md ${severityColors[alert.severity]}`}
                                >
                                    <div className="p-2 bg-white/50 rounded-lg">
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">
                                                {alert.title}
                                            </p>
                                            {alert.count && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {alert.count}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs opacity-90 mt-1">
                                            {alert.description}
                                        </p>
                                    </div>

                                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                                </Link>
                            )
                        })
                    )}
                </div>

                {alerts.length > 0 && (
                    <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href="/admin/reportes">
                            Ver todas las alertas
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
