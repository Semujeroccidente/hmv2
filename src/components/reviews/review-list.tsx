'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
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

interface Review {
  id: string
  rating: number
  comment: string
  productId: string
  userId: string
  user: {
    name: string
    avatar?: string
    rating: number
  }
  product: {
    id: string
    title: string
    thumbnail?: string
  }
  createdAt: string
  updatedAt: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ReviewListProps {
  reviews: Review[]
  stats?: ReviewStats
  userRating?: number
  onReviewUpdate?: (reviewId: string, updates: Partial<Review>) => void
  onReviewDelete?: (reviewId: string) => void
  onReviewCreate?: (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'product'>) => void
  canModerate?: boolean
}

export function ReviewList({ 
  reviews, 
  stats, 
  userRating, 
  onReviewUpdate, 
  onReviewDelete, 
  onReviewCreate,
  canModerate = false 
}: ReviewListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    productId: ''
  })

  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'rating-high':
          return b.rating - a.rating
        case 'rating-low':
          return a.rating - b.rating
        default:
          return 0
      }
    })

  const renderStars = (rating: number, size = 'sm', interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
          />
        ))}
      </div>
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

  const handleCreateReview = () => {
    if (!newReview.productId || newReview.rating === 0) {
      alert('Por favor selecciona una calificación y escribe un comentario')
      return
    }

    onReviewCreate(newReview)
    setNewReview({ rating: 0, comment: '', productId: '' })
    setIsCreateModalOpen(false)
  }

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      onReviewDelete(reviewId)
    }
  }

  const handleEditReview = (review: Review) => {
    setSelectedReview(review)
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      productId: review.productId
    })
    setIsCreateModalOpen(true)
  }

  const handleUpdateReview = () => {
    if (selectedReview) {
      onReviewUpdate(selectedReview.id, {
        rating: newReview.rating,
        comment: newReview.comment
      })
      setSelectedReview(null)
      setIsCreateModalOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center space-x-1">
                {renderStars(Math.round(stats.averageRating))}
                <span className="text-sm text-gray-500 ml-2">
                  ({stats.totalReviews} reseñas)
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
              <div className="text-sm text-gray-500">Total Reseñas</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">5 estrellas</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(stats.ratingDistribution[5] / stats.totalReviews) * 100} className="w-24" />
                    <span className="text-sm text-gray-500">
                      {stats.ratingDistribution[5]} ({((stats.ratingDistribution[5] / stats.totalReviews) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">4 estrellas</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(stats.ratingDistribution[4] / stats.totalReviews) * 100} className="w-24" />
                    <span className="text-sm text-gray-500">
                      {stats.ratingDistribution[4]} ({((stats.ratingDistribution[4] / stats.totalReviews) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">3 estrellas</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(stats.ratingDistribution[3] / stats.totalReviews) * 100} className="w-24" />
                    <span className="text-sm text-gray-500">
                      {stats.ratingDistribution[3]} ({((stats.ratingDistribution[3] / stats.totalReviews) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">2 estrellas</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(stats.ratingDistribution[2] / stats.totalReviews) * 100} className="w-24" />
                    <span className="text-sm text-gray-500">
                      {stats.ratingDistribution[2]} ({((stats.ratingDistribution[2] / stats.totalReviews) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">1 estrella</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(stats.ratingDistribution[1] / stats.totalReviews) * 100} className="w-24" />
                    <span className="text-sm text-gray-500">
                      {stats.ratingDistribution[1]} ({((stats.ratingDistribution[1] / stats.totalReviews) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User's Rating */}
      {userRating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Tu Valoración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(userRating, 'lg')}
                <span className="text-2xl font-bold text-gray-900">{userRating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-gray-500">
                {userRating >= 4.5 ? 'Excelente' : 
                 userRating >= 3.5 ? 'Muy bueno' :
                 userRating >= 2.5 ? 'Bueno' :
                 userRating >= 1.5 ? 'Regular' : 'Necesita mejorar'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Ordenar por:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="rating-high">Mejor calificadas</option>
            <option value="rating-low">Peor calificadas</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Filtrar por:</span>
          <select 
            value={filterRating || ''}
            onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Todas las calificaciones</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>

        {canModerate && (
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Moderar
          </Button>
        )}
      </div>

      {/* Add Review Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Escribir Reseña
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>
                    {review.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{review.user.name}</span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500 ml-2">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {canModerate && (
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex-1 mt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReview(review)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  
                  {canModerate && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Review Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedReview ? 'Editar Reseña' : 'Escribir Reseña'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Calificación</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 rounded-md transition-colors ${
                      star <= newReview.rating 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {newReview.rating > 0 && `Has seleccionado ${newReview.rating} estrella${newReview.rating > 1 ? 's' : ''}`}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Tu Reseña
              </label>
              <Textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Comparte tu experiencia con este producto..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateReview}>
                {selectedReview ? 'Actualizar' : 'Publicar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Review Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Reseña</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedReview.user.avatar} alt={selectedReview.user.name} />
                  <AvatarFallback className="text-2xl">
                    {selectedReview.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-semibold">{selectedReview.user.name}</h3>
                  <div className="flex items-center space-x-2">
                    {renderStars(selectedReview.rating, 'lg')}
                    <span className="text-2xl font-bold text-gray-900">
                      {selectedReview.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedReview.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Información del Producto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {selectedReview.product.thumbnail ? (
                            <img 
                              src={selectedReview.product.thumbnail} 
                              alt={selectedReview.product.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                      </div>
                      <div>
                        <div className="font-medium">{selectedReview.product.title}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(selectedReview.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Reseña</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {renderStars(selectedReview.rating, 'lg')}
                        <span className="text-xl font-bold">
                          {selectedReview.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(selectedReview.createdAt)}
                      </div>
                    </div>
                    </div>
                    <div className="text-gray-700">
                      {selectedReview.comment}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Cerrar
                </Button>
                {canModerate && (
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleDeleteReview(selectedReview.id)
                      setIsViewModalOpen(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
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