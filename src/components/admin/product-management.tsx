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
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  CheckCircle,
  MoreHorizontal,
  Package,
  DollarSign,
  Eye as EyeIcon,
  Calendar,
  User,
  Tag,
  Image,
  AlertTriangle
} from 'lucide-react'

interface Product {
  id: string
  title: string
  price: number
  status: string
  condition: string
  sellerName: string
  sellerEmail: string
  categoryName: string
  createdAt: string
  views: number
  favoritesCount: number
  salesCount: number
}

interface ProductManagementProps {
  products: Product[]
  categories: Array<{ id: string; name: string }>
  onProductUpdate: (productId: string, updates: Partial<Product>) => void
  onProductCreate: (productData: Omit<Product, 'id' | 'createdAt' | 'views' | 'favoritesCount' | 'salesCount'>) => void
}

export function ProductManagement({ 
  products, 
  categories, 
  onProductUpdate, 
  onProductCreate 
}: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'NEW',
    categoryId: '',
    sellerId: '',
    sellerName: '',
    sellerEmail: '',
    categoryName: '',
    status: 'ACTIVE'
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || product.status === statusFilter
    const matchesCondition = !conditionFilter || product.condition === conditionFilter
    const matchesCategory = !categoryFilter || product.categoryName === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCondition && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SOLD: 'bg-blue-100 text-blue-800',
      BANNED: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const getConditionBadge = (condition: string) => {
    const variants = {
      NEW: 'bg-green-100 text-green-800',
      USED: 'bg-yellow-100 text-yellow-800',
      REFURBISHED: 'bg-blue-100 text-blue-800'
    }
    
    return (
      <Badge className={variants[condition] || 'bg-gray-100 text-gray-800'}>
        {condition}
      </Badge>
    )
  }

  const handleCreateProduct = () => {
    const category = categories.find(c => c.id === newProduct.categoryId)
    onProductCreate({
      ...newProduct,
      price: parseFloat(newProduct.price),
      categoryName: category?.name || ''
    })
    setNewProduct({
      title: '',
      description: '',
      price: '',
      condition: 'NEW',
      categoryId: '',
      sellerId: '',
      sellerName: '',
      sellerEmail: '',
      categoryName: '',
      status: 'ACTIVE'
    })
    setIsCreateModalOpen(false)
  }

  const handleUpdateProductStatus = (productId: string, status: string) => {
    onProductUpdate(productId, { status })
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

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los estados</SelectItem>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
              <SelectItem value="SOLD">Vendido</SelectItem>
              <SelectItem value="BANNED">Bloqueado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Condición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las condiciones</SelectItem>
              <SelectItem value="NEW">Nuevo</SelectItem>
              <SelectItem value="USED">Usado</SelectItem>
              <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Producto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título del Producto</Label>
                    <Input
                      id="title"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      placeholder="Ej: iPhone 13 Pro Max"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio (HNL)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="25000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Describe el producto en detalle..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="condition">Condición</Label>
                    <Select value={newProduct.condition} onValueChange={(condition) => setNewProduct({ ...newProduct, condition })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">Nuevo</SelectItem>
                        <SelectItem value="USED">Usado</SelectItem>
                        <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Categoría</Label>
                    <Select value={newProduct.categoryId} onValueChange={(categoryId) => setNewProduct({ ...newProduct, categoryId })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select value={newProduct.status} onValueChange={(status) => setNewProduct({ ...newProduct, status })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Activo</SelectItem>
                        <SelectItem value="INACTIVE">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sellerName">Nombre del Vendedor</Label>
                    <Input
                      id="sellerName"
                      value={newProduct.sellerName}
                      onChange={(e) => setNewProduct({ ...newProduct, sellerName: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerEmail">Email del Vendedor</Label>
                    <Input
                      id="sellerEmail"
                      type="email"
                      value={newProduct.sellerEmail}
                      onChange={(e) => setNewProduct({ ...newProduct, sellerEmail: e.target.value })}
                      placeholder="juan@email.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProduct}>
                    Crear Producto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Productos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Condición</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Estadísticas</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.categoryName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <User className="h-3 w-3 mr-1 text-gray-400" />
                        {product.sellerName}
                      </div>
                      <div className="text-xs text-gray-500">{product.sellerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(product.price)}
                    </div>
                  </TableCell>
                  <TableCell>{getConditionBadge(product.condition)}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <EyeIcon className="h-3 w-3 mr-1 text-gray-400" />
                        {product.views} vistas
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1 text-gray-400" />
                        {product.favoritesCount} favoritos
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                        {product.salesCount} ventas
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        {formatDate(product.createdAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {product.status === 'ACTIVE' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateProductStatus(product.id, 'BANNED')}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateProductStatus(product.id, 'ACTIVE')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
                  <p className="text-gray-500">{selectedProduct.categoryName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getConditionBadge(selectedProduct.condition)}
                    {getStatusBadge(selectedProduct.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Información del Producto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precio:</span>
                      <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Condición:</span>
                      <span className="font-medium">{selectedProduct.condition}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estado:</span>
                      <span className="font-medium">{selectedProduct.status}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vistas:</span>
                      <span className="font-medium">{selectedProduct.views}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Favoritos:</span>
                      <span className="font-medium">{selectedProduct.favoritesCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ventas:</span>
                      <span className="font-medium">{selectedProduct.salesCount}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Vendedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nombre:</span>
                    <span className="font-medium">{selectedProduct.sellerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Email:</span>
                    <span className="font-medium">{selectedProduct.sellerEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Fechas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fecha de creación:</span>
                    <span className="font-medium">{formatDate(selectedProduct.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Cerrar
                </Button>
                {selectedProduct.status === 'ACTIVE' ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleUpdateProductStatus(selectedProduct.id, 'BANNED')
                      setIsViewModalOpen(false)
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Bloquear Producto
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleUpdateProductStatus(selectedProduct.id, 'ACTIVE')
                      setIsViewModalOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activar Producto
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}