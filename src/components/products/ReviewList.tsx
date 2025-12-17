'use client'

import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Review {
    id: string
    rating: number
    comment: string
    createdAt: string
    user: {
        name: string
        avatar?: string
    }
}

interface ReviewListProps {
    reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <Card key={review.id}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={review.user.avatar} />
                                <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{review.user.name}</h4>
                                    <span className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(review.createdAt), {
                                            addSuffix: true,
                                            locale: es
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
