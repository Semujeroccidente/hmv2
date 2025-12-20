import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get basic statistics
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalAuctions,
      activeAuctions,
      totalOrders,
      completedOrders,
      pendingOrders
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      // Active users (logged in within last 30 days)
      prisma.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Total products
      prisma.product.count(),
      // Active products
      prisma.product.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      // Total auctions
      prisma.auction.count(),
      // Active auctions
      prisma.auction.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      // Total orders
      prisma.order.count(),
      // Completed orders
      prisma.order.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      // Pending orders
      prisma.order.count({
        where: {
          status: 'PENDING'
        }
      })
    ])

    // Calculate revenue (mock data for now)
    const monthlyRevenue = 425000 // Mock data
    const totalRevenue = 2847500 // Mock data

    const stats = {
      totalUsers,
      activeUsers,
      totalProducts,
      activeProducts,
      totalAuctions,
      activeAuctions,
      totalOrders,
      completedOrders,
      pendingOrders,
      monthlyRevenue,
      totalRevenue
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Error fetching dashboard statistics' },
      { status: 500 }
    )
  }
}