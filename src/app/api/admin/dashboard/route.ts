import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, handleAdminError } from '@/lib/admin-middleware'

// GET - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
    try {
        // Verificar que el usuario es admin
        await requireAdmin(request)

        // Obtener parámetros de fecha (opcional)
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || '30' // días por defecto

        const daysAgo = parseInt(period)
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - daysAgo)

        // Estadísticas de usuarios
        const totalUsers = await prisma.user.count()
        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: startDate
                }
            }
        })

        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: true
        })

        // Estadísticas de productos
        const totalProducts = await prisma.product.count()
        const activeProducts = await prisma.product.count({
            where: {
                stock: {
                    gt: 0
                }
            }
        })

        const productsByCategory = await prisma.product.groupBy({
            by: ['categoryId'],
            _count: true,
            orderBy: {
                _count: {
                    categoryId: 'desc'
                }
            },
            take: 5
        })

        // Obtener nombres de categorías
        const categoryIds = productsByCategory.map(p => p.categoryId)
        const categories = await prisma.category.findMany({
            where: {
                id: {
                    in: categoryIds
                }
            },
            select: {
                id: true,
                name: true
            }
        })

        const productsByCategoryWithNames = productsByCategory.map(item => ({
            category: categories.find(c => c.id === item.categoryId)?.name || 'Sin categoría',
            count: item._count
        }))

        // Estadísticas de órdenes
        const totalOrders = await prisma.order.count()
        const recentOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: startDate
                }
            }
        })

        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: true
        })

        const ordersStats = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            _avg: {
                total: true
            }
        })

        const recentOrdersRevenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: startDate
                },
                status: {
                    in: ['COMPLETED', 'DELIVERED']
                }
            },
            _sum: {
                total: true
            }
        })

        // Estadísticas de subastas
        const totalAuctions = await prisma.auction.count()
        const activeAuctions = await prisma.auction.count({
            where: {
                status: 'ACTIVE',
                endDate: {
                    gte: new Date()
                }
            }
        })

        // Estadísticas de mensajes
        const totalMessages = await prisma.message.count()
        const unreadMessages = await prisma.message.count({
            where: {
                read: false
            }
        })

        // Productos más vendidos (últimos 30 días)
        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true
            },
            _count: true,
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        })

        const topProductIds = topProducts.map(p => p.productId)
        const topProductsDetails = await prisma.product.findMany({
            where: {
                id: {
                    in: topProductIds
                }
            },
            select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true
            }
        })

        const topProductsWithDetails = topProducts.map(item => ({
            product: topProductsDetails.find(p => p.id === item.productId),
            totalSold: item._sum.quantity,
            orderCount: item._count
        }))

        // Ventas por día (últimos 30 días)
        const salesByDay = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM "Order"
      WHERE createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `

        return NextResponse.json({
            users: {
                total: totalUsers,
                new: newUsers,
                byRole: usersByRole
            },
            products: {
                total: totalProducts,
                active: activeProducts,
                byCategory: productsByCategoryWithNames
            },
            orders: {
                total: totalOrders,
                recent: recentOrders,
                byStatus: ordersByStatus,
                totalRevenue: ordersStats._sum.total || 0,
                averageOrderValue: ordersStats._avg.total || 0,
                recentRevenue: recentOrdersRevenue._sum.total || 0
            },
            auctions: {
                total: totalAuctions,
                active: activeAuctions
            },
            messages: {
                total: totalMessages,
                unread: unreadMessages
            },
            topProducts: topProductsWithDetails,
            salesByDay
        })

    } catch (error) {
        return handleAdminError(error)
    }
}
