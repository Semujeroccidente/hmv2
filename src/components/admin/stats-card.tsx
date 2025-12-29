'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: string | number
    change?: number
    icon: LucideIcon
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
    description?: string
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-600 dark:text-blue-400'
    },
    green: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-600 dark:text-green-400'
    },
    purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        text: 'text-purple-600 dark:text-purple-400'
    },
    orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        text: 'text-orange-600 dark:text-orange-400'
    },
    red: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-600 dark:text-red-400'
    }
}

export function StatsCard({
    title,
    value,
    change,
    icon: Icon,
    color = 'blue',
    description
}: StatsCardProps) {
    const colors = colorClasses[color]

    const getTrendIcon = () => {
        if (change === undefined || change === 0) return Minus
        return change > 0 ? ArrowUp : ArrowDown
    }

    const getTrendColor = () => {
        if (change === undefined || change === 0) return 'text-gray-500'
        return change > 0 ? 'text-green-600' : 'text-red-600'
    }

    const TrendIcon = getTrendIcon()

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {title}
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {value}
                            </h3>
                            {change !== undefined && (
                                <span className={cn('flex items-center text-sm font-medium', getTrendColor())}>
                                    <TrendIcon className="h-4 w-4 mr-1" />
                                    {Math.abs(change)}%
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className={cn('p-3 rounded-lg', colors.bg)}>
                        <Icon className={cn('h-6 w-6', colors.icon)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
