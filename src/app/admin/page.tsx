'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserManagement } from '@/components/admin/user-management'
import { ProductManagement } from '@/components/admin/product-management'
import { AuctionManagement } from '@/components/admin/auction-management'
import { OrderManagement } from '@/components/admin/order-management'
import { CategoryManagement } from '@/components/admin/category-management'
import {
  Users,
  ShoppingBag,
  Gavel,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Shield,
  FileText,
  MessageSquare,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalOrders: 0
  })

  const [recentUsers, setRecentUsers] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [recentAuctions, setRecentAuctions] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load dashboard statistics
      const statsResponse = await fetch('/api/admin/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      } else {
        // Use mock data for now
        setStats({
          totalUsers: 1250,
          activeUsers: 890,
          totalProducts: 3420,
          activeProducts: 2890,
          totalAuctions: 156,
          activeAuctions: 89,
          totalRevenue: 2847500,
          monthlyRevenue: 425000,
          pendingOrders: 45,
          completedOrders: 892,
          totalOrders: 937
        })
      }

      // Load categories
      const categoriesResponse = await fetch('/api/categories?hierarchical=true')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      } else {
        setCategories([])
      }

      // Load recent users
      const usersResponse = await fetch('/api/admin/users?limit=10&sortBy=createdAt&sortOrder=desc')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setRecentUsers(usersData.users || [])
      } else {
        // Mock data
        setRecentUsers([
          {
            id: '1',
            name: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            role: 'USER',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            _count: {
              products: 5,
              orders: 12,
              auctions: 2,
              bids: 8
            }
          },
          {
            id: '2',
            name: 'María González',
            email: 'maria@email.com',
            role: 'USER',
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date().toISOString(),
            _count: {
              products: 3,
              orders: 8,
              auctions: 1,
              bids: 5
            }
          }
        ])
      }

      // Load recent products
      const productsResponse = await fetch('/api/admin/products?limit=10&sortBy=createdAt&sortOrder=desc')
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setRecentProducts(productsData.products || [])
      } else {
        // Mock data
        setRecentProducts([
          {
            id: '1',
            title: 'iPhone 13 Pro Max',
            price: 25000,
            status: 'ACTIVE',
            condition: 'USED',
            sellerName: 'Juan Pérez',
            sellerEmail: 'juan@email.com',
            categoryName: 'Electrónica',
            createdAt: new Date().toISOString(),
            views: 245,
            favoritesCount: 18,
            salesCount: 2
          }
        ])
      }

      // Load recent auctions
      const auctionsResponse = await fetch('/api/admin/auctions?limit=10&sortBy=createdAt&sortOrder=desc')
      if (auctionsResponse.ok) {
        const auctionsData = await auctionsResponse.json()
        setRecentAuctions(auctionsData.auctions || [])
      } else {
        // Mock data
        setRecentAuctions([
          {
            id: '1',
            title: 'MacBook Pro M1',
            currentPrice: 18500,
            status: 'ACTIVE',
            bidCount: 12,
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
      }

      // Load recent orders
      const ordersResponse = await fetch('/api/admin/orders?limit=10&sortBy=createdAt&sortOrder=desc')
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.orders || [])
      } else {
        // Mock data
        setRecentOrders([
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            total: 25000,
            status: 'PENDING',
            buyerName: 'Ana Martínez',
            createdAt: new Date().toISOString()
          }
        ])
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserUpdate = async (userId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Refresh users list
        const usersResponse = await fetch('/api/admin/users?limit=10&sortBy=createdAt&sortOrder=desc')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setRecentUsers(usersData.users || [])
        }
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleUserCreate = async (userData: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        // Refresh users list
        const usersResponse = await fetch('/api/admin/users?limit=10&sortBy=createdAt&sortOrder=desc')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setRecentUsers(usersData.users || [])
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  const handleProductUpdate = async (productId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Refresh products list
        const productsResponse = await fetch('/api/admin/products?limit=10&sortBy=createdAt&sortOrder=desc')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setRecentProducts(productsData.products || [])
        }
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleProductCreate = async (productData: any) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        // Refresh products list
        const productsResponse = await fetch('/api/admin/products?limit=10&sortBy=createdAt&sortOrder=desc')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setRecentProducts(productsData.products || [])
        }
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleAuctionUpdate = async (auctionId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/auctions/${auctionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Refresh auctions list
        const auctionsResponse = await fetch('/api/admin/auctions?limit=10&sortBy=createdAt&sortOrder=desc')
        if (auctionsResponse.ok) {
          const auctionsData = await auctionsResponse.json()
          setRecentAuctions(auctionsData.auctions || [])
        }
      }
    } catch (error) {
      console.error('Error updating auction:', error)
    }
  }

  const handleAuctionCreate = async (auctionData: any) => {
    try {
      const response = await fetch('/api/admin/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auctionData),
      })

      if (response.ok) {
        // Refresh auctions list
        const auctionsResponse = await fetch('/api/admin/auctions?limit=10&sortBy=createdAt&sortOrder=desc')
        if (auctionsResponse.ok) {
          const auctionsData = await auctionsResponse.json()
          setRecentAuctions(auctionsData.auctions || [])
        }
      }
    } catch (error) {
      console.error('Error creating auction:', error)
    }
  }

  const handleOrderUpdate = async (orderId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Refresh orders list
        const ordersResponse = await fetch('/api/admin/orders?limit=10&sortBy=createdAt&sortOrder=desc')
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setRecentOrders(ordersData.orders || [])
        }
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleOrderCreate = async (orderData: any) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        // Refresh orders list
        const ordersResponse = await fetch('/api/admin/orders?limit=10&sortBy=createdAt&sortOrder=desc')
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setRecentOrders(ordersData.orders || [])
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  const handleCategoryUpdate = async (categoryId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Refresh categories list
        const categoriesResponse = await fetch('/api/categories?hierarchical=true')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleCategoryCreate = async (categoryData: any) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        // Refresh categories list
        const categoriesResponse = await fetch('/api/categories?hierarchical=true')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh categories list
        const categoriesResponse = await fetch('/api/categories?hierarchical=true')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      BANNED: 'bg-red-100 text-red-800',
      SOLD: 'bg-blue-100 text-blue-800',
      EXPIRED: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">HonduMarket Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/">
                  <ArrowDownRight className="h-4 w-4 mr-2 rotate-90" />
                  Volver a la tienda
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      {stats.activeUsers} activos
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      {stats.activeProducts} activos
                    </span>
                  </div>
                </div>
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subastas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAuctions}</p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">
                      {stats.activeAuctions} activas
                    </span>
                  </div>
                </div>
                <Gavel className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      {formatCurrency(stats.monthlyRevenue)} este mes
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Completados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="auctions">Subastas</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Usuarios Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(user.status)}
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Pedidos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.buyerName}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManagement
              categories={categories}
              onCategoryUpdate={handleCategoryUpdate}
              onCategoryCreate={handleCategoryCreate}
              onCategoryDelete={handleCategoryDelete}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement
              users={recentUsers}
              onUserUpdate={handleUserUpdate}
              onUserCreate={handleUserCreate}
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement
              products={recentProducts}
              categories={categories}
              onProductUpdate={handleProductUpdate}
              onProductCreate={handleProductCreate}
            />
          </TabsContent>

          <TabsContent value="auctions" className="space-y-6">
            <AuctionManagement
              auctions={recentAuctions}
              onAuctionUpdate={handleAuctionUpdate}
              onAuctionCreate={handleAuctionCreate}
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement
              orders={recentOrders}
              onOrderUpdate={handleOrderUpdate}
              onOrderCreate={handleOrderCreate}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Estadísticas de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Gráfico de ventas</p>
                      <p className="text-sm">(Integración con chart.js próximamente)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Distribución de Categorías
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-12 w-12 mx-auto mb-4" />
                      <p>Gráfico de categorías</p>
                      <p className="text-sm">(Integración con chart.js próximamente)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Crecimiento Mensual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Usuarios nuevos</span>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600">+12.5%</span>
                        <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Productos publicados</span>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600">+8.3%</span>
                        <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ingresos</span>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600">+15.7%</span>
                        <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Subastas completadas</span>
                      <div className="flex items-center">
                        <span className="text-sm text-red-600">-2.1%</span>
                        <TrendingDown className="h-4 w-4 text-red-600 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Actividad del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tiempo de respuesta</span>
                      <span className="text-sm text-gray-600">245ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tasa de error</span>
                      <span className="text-sm text-green-600">0.12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Uso de CPU</span>
                      <span className="text-sm text-gray-600">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memoria disponible</span>
                      <span className="text-sm text-gray-600">2.3GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}