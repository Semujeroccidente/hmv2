import { prisma } from '@/lib/prisma'

interface TimeExtensionResult {
    extended: boolean
    newEndDate?: Date
    extensionMinutes?: number
    timesExtended?: number
}

/**
 * Verifica si una puja debe extender el tiempo de la subasta
 * Si la puja ocurre en los últimos X minutos, extiende la subasta
 */
export async function checkTimeExtension(
    auctionId: string,
    bidTime: Date = new Date()
): Promise<TimeExtensionResult> {
    try {
        const auction = await prisma.auction.findUnique({
            where: { id: auctionId }
        })

        if (!auction) {
            return { extended: false }
        }

        // Calcular tiempo restante hasta el fin
        const timeUntilEnd = auction.endDate.getTime() - bidTime.getTime()
        const extensionThreshold = auction.extensionMinutes * 60 * 1000 // Convertir a ms

        // Verificar si debe extenderse
        const shouldExtend =
            timeUntilEnd <= extensionThreshold &&
            timeUntilEnd > 0 &&
            auction.timesExtended < auction.maxExtensions &&
            auction.status === 'ACTIVE'

        if (!shouldExtend) {
            return { extended: false }
        }

        // Calcular nueva fecha de fin
        const extensionMs = auction.extensionMinutes * 60 * 1000
        const newEndDate = new Date(auction.endDate.getTime() + extensionMs)

        // Actualizar subasta
        const updatedAuction = await prisma.auction.update({
            where: { id: auctionId },
            data: {
                endDate: newEndDate,
                timesExtended: { increment: 1 },
                originalEndDate: auction.originalEndDate || auction.endDate
            }
        })

        console.log(`⏰ Auction ${auctionId} extended by ${auction.extensionMinutes} minutes (${updatedAuction.timesExtended}/${auction.maxExtensions})`)

        return {
            extended: true,
            newEndDate,
            extensionMinutes: auction.extensionMinutes,
            timesExtended: updatedAuction.timesExtended
        }

    } catch (error) {
        console.error('Error checking time extension:', error)
        return { extended: false }
    }
}

/**
 * Obtiene información sobre las extensiones de una subasta
 */
export async function getExtensionInfo(auctionId: string) {
    const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        select: {
            endDate: true,
            originalEndDate: true,
            extensionMinutes: true,
            timesExtended: true,
            maxExtensions: true
        }
    })

    if (!auction) return null

    const canExtend = auction.timesExtended < auction.maxExtensions
    const timeUntilEnd = auction.endDate.getTime() - Date.now()
    const isInExtensionWindow = timeUntilEnd <= (auction.extensionMinutes * 60 * 1000)

    return {
        ...auction,
        canExtend,
        isInExtensionWindow,
        extensionsRemaining: auction.maxExtensions - auction.timesExtended
    }
}

/**
 * Calcula el tiempo restante de una subasta
 */
export function getTimeRemaining(endDate: Date) {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const diff = end - now

    if (diff <= 0) {
        return {
            total: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true
        }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return {
        total: diff,
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
    }
}
