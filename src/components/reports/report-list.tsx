'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Star, 
  StarHalf,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
  Calendar,
  User,
  Filter,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'

interface Report {
  id: string
  type: 'review' | 'user' | 'product' | 'auction' | 'system'
  description: string
  reportedBy: string
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
  reviewedBy?: string
  reviewedAt?: string
  resolvedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ReportStats {
  totalReports: number
  pendingReports: number
  resolvedReports: number
  dismissedReports: number
  averageResolutionTime: number
}

interface ReportListProps {
  reports: Report[]
  stats?: ReportStats
  onReportUpdate: (reportId: string, updates: Partial<Report>) => void
  onReportDelete: (reportId: string) => void
  onReportCreate: (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void
  canModerate?: boolean
}

export function ReportList({ 
  reports, 
  stats, 
  onReportUpdate, 
  onReportDelete, 
  onReportCreate, 
  canModerate = false 
}: ReportListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [newReport, setNewReport] = useState({
    type: 'review',
    description: '',
    reportedBy: '',
    productId: '',
    userId: '',
    status: 'pending'
  })

  const [filterType, setFilterType] = useState<'all' | 'review' | 'user' | 'product' | 'auction' | 'system'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewing' | 'resolved' | 'dismissed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(filterType) ||
                         report.status.toLowerCase().includes(filterStatus)
    
    return matchesSearch
  })

