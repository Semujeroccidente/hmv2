import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
      db.user.count(),
      // Active users (logged in within last 30 days)
      db.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      // Total products
      db.product.count(),
      // Active products
      db.product.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      // Total auctions
      db.auction.count(),
      // Active auctions
      db.auction.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      // Total orders
      db.order.count(),
      // Completed orders
      db.order.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      // Pending orders
      db.order.count({
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