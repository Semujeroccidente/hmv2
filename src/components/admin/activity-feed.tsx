'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    User,
    Package,
    ShoppingCart,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'

interface Activity {
    id: string
    type: 'user' | 'product' | 'order' | 'report'
    action: string
    description: string
    timestamp: Date
    status?: 'success' | 'warning' | 'error'
}

const activityIcons = {
    user: User,
    product: Package,
    order: ShoppingCart,
    report: AlertTriangle
}

const statusIcons = {
    success: CheckCircle,
    warning: Clock,
    error: XCircle
}

const statusColors = {
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600'
}

interface ActivityFeedProps {
    activities: Activity[]
    limit?: number
}

export function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
    const displayedActivities = activities.slice(0, limit)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayedActivities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No hay actividad reciente</p>
                        </div>
                    ) : (
                        displayedActivities.map((activity) => {
                            const Icon = activityIcons[activity.type]
                            const StatusIcon = activity.status ? statusIcons[activity.status] : null

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.action}
                                            </p>
                                            {StatusIcon && (
                                                <StatusIcon className={`h-4 w-4 ${statusColors[activity.status!]}`} />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            {formatDistanceToNow(activity.timestamp, {
                                                addSuffix: true,
                                                locale: es
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
