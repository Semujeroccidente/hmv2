import { z } from 'zod'

/**
 * Pagination constants
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MIN_LIMIT: 1,
    MAX_LIMIT: 100,
    MAX_PAGE: 1000,
} as const

/**
 * Pagination query schema
 */
export const paginationSchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1, 'Page must be at least 1')
        .max(PAGINATION.MAX_PAGE, `Page cannot exceed ${PAGINATION.MAX_PAGE}`)
        .default(PAGINATION.DEFAULT_PAGE),
    limit: z.coerce
        .number()
        .int()
        .min(PAGINATION.MIN_LIMIT, `Limit must be at least ${PAGINATION.MIN_LIMIT}`)
        .max(PAGINATION.MAX_LIMIT, `Limit cannot exceed ${PAGINATION.MAX_LIMIT}`)
        .default(PAGINATION.DEFAULT_LIMIT),
})

export type PaginationParams = z.infer<typeof paginationSchema>

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

/**
 * Get validated pagination parameters from URL search params
 */
export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
    const page = searchParams.get('page') || PAGINATION.DEFAULT_PAGE.toString()
    const limit = searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT.toString()

    const result = paginationSchema.safeParse({ page, limit })

    if (!result.success) {
        // Return defaults if validation fails
        return {
            page: PAGINATION.DEFAULT_PAGE,
            limit: PAGINATION.DEFAULT_LIMIT,
        }
    }

    return result.data
}

/**
 * Calculate pagination metadata
 */
export function getPaginationMeta(
    page: number,
    limit: number,
    total: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit)

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    }
}

/**
 * Calculate skip value for database queries
 */
export function getSkip(page: number, limit: number): number {
    return (page - 1) * limit
}
