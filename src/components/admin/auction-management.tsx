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
  Gavel,
  DollarSign,
  Clock,
  User,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Hammer
} from 'lucide-react'

interface Auction {
  id: string
  title: string
  description: string
  startingPrice: number
  currentPrice: number
  reservePrice: number
  status: string
  endDate: string
  sellerName: string
  sellerEmail: string
  productName: string
  productCondition: string
  bidCount: number
  createdAt: string
}

interface AuctionManagementProps {
  auctions: Auction[]
  onAuctionUpdate: (auctionId: string, updates: Partial<Auction>) => void
  onAuctionCreate: (auctionData: Omit<Auction, 'id' | 'bidCount' | 'createdAt'>) => void
}

export function AuctionManagement({ 
  auctions, 
  onAuctionUpdate, 
  onAuctionCreate 
}: AuctionManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    endDate: '',
    productId: '',
    sellerId: '',
    sellerName: '',
    sellerEmail: '',
    productName: '',
    productCondition: 'NEW',
    status: 'ACTIVE'
  })

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || auction.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'bg-green-100 text-green-800',
      ENDED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      SOLD: 'bg-blue-100 text-blue-800',
      EXPIRED: 'bg-yellow-100 text-yellow-800'
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

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Finalizada'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleCreateAuction = () => {
    onAuctionCreate({
      ...newAuction,
      startingPrice: parseFloat(newAuction.startingPrice),
      reservePrice: parseFloat(newAuction.reservePrice)
    })
    setNewAuction({
      title: '',
      description: '',
      startingPrice: '',
      reservePrice: '',
      endDate: '',
      productId: '',
      sellerId: '',
      sellerName: '',
      sellerEmail: '',
      productName: '',
      productCondition: 'NEW',
      status: 'ACTIVE'
    })
    setIsCreateModalOpen(false)
  }

  const handleUpdateAuctionStatus = (auctionId: string, status: string) => {
    onAuctionUpdate(auctionId, { status })
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
              placeholder="Buscar subastas..."
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
              <SelectItem value="ACTIVE">Activa</SelectItem>
              <SelectItem value="ENDED">Finalizada</SelectItem>
              <SelectItem value="SOLD">Vendida</SelectItem>
              <SelectItem value="CANCELLED">Cancelada</SelectItem>
              <SelectItem value="EXPIRED">Expirada</SelectItem>
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
                Nueva Subasta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Subasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título de la Subasta</Label>
                    <Input
                      id="title"
                      value={newAuction.title}
                      onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                      placeholder="Ej: MacBook Pro M1 2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productName">Nombre del Producto</Label>
                    <Input
                      id="productName"
                      value={newAuction.productName}
                      onChange={(e) => setNewAuction({ ...newAuction, productName: e.target.value })}
                      placeholder="MacBook Pro M1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newAuction.description}
                    onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                    placeholder="Describe el producto y la subasta en detalle..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startingPrice">Precio Inicial (HNL)</Label>
                    <Input
                      id="startingPrice"
                      type="number"
                      value={newAuction.startingPrice}
                      onChange={(e) => setNewAuction({ ...newAuction, startingPrice: e.target.value })}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reservePrice">Precio de Reserva (HNL)</Label>
                    <Input
                      id="reservePrice"
                      type="number"
                      value={newAuction.reservePrice}
                      onChange={(e) => setNewAuction({ ...newAuction, reservePrice: e.target.value })}
                      placeholder="20000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="endDate">Fecha de Finalización</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newAuction.endDate}
                      onChange={(e) => setNewAuction({ ...newAuction, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCondition">Condición del Producto</Label>
                    <Select value={newAuction.productCondition} onValueChange={(productCondition) => setNewAuction({ ...newAuction, productCondition })}>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sellerName">Nombre del Vendedor</Label>
                    <Input
                      id="sellerName"
                      value={newAuction.sellerName}
                      onChange={(e) => setNewAuction({ ...newAuction, sellerName: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellerEmail">Email del Vendedor</Label>
                    <Input
                      id="sellerEmail"
                      type="email"
                      value={newAuction.sellerEmail}
                      onChange={(e) => setNewAuction({ ...newAuction, sellerEmail: e.target.value })}
                      placeholder="juan@email.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateAuction}>
                    Crear Subasta
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Auctions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subastas ({filteredAuctions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subasta</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Precio Actual</TableHead>
                <TableHead>Pujas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tiempo Restante</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <Gavel className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{auction.title}</div>
                        <div className="text-sm text-gray-500">{auction.productName}</div>
                        <div className="text-xs text-gray-400">{getConditionBadge(auction.productCondition)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <User className="h-3 w-3 mr-1 text-gray-400" />
                        {auction.sellerName}
                      </div>
                      <div className="text-xs text-gray-500">{auction.sellerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {formatCurrency(auction.currentPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Inicio: {formatCurrency(auction.startingPrice)}
                      </div>
                      {auction.reservePrice && (
                        <div className="text-xs text-blue-500">
                          Reserva: {formatCurrency(auction.reservePrice)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Hammer className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{auction.bidCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(auction.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{getTimeRemaining(auction.endDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAuction(auction)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {auction.status === 'ACTIVE' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateAuctionStatus(auction.id, 'CANCELLED')}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateAuctionStatus(auction.id, 'ACTIVE')}
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

      {/* Auction View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Subasta</DialogTitle>
          </DialogHeader>
          {selectedAuction && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded flex items-center justify-center">
                  <Gavel className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedAuction.title}</h3>
                  <p className="text-gray-500">{selectedAuction.productName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getConditionBadge(selectedAuction.productCondition)}
                    {getStatusBadge(selectedAuction.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Información de la Subasta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precio Inicial:</span>
                      <span className="font-medium">{formatCurrency(selectedAuction.startingPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Precio Actual:</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedAuction.currentPrice)}</span>
                    </div>
                    {selectedAuction.reservePrice && (
                      <div className="flex justify-between text-sm">
                        <span>Precio de Reserva:</span>
                        <span className="font-medium text-blue-600">{formatCurrency(selectedAuction.reservePrice)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Estado:</span>
                      <span className="font-medium">{selectedAuction.status}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>N° de Pujas:</span>
                      <span className="font-medium">{selectedAuction.bidCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tiempo Restante:</span>
                      <span className="font-medium">{getTimeRemaining(selectedAuction.endDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fecha Finalización:</span>
                      <span className="font-medium">{formatDate(selectedAuction.endDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{selectedAuction.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Vendedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nombre:</span>
                    <span className="font-medium">{selectedAuction.sellerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Email:</span>
                    <span className="font-medium">{selectedAuction.sellerEmail}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Cerrar
                </Button>
                {selectedAuction.status === 'ACTIVE' ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleUpdateAuctionStatus(selectedAuction.id, 'CANCELLED')
                      setIsViewModalOpen(false)
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Cancelar Subasta
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleUpdateAuctionStatus(selectedAuction.id, 'ACTIVE')
                      setIsViewModalOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activar Subasta
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