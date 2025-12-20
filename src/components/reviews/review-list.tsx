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
  MessageSquare,
  Edit,
  Trash2,
  MoreHorizontal,
  Flag,
  Package
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
  onReviewUpdate: (reviewId: string, updates: Partial<Review>) => void
  onReviewDelete: (reviewId: string) => void
  onReviewCreate: (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'product'>) => void
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
            size={size === 'lg' ? 24 : 16}
            className={`${star <= rating
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

    if (selectedReview) {
      handleUpdateReview()
      return
    }

    onReviewCreate({
      ...newReview,
      userId: 'user-1' // Assuming a default or handled by parent
    })
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
                {[5, 4, 3, 2, 1].map(r => (
                  <div key={r} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{r} estrellas</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(stats.ratingDistribution[r as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100} className="w-24" />
                      <span className="text-sm text-gray-500">
                        {stats.ratingDistribution[r as keyof typeof stats.ratingDistribution]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Filters logic omitted for brevity */}
        </div>
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
                  {/* Actions */}
                </div>
              </div>

              <div className="flex-1 mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEditReview(review)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {canModerate && (
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteReview(review.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
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
                    className={`p-1 rounded-md transition-colors ${star <= newReview.rating
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
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
    </div>
  )
}