import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Crea un registro de auditoría para acciones de administradores
 */
export async function createAuditLog(params: {
    userId: string
    action: string
    entity: string
    entityId?: string
    details?: any
    request?: NextRequest
}) {
    try {
        const { userId, action, entity, entityId, details, request } = params

        // Obtener IP y User Agent del request si está disponible
        let ipAddress: string | undefined
        let userAgent: string | undefined

        if (request) {
            ipAddress = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown'
            userAgent = request.headers.get('user-agent') || undefined
        }

        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : undefined,
                ipAddress,
                userAgent
            }
        })
    } catch (error) {
        // No fallar la operación principal si el log falla
        console.error('Error creating audit log:', error)
    }
}

/**
 * Obtiene logs de auditoría con filtros opcionales
 */
export async function getAuditLogs(params?: {
    userId?: string
    entity?: string
    action?: string
    startDate?: Date
    endDate?: Date
    limit?: number
    offset?: number
}) {
    const {
        userId,
        entity,
        action,
        startDate,
        endDate,
        limit = 50,
        offset = 0
    } = params || {}

    const where: any = {}

    if (userId) where.userId = userId
    if (entity) where.entity = entity
    if (action) where.action = action

    if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = startDate
        if (endDate) where.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip: offset
        }),
        prisma.auditLog.count({ where })
    ])

    return {
        logs,
        total,
        limit,
        offset
    }
}
