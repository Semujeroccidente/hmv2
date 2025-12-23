import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, handleAdminError } from '@/lib/admin-middleware'
import { getAuditLogs } from '@/lib/audit-log'

// GET - Obtener logs de auditoría
export async function GET(request: NextRequest) {
    try {
        await requireAdmin(request)

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId') || undefined
        const entity = searchParams.get('entity') || undefined
        const action = searchParams.get('action') || undefined
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Parse dates if provided
        let startDate: Date | undefined
        let endDate: Date | undefined

        const startDateParam = searchParams.get('startDate')
        const endDateParam = searchParams.get('endDate')

        if (startDateParam) {
            startDate = new Date(startDateParam)
        }

        if (endDateParam) {
            endDate = new Date(endDateParam)
        }

        const result = await getAuditLogs({
            userId,
            entity,
            action,
            startDate,
            endDate,
            limit,
            offset
        })

        return NextResponse.json(result)
    } catch (error) {
        return handleAdminError(error)
    }
}
