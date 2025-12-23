import { Prisma } from '@prisma/client'

/**
 * Tipos de Prisma para queries comunes
 * Estos tipos aseguran type safety cuando trabajamos con datos de Prisma
 */

// Category with children and product count
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
    include: {
        children: true
        _count: {
            select: { products: true }
        }
    }
}>

// Category with all relations for detailed view
export type CategoryWithAll = Prisma.CategoryGetPayload<{
    include: {
        children: true
        parent: true
        products: true
        _count: {
            select: {
                products: true
                children: true
            }
        }
    }
}>

// Product with seller and category
export type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        seller: {
            select: {
                id: true
                name: true
                rating: true
            }
        }
        category: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
    }
}>

// Product with full details including reviews
export type ProductWithDetails = Prisma.ProductGetPayload<{
    include: {
        seller: {
            select: {
                id: true
                name: true
                email: true
                rating: true
                avatar: true
            }
        }
        category: {
            select: {
                id: true
                name: true
                slug: true
            }
        }
        reviews: {
            include: {
                user: {
                    select: {
                        id: true
                        name: true
                        avatar: true
                    }
                }
            }
        }
        _count: {
            select: {
                favorites: true
                reviews: true
                orderItems: true
            }
        }
    }
}>

// Order with items and products
export type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: {
                    select: {
                        id: true
                        title: true
                        thumbnail: true
                        price: true
                    }
                }
            }
        }
    }
}>

// Order with full details
export type OrderWithDetails = Prisma.OrderGetPayload<{
    include: {
        user: {
            select: {
                id: true
                name: true
                email: true
            }
        }
        items: {
            include: {
                product: {
                    select: {
                        id: true
                        title: true
                        thumbnail: true
                        price: true
                        seller: {
                            select: {
                                id: true
                                name: true
                            }
                        }
                    }
                }
            }
        }
    }
}>

// Cart with items
export type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: {
                    include: {
                        seller: {
                            select: {
                                id: true
                                name: true
                                rating: true
                            }
                        }
                    }
                }
            }
        }
    }
}>

// Auction with product and bids
export type AuctionWithDetails = Prisma.AuctionGetPayload<{
    include: {
        product: {
            include: {
                seller: {
                    select: {
                        id: true
                        name: true
                        email: true
                    }
                }
            }
        }
        bids: {
            include: {
                user: {
                    select: {
                        id: true
                        name: true
                    }
                }
            }
            orderBy: {
                createdAt: 'desc'
            }
            take: 10
        }
        _count: {
            select: {
                bids: true
            }
        }
    }
}>

// User with counts
export type UserWithCounts = Prisma.UserGetPayload<{
    select: {
        id: true
        name: true
        email: true
        role: true
        status: true
        avatar: true
        rating: true
        createdAt: true
        _count: {
            select: {
                products: true
                orders: true
                bids: true
            }
        }
    }
}>

// Message with sender and receiver
export type MessageWithUsers = Prisma.MessageGetPayload<{
    include: {
        sender: {
            select: {
                id: true
                name: true
                avatar: true
            }
        }
        receiver: {
            select: {
                id: true
                name: true
                avatar: true
            }
        }
    }
}>

// Review with user
export type ReviewWithUser = Prisma.ReviewGetPayload<{
    include: {
        user: {
            select: {
                id: true
                name: true
                avatar: true
            }
        }
    }
}>
