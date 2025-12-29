'use client'

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/admin/stats-card'
import { SalesChart } from '@/components/admin/sales-chart'
import { ActivityFeed } from '@/components/admin/activity-feed'
import { AlertsPanel } from '@/components/admin/alerts-panel'
import { Users, Package, ShoppingCart, DollarSign, Gavel, AlertTriangle } from 'lucide-react'


async function fetchDashboardData() {
  try {
    const response = await fetch('/api/admin/dashboard', {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return null
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData().then(result => {
      setData(result)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Datos de fallback si falla
  const stats = data?.stats || {
    totalUsers: 0,
    activeProducts: 0,
    todayOrders: 0,
    monthRevenue: 0,
    pendingReports: 0,
    activeAuctions: 0
  }

  const chartData = data?.chartData || []
  const activities = data?.activities || []
  const alerts = data?.alerts || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bienvenido al panel de administración de HonduMarket
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Usuarios Totales"
          value={stats.totalUsers.toLocaleString()}
          change={12}
          icon={Users}
          color="blue"
          description="vs. mes anterior"
        />
        <StatsCard
          title="Productos Activos"
          value={stats.activeProducts.toLocaleString()}
          change={8}
          icon={Package}
          color="green"
          description="publicados y activos"
        />
        <StatsCard
          title="Órdenes Hoy"
          value={stats.todayOrders.toLocaleString()}
          change={23}
          icon={ShoppingCart}
          color="purple"
          description="órdenes del día"
        />
        <StatsCard
          title="Ingresos del Mes"
          value={`L. ${stats.monthRevenue.toLocaleString()}`}
          change={15}
          icon={DollarSign}
          color="orange"
          description="ingresos totales"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Subastas Activas"
          value={stats.activeAuctions.toLocaleString()}
          icon={Gavel}
          color="purple"
          description="subastas en curso"
        />
        <StatsCard
          title="Reportes Pendientes"
          value={stats.pendingReports.toLocaleString()}
          icon={AlertTriangle}
          color="red"
          description="requieren atención"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={chartData} />
        </div>
      </div>

      {/* Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={activities} />
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  )
}