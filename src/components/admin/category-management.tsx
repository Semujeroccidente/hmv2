'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Tag,
  MoreHorizontal
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  parentId?: string | null
  parent?: {
    id: string
    name: string
  }
  children?: Category[]
  _count?: {
    products: number
  }
  createdAt: string
  updatedAt: string
}

interface CategoryManagementProps {
  categories: Category[]
  onCategoryUpdate: (categoryId: string, updates: Partial<Category>) => void
  onCategoryCreate: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'parent' | 'children'>) => void
  onCategoryDelete: (categoryId: string) => void
}

export function CategoryManagement({
  categories,
  onCategoryUpdate,
  onCategoryCreate,
  onCategoryDelete
}: CategoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [parentFilter, setParentFilter] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: '',
    parentId: ''
  })

  // Build hierarchical structure
  const buildHierarchy = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map()
    const rootCategories: Category[] = []

    // Create map of all categories
    flatCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Build hierarchy
    flatCategories.forEach(category => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children.push(categoryMap.get(category.id))
        }
      } else {
        rootCategories.push(categoryMap.get(category.id))
      }
    })

    return rootCategories
  }

  const hierarchicalCategories = buildHierarchy(categories)

  const filteredCategories = hierarchicalCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesParent = !parentFilter || category.parentId === parentFilter

    return matchesSearch && matchesParent
  })

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCreateCategory = () => {
    onCategoryCreate({
      ...newCategory,
      parentId: newCategory.parentId || null
    })
    setNewCategory({ name: '', description: '', icon: '', parentId: '' })
    setIsCreateModalOpen(false)
  }

  const handleUpdateCategory = (categoryId: string, updates: Partial<Category>) => {
    onCategoryUpdate(categoryId, updates)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      onCategoryDelete(categoryId)
    }
  }

  const renderCategoryRow = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id}>
        <TableRow className="hover:bg-gray-50">
          <TableCell>
            <div className="flex items-center space-x-3" style={{ paddingLeft: `${level * 24}px` }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => hasChildren && toggleExpand(category.id)}
                className="p-1 h-6 w-6"
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : (
                  <Tag className="h-4 w-4 text-gray-400" />
                )}
              </Button>

              {category.icon && (
                <span className="text-lg">{category.icon}</span>
              )}

              <div>
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-gray-500">{category.description}</div>
                )}
              </div>
            </div>
          </TableCell>

          <TableCell>
            {category.parent ? (
              <Badge variant="outline">{category.parent.name}</Badge>
            ) : (
              <Badge variant="secondary">Principal</Badge>
            )}
          </TableCell>

          <TableCell>
            <div className="flex items-center space-x-2">
              <span>{category._count?.products || 0}</span>
              <span className="text-sm text-gray-500">productos</span>
            </div>
          </TableCell>

          <TableCell>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category)
                  setIsViewModalOpen(true)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category)
                  setNewCategory({
                    name: category.name,
                    description: category.description || '',
                    icon: category.icon || '',
                    parentId: category.parentId || ''
                  })
                  setIsCreateModalOpen(true)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && category.children?.map(child => renderCategoryRow(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <Select value={parentFilter || 'ALL'} onValueChange={(value) => setParentFilter(value === 'ALL' || value === 'ROOT' ? '' : value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por padre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las categorías</SelectItem>
              <SelectItem value="ROOT">Solo categorías principales</SelectItem>
              {categories
                .filter(cat => !cat.parentId)
                .map(parent => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => renderCategoryRow(category))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Nombre de la categoría"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Descripción de la categoría"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="icon">Icono (Emoji)</Label>
              <Input
                id="icon"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                placeholder="📱"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="parent">Categoría Padre</Label>
              <Select value={newCategory.parentId || 'NONE'} onValueChange={(value) => setNewCategory({ ...newCategory, parentId: value === 'NONE' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría padre (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Ninguna (categoría principal)</SelectItem>
                  {categories
                    .filter(cat => !cat.parentId)
                    .map(parent => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.icon} {parent.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCategory}>
                {selectedCategory ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Category Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Categoría</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">{selectedCategory.icon || '📁'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCategory.name}</h3>
                  {selectedCategory.description && (
                    <p className="text-gray-600">{selectedCategory.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ID:</span>
                      <span className="font-medium">{selectedCategory.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tipo:</span>
                      <span className="font-medium">
                        {selectedCategory.parentId ? 'Subcategoría' : 'Categoría Principal'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Padre:</span>
                      <span className="font-medium">
                        {selectedCategory.parent?.name || 'Ninguno'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Productos:</span>
                      <span className="font-medium">{selectedCategory._count?.products || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Subcategorías:</span>
                      <span className="font-medium">{selectedCategory.children?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Fechas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Creada:</span>
                    <span className="font-medium">
                      {new Date(selectedCategory.createdAt).toLocaleDateString('es-HN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Actualizada:</span>
                    <span className="font-medium">
                      {new Date(selectedCategory.updatedAt).toLocaleDateString('es-HN')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setNewCategory({
                      name: selectedCategory.name,
                      description: selectedCategory.description || '',
                      icon: selectedCategory.icon || '',
                      parentId: selectedCategory.parentId || ''
                    })
                    setSelectedCategory(selectedCategory)
                    setIsViewModalOpen(false)
                    setIsCreateModalOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}