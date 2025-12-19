'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileText,
  DollarSign,
  User,
  Calendar,
  Package,
  MapPin,
  Download,
  Truck,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  total: number
}

interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  buyerName: string
  buyerEmail: string
  itemCount: number
  items: OrderItem[]
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

interface OrderManagementProps {
  orders: Order[]
  onOrderUpdate: (orderId: string, updates: Partial<Order>) => void
  onOrderCreate: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void
}

export function OrderManagement({
  orders,
  onOrderUpdate,
  onOrderCreate
}: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800'
    }

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'PROCESSING':
        return <Package className="h-4 w-4 text-purple-600" />
      case 'SHIPPED':
        return <Truck className="h-4 w-4 text-indigo-600" />
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'REFUNDED':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    onOrderUpdate(orderId, { status })
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

  const getNextStatusOptions = (currentStatus: string) => {
    const statusFlow = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: ['REFUNDED'],
      REFUNDED: []
    }
    return statusFlow[currentStatus] || []
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <Select value={statusFilter || 'ALL'} onValueChange={(value) => setStatusFilter(value === 'ALL' ? '' : value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="PROCESSING">Procesando</SelectItem>
              <SelectItem value="SHIPPED">Enviado</SelectItem>
              <SelectItem value="DELIVERED">Entregado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
              <SelectItem value="REFUNDED">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">ID: {order.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <User className="h-3 w-3 mr-1 text-gray-400" />
                        {order.buyerName}
                      </div>
                      <div className="text-xs text-gray-500">{order.buyerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{order.itemCount}</span>
                      <span className="text-sm text-gray-500">items</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Subtotal: {formatCurrency(order.subtotal)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Select
                        value={order.status}
                        onValueChange={(status) => handleUpdateOrderStatus(order.id, status)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getNextStatusOptions(order.status).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedOrder.orderNumber}</h3>
                    <p className="text-gray-500">ID: {selectedOrder.id}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedOrder.total)}
                  </div>
                  <div className="text-sm text-gray-500">Total del pedido</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Nombre:</span>
                      <span className="font-medium">{selectedOrder.buyerName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Email:</span>
                      <span className="font-medium">{selectedOrder.buyerEmail}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Dirección de Envío</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedOrder.shippingAddress ? (
                      <div className="text-sm">
                        <div className="font-medium">{selectedOrder.shippingAddress.street}</div>
                        <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</div>
                        <div>{selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No hay dirección de envío</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Productos del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-gray-500">Cantidad: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.total)}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(item.price)} c/u</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Costo de envío:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuestos:</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Fechas Importantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fecha de creación:</span>
                    <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Última actualización:</span>
                    <span className="font-medium">{formatDate(selectedOrder.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Cerrar
                </Button>

                <Select
                  value={selectedOrder.status}
                  onValueChange={(status) => {
                    handleUpdateOrderStatus(selectedOrder.id, status)
                    setIsViewModalOpen(false)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Actualizar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNextStatusOptions(selectedOrder.status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}