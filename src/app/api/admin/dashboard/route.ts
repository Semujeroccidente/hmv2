import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-middleware'

export async function GET(request: NextRequest) {
    try {
        // Verificar que es admin
        await requireAdmin(request)

        // Obtener estadísticas generales
        const [
            totalUsers,
            activeProducts,
            todayOrders,
            pendingReports,
            activeAuctions
        ] = await Promise.all([
            prisma.user.count(),
            prisma.product.count({ where: { status: 'ACTIVE' } }),
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            prisma.report.count({ where: { status: 'PENDING' } }),
            prisma.auction.count({ where: { status: 'ACTIVE' } })
        ])

        // Calcular ingresos del mes
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const monthOrders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startOfMonth },
                status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] }
            },
            select: { total: true }
        })
        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0)

        // Datos para gráfico de ventas (últimos 30 días)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Datos de ejemplo para el gráfico (últimos 7 días)
        const chartData = [
            { date: 'Lun', sales: 5000, orders: 45 },
            { date: 'Mar', sales: 7200, orders: 52 },
            { date: 'Mié', sales: 6800, orders: 48 },
            { date: 'Jue', sales: 8500, orders: 61 },
            { date: 'Vie', sales: 9200, orders: 68 },
            { date: 'Sáb', sales: 11000, orders: 82 },
            { date: 'Dom', sales: 8900, orders: 71 }
        ]

        // Actividad reciente
        const recentActivity = await Promise.all([
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, createdAt: true }
            }),
            prisma.product.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, createdAt: true }
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, status: true, createdAt: true }
            })
        ])

        const activities = [
            ...recentActivity[0].map(user => ({
                id: `user-${user.id}`,
                type: 'user' as const,
                action: 'Nuevo usuario registrado',
                description: user.name,
                timestamp: user.createdAt,
                status: 'success' as const
            })),
            ...recentActivity[1].map(product => ({
                id: `product-${product.id}`,
                type: 'product' as const,
                action: 'Producto publicado',
                description: product.title,
                timestamp: product.createdAt,
                status: 'success' as const
            })),
            ...recentActivity[2].map(order => ({
                id: `order-${order.id}`,
                type: 'order' as const,
                action: 'Nueva orden',
                description: `Estado: ${order.status}`,
                timestamp: order.createdAt,
                status: order.status === 'DELIVERED' ? 'success' as const : 'warning' as const
            }))
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

        // Alertas
        const alerts = []

        if (pendingReports > 0) {
            alerts.push({
                id: 'reports',
                type: 'report',
                title: 'Reportes pendientes',
                description: `${pendingReports} reportes esperando revisión`,
                count: pendingReports,
                href: '/admin/reportes',
                severity: 'high'
            })
        }

        const pendingProducts = await prisma.product.count({
            where: { status: 'INACTIVE' }
        })
        if (pendingProducts > 0) {
            alerts.push({
                id: 'products',
                type: 'product',
                title: 'Productos sin aprobar',
                description: `${pendingProducts} productos esperando aprobación`,
                count: pendingProducts,
                href: '/admin/productos',
                severity: 'medium'
            })
        }

        const problemOrders = await prisma.order.count({
            where: { status: 'CANCELLED' }
        })
        if (problemOrders > 0) {
            alerts.push({
                id: 'orders',
                type: 'order',
                title: 'Órdenes canceladas',
                description: `${problemOrders} órdenes requieren atención`,
                count: problemOrders,
                href: '/admin/ordenes',
                severity: 'low'
            })
        }

        return NextResponse.json({
            stats: {
                totalUsers,
                activeProducts,
                todayOrders,
                monthRevenue,
                pendingReports,
                activeAuctions
            },
            chartData,
            activities,
            alerts
        })

    } catch (error) {
        console.error('Error in dashboard API:', error)
        return NextResponse.json(
            { error: 'Error obteniendo datos del dashboard' },
            { status: 500 }
        )
    }
}
