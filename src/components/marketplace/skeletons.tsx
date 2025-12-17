import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ProductSkeleton() {
    return (
        <Card className="group h-full">
            <CardContent className="p-0">
                {/* Image Skeleton */}
                <div className="aspect-square relative">
                    <Skeleton className="h-full w-full rounded-t-lg" />
                </div>

                {/* Info Skeleton */}
                <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-1/3" /> {/* Category badge */}
                    <Skeleton className="h-6 w-3/4" /> {/* Title */}

                    <div className="pt-2">
                        <Skeleton className="h-8 w-1/2" /> {/* Price */}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-9 flex-1" /> {/* Add to cart button */}
                        <Skeleton className="h-9 w-9" /> {/* Heart button */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    )
}

export function CartSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4 flex gap-4">
                                <Skeleton className="h-24 w-24 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                    <div className="flex justify-between items-end">
                                        <Skeleton className="h-8 w-24" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-24" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-1/2" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export function AuctionDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-32 w-full" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-12 flex-1" />
                                        <Skeleton className="h-12 w-32" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-1/4 mb-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full mt-2" />
                                <Skeleton className="h-4 w-3/4 mt-2" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function OrderSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-32" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                                <Skeleton className="h-px w-full" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-px w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-32" />
                                    <Skeleton className="h-9 w-32" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
