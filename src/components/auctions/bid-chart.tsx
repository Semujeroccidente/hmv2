'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface Bid {
    id: string
    amount: number
    createdAt: string
    user: {
        name: string
    }
}

interface BidChartProps {
    bids: Bid[]
}

export function BidChart({ bids }: BidChartProps) {
    // Preparar datos para el gráfico
    const chartData = bids
        .map((bid, index) => ({
            index: bids.length - index,
            amount: bid.amount,
            time: new Date(bid.createdAt).toLocaleTimeString('es-HN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            fullTime: new Date(bid.createdAt).toLocaleString('es-HN'),
            user: bid.user.name
        }))
        .reverse()

    if (bids.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        Evolución de Pujas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No hay datos suficientes para mostrar el gráfico</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const minAmount = Math.min(...chartData.map(d => d.amount))
    const maxAmount = Math.max(...chartData.map(d => d.amount))
    const padding = (maxAmount - minAmount) * 0.1

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Evolución de Pujas
                    <span className="text-sm font-normal text-gray-500 ml-auto">
                        {bids.length} {bids.length === 1 ? 'puja' : 'pujas'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="time"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                            domain={[minAmount - padding, maxAmount + padding]}
                            tickFormatter={(value) => `L.${value.toLocaleString()}`}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                            <p className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                                                L. {data.amount.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                <strong>{data.user}</strong>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {data.fullTime}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                Puja #{data.index}
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#9333ea"
                            strokeWidth={3}
                            fill="url(#colorAmount)"
                            dot={{ fill: '#9333ea', r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Puja Inicial</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            L. {minAmount.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Puja Actual</p>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                            L. {maxAmount.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Incremento</p>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            +L. {(maxAmount - minAmount).toLocaleString()}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