  const getReportTypeBadge = (type: string) => {
    const variants = {
      review: 'bg-blue-100 text-blue-800',
      user: 'bg-orange-100 text-orange-800',
      product: 'bg-green-100 text-green-800',
      auction: 'bg-purple-100 text-purple-800',
      system: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={variants[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    )
  }

  const getReportStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
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

  const handleCreateReport = () => {
    if (!newReport.type || !newReport.description || !newReport.reportedBy) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    onReportCreate({
      ...newReport,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    setNewReport({
      type: 'review',
      description: '',
      reportedBy: '',
      productId: '',
      userId: '',
      status: 'pending'
    })
    setIsCreateModalOpen(false)
  }

  const handleUpdateReport = (reportId: string, updates: Partial<Report>) => {
    onReportUpdate(reportId, updates)
  }

  const handleDeleteReport = (reportId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer.')) {
      onReportDelete(reportId)
    }
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setNewReport({
      ...report,
      type: report.type,
      description: report.description,
      reportedBy: report.reportedBy,
      productId: report.productId,
      userId: report.userId
    })
    setIsCreateModalOpen(true)
  }

  const handleStatusChange = (reportId: string, newStatus: string) => {
    handleUpdateReport(reportId, { status: newStatus })
  }

  const handleStatusChangeWithNotes = (reportId: string, newStatus: string, notes: string) => {
    handleUpdateReport(reportId, { status: newStatus, notes })
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Reportes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Reportes:</span>
                <span className="text-2xl font-bold">{stats.totalReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendientes:</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resueltos:</span>
                <span className="text-2xl font-bold text-green-600">{stats.resolvedReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Descartados:</span>
                <span className="text-2xl font-bold text-gray-600">{stats.dismissedReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo promedio de resolución:</span>
                <span className="text-2xl font-bold text-blue-600">{stats.averageResolutionTime.toFixed(1)}h</span>
              </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reportes por Tipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reseñas:</span>
                <Badge className="ml-2 bg-blue-100 text-blue-800">reviews</Badge>
                </Badge>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.ratingDistribution?.[5] || 0}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Usuarios:</span>
                <Badge className="ml-2 bg-orange-100 text-orange-800">users</Badge>
                </Badge>
                <div className="text-2xl font-bold text-orange-800">
                  {stats.ratingDistribution?.[4] || 0}
                </div>
              </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Productos:</span>
                <Badge className="ml-2 bg-green-100 text-green-800">products</Badge>
                </Badge>
                <div className="text-2xl font-bold text-green-600">
                  {stats.ratingDistribution?.[3] || 0}
                </div>
              </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subastas:</span>
                <Badge className="ml-2 bg-purple-100 text-purple-800">auctions</Badge>
                </Badge>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.ratingDistribution?.[2] || 0}
                </div>
              </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sistema:</span>
                <Badge className="ml-2 bg-red-100 text-red-800">system</Badge>
                </Badge>
                <div className="text-2xl font-bold text-red-600">
                  {stats.ratingDistribution?.[1] || 0}
                </div>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 w-full sm:w-64"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="review">Reseñas</SelectItem>
              <SelectItem value="user">Usuarios</SelectItem>
              <SelectItem value="product">Productos</SelectItem>
              <SelectItem value="auction">Subastas</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por estadoSelectItem>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="reviewing">En revisión</SelectItem>
              <SelectItem value="resolved">Resueltos</SelectItem>
              <SelectItem value="dismissed">DescartadosSelectItem>
            </SelectContent>
          </Select>
        </Select>
        </Select>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          Nuevo Reporte
        </Button>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Reportado por</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getReportTypeBadge(report.type)}
                      <span className="ml-2">{getReportTypeLabel(report.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {report.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {report.reportedBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getReportStatusBadge(report.status)}
                      <span className="ml-2">{getStatusLabel(report.status)}</span>
                    </TableCell>
                  <TableCell>
                    {formatDate(report.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {canModerate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleUpdateReport(report.id, { status: 'reviewing' })
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          En revisar
                        </Button>
                      )}
                      
                      <canModerate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleUpdateReport(report.id, { status: 'resolved' })
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como resuelto
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                          size="sm"
                          onClick={() => {
                            handleUpdateReport(report.id, { status: 'dismissed' })
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Descartar
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

      {/* Create/Edit Report Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReport ? 'Editar Reporte' : 'Nuevo Reporte'}
            </DialogHeader>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium mb-2">Tipo de Reporte</label>
              <Select 
                value={newReport.type}
                onValueChange={(value) => setNewReport({ ...newReport, type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Reseña de producto</SelectItem>
                  <SelectItem value="user">Reporte de usuario</SelectItem>
                  <SelectItem value="product">Reporte de producto</SelectItem>
                  <SelectItem value="auction">Reporte de subasta</SelectItem>
                  <SelectItem value="system">Reporte del sistema</SelectItem>
                </SelectContent>
              </Select>
            </Select>
            </Select>

            <div>
              <label htmlFor="description">Descripción del Reporte</label>
              <Textarea
                id="description"
                value={newReport.description}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                placeholder="Describe el problema en detalle..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <label htmlFor="productId">Producto (si aplica)</label>
              <Input
                id="productId"
                value={newReport.productId}
                onChange={(e) => setNewReport({ ...newReport, productId: e.target.value })}
                placeholder="ID del producto (opcional)"
              />
              </div>

            <div>
              <label htmlFor="userId">Usuario (si aplica)</label>
              <Input
                id="userId"
                value={newReport.userId}
                onChange={(e) => setNewReport({ ...newReport, userId: e.target.value })}
                placeholder="ID del usuario (opcional)"
              />
              </div>

            <div>
              <label htmlFor="reportedBy">Reportado por</label>
              <Input
                id="reportedBy"
                value={newReport.reportedBy}
                onChange={(e) => setNewReport({ ...newReport, reportedBy: e.target.value })}
                placeholder="Tu nombre (opcional)"
              />
              </div>

            <div>
              <label htmlFor="status">Estado</label>
              <Select 
                value={newReport.status}
                onValueChange={(value) => setNewReport({ ...newReport, status: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="reviewing">En revisión</SelectItem>
                  <SelectItem value="resolved">Resuelto</SelectItem>
                  <SelectItem value="dismissed">DescartadoSelectItem>
                </SelectContent>
              </SelectContent>
            </Select>
            </Select>
            </Select>
            </Select>
          </Select>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateReview}>
                {selectedReport ? 'Actualizar' : 'Crear'}
              </Button>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Report Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Reporte</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="text-sm">Información General</CardHeader>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{selectedReport.id}</span>
                    </div>
                    <div className="text-gray-900">
                      {formatDate(selectedReport.createdAt)}
                    </div>
                    <div className="text-gray-900">
                      {selectedReport.updatedAt && formatDate(selectedReport.updatedAt)}
                    </div>
                    </div>
                  </div>
                  </div>
                </div>
                </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-sm">Reporte</CardHeader>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">Descripción:</div>
                      <p className="text-gray-900">
                        {selectedReport.description}
                      </p>
                    </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-sm">Reporte por</CardHeader>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">Reportado por:</div>
                      <div className="font-medium">{selectedReport.reportedBy}</div>
                    </div>
                    <div className="text-sm text-gray-600">Tipo:</div>
                      <span className="ml-2">{getReportTypeLabel(selectedReport.type)}</span>
                    </div>
                    <div className="text-sm text-gray-600">Estado:</div>
                      <span className="ml-2">{getStatusLabel(selectedReport.status)}</span>
                    </div>
                  </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-sm">Historial</CardHeader>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">Creado por:</div>
                      <div className="font-medium">{selectedReport.reviewedBy}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedReport.reviewedAt)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedReport.resolvedAt && formatDate(selectedReport.resolvedAt)}
                    </div>
                    </div>
                  </div>
                </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-sm">Notas del administrador</CardHeader>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      {selectedReport.notes ? (
                        <div className="p-2 text-gray-700">
                          <strong>Notas:</strong>
                          <p>{selectedReport.notes}</p>
                        </div>
                        ) : (
                          <div className="text-gray-500">No hay notas</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                    Cerrar
                  </Button>
                  {canModerate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleUpdateReport(selectedReport.id, { status: 'reviewing' })
                      }}
                      >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      En revisar
                    </Button>
                  )}
                  
                  {canModerate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleUpdateReport(selectedReport.id, { status: 'resolved' })
                      }
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como resuelto
                    </Button>
                  )}
                  
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleUpdateReport(selectedReport.id, { status: 'dismissed' })
                      }
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Descartar
                    </Button>
                  )}
                )}
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  )
}