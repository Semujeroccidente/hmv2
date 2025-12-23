import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BidData {
  auctionId: string
  userId: string
  amount: number
  maxAmount?: number
}

interface AuctionUpdate {
  type: 'new_bid' | 'auction_ended' | 'reserve_price_met' | 'auction_update'
  data: any
}

const PORT = 3003
const MIN_BID_INCREMENT = 50
const MAX_BIDS_PER_MINUTE = 10

// Rate limiting
const bidAttempts = new Map<string, { count: number; resetTime: number }>()

async function main() {
  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  })

  await prisma.$connect()
  console.log('✅ Conectado a la base de datos')

  const auctionSubscribers = new Map<string, Set<string>>()

  // Helper: Validar que el usuario no es el vendedor
  const validateBidder = async (userId: string, auctionId: string): Promise<boolean> => {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { product: true }
    })

    if (!auction) return false
    return auction.product.sellerId !== userId
  }

  // Helper: Rate limiting
  const checkRateLimit = (userId: string): boolean => {
    const now = Date.now()
    const userAttempts = bidAttempts.get(userId)

    if (!userAttempts || now > userAttempts.resetTime) {
      bidAttempts.set(userId, { count: 1, resetTime: now + 60000 })
      return true
    }

    if (userAttempts.count >= MAX_BIDS_PER_MINUTE) {
      return false
    }

    userAttempts.count++
    return true
  }

  // Notificar a todos los suscriptores de una subasta
  const notifyAuctionUpdate = (auctionId: string, update: AuctionUpdate) => {
    io.to(`auction_${auctionId}`).emit('auction_update', update)
  }

  // Notificación de puja
  const notifyNewBid = (auctionId: string, bid: any) => {
    notifyAuctionUpdate(auctionId, {
      type: 'new_bid',
      data: bid
    })
  }

  // Notificar fin de subasta
  const notifyAuctionEnd = async (auctionId: string) => {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
          product: true,
          bids: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              amount: 'desc'
            },
            take: 1
          }
        }
      })

      if (auction) {
        const winner = auction.bids[0]

        notifyAuctionUpdate(auctionId, {
          type: 'auction_ended',
          data: {
            winner: winner?.user,
            finalPrice: auction.currentPrice,
            totalBids: auction.bids.length
          }
        })

        console.log(`🏆 Subasta ${auctionId} terminada. Ganador: ${winner?.user.name || 'Sin pujas'}`)
      }
    } catch (error) {
      console.error('❌ Error notificando fin de subasta:', error)
    }
  }

  // Verificar si una subasta ha terminado
  const checkAuctionEnd = async (auctionId: string) => {
    try {
      const auction = await prisma.auction.findUnique({
        where: { id: auctionId },
        include: {
          product: true,
          bids: {
            orderBy: { amount: 'desc' },
            take: 1,
            include: { user: true }
          }
        }
      })

      if (auction && new Date(auction.endDate) <= new Date() && auction.status === 'ACTIVE') {
        const winner = auction.bids[0]

        // Marcar subasta como terminada
        await prisma.auction.update({
          where: { id: auctionId },
          data: {
            status: 'ENDED',
            winnerId: winner?.userId
          }
        })

        // Marcar producto como vendido si hubo ganador
        if (winner) {
          await prisma.product.update({
            where: { id: auction.productId },
            data: { status: 'SOLD' }
          })
        }

        await notifyAuctionEnd(auctionId)
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Error verificando fin de subasta:', error)
      return false
    }
  }

  // Intervalo para verificar subastas que deben terminar
  setInterval(async () => {
    try {
      const activeAuctions = await prisma.auction.findMany({
        where: {
          status: 'ACTIVE',
          endDate: { lte: new Date() }
        }
      })

      for (const auction of activeAuctions) {
        if (await checkAuctionEnd(auction.id)) {
          console.log(`⏰ Subasta ${auction.id} ha terminado automáticamente`)
        }
      }
    } catch (error) {
      console.error('❌ Error en cron de subastas:', error)
    }
  }, 60000) // Verificar cada minuto

  // Eventos de Socket.IO
  io.on('connection', (socket) => {
    console.log('✅ Usuario conectado:', socket.id)

    // Evento: Desconexión
    socket.on('disconnect', () => {
      console.log('❌ Usuario desconectado:', socket.id)

      // Remover de todas las suscripciones
      for (const [auctionId, subscribers] of auctionSubscribers.entries()) {
        subscribers.delete(socket.id)
        if (subscribers.size === 0) {
          auctionSubscribers.delete(auctionId)
        }
      }
    })

    // Evento: Unirse a una subasta
    socket.on('join_auction', async (data: { auctionId: string }) => {
      try {
        const { auctionId } = data

        // Verificar que la subasta existe y está activa
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId }
        })

        if (!auction) {
          socket.emit('error', { message: 'Subasta no encontrada' })
          return
        }

        if (auction.status !== 'ACTIVE') {
          socket.emit('error', { message: 'La subasta ya ha terminado' })
          return
        }

        // Añadir a la lista de suscriptores
        if (!auctionSubscribers.has(auctionId)) {
          auctionSubscribers.set(auctionId, new Set())
        }
        auctionSubscribers.get(auctionId)!.add(socket.id)

        // Unir al room específico de la subasta
        socket.join(`auction_${auctionId}`)

        // Enviar estado actual de la subasta
        socket.emit('auction_joined', {
          auctionId,
          currentPrice: auction.currentPrice,
          bidCount: auction.bidCount || 0,
          timeRemaining: new Date(auction.endDate).getTime() - Date.now()
        })

        console.log(`✅ Usuario ${socket.id} se unió a la subasta ${auctionId}`)
      } catch (error) {
        console.error('❌ Error al unirse a la subasta:', error)
        socket.emit('error', { message: 'Error al unirse a la subasta' })
      }
    })

    // Evento: Abandonar una subasta
    socket.on('leave_auction', (data: { auctionId: string }) => {
      try {
        const { auctionId } = data

        // Remover de las suscripciones
        if (auctionSubscribers.has(auctionId)) {
          auctionSubscribers.get(auctionId)!.delete(socket.id)
        }

        // Salir del room específico
        socket.leave(`auction_${auctionId}`)

        console.log(`❌ Usuario ${socket.id} abandonó la subasta ${auctionId}`)
      } catch (error) {
        console.error('❌ Error al abandonar la subasta:', error)
      }
    })

    // Evento: Hacer una puja
    socket.on('place_bid', async (data: BidData) => {
      try {
        const { auctionId, userId, amount, maxAmount } = data

        // Validar datos
        if (!auctionId || !userId || !amount) {
          socket.emit('bid_error', { message: 'Datos inválidos para la puja' })
          return
        }

        // Rate limiting
        if (!checkRateLimit(userId)) {
          socket.emit('bid_error', { message: 'Demasiadas pujas. Espera un momento.' })
          return
        }

        // Verificar que la subasta existe y está activa
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: { product: true }
        })

        if (!auction) {
          socket.emit('bid_error', { message: 'Subasta no encontrada' })
          return
        }

        if (auction.status !== 'ACTIVE') {
          socket.emit('bid_error', { message: 'La subasta ya ha terminado' })
          return
        }

        // Validar que el usuario no es el vendedor
        if (auction.product.sellerId === userId) {
          socket.emit('bid_error', { message: 'No puedes pujar en tu propia subasta' })
          return
        }

        // Validar monto mínimo
        const minBid = auction.currentPrice + MIN_BID_INCREMENT
        if (amount < minBid) {
          socket.emit('bid_error', {
            message: `La puja mínima es L. ${minBid}`,
            minBid
          })
          return
        }

        // Validar monto máximo (si aplica)
        if (maxAmount && amount > maxAmount) {
          socket.emit('bid_error', { message: `La puja no puede ser mayor a L. ${maxAmount}` })
          return
        }

        // Crear la puja y actualizar subasta en transacción
        const result = await prisma.$transaction(async (tx) => {
          const bid = await tx.bid.create({
            data: {
              auctionId,
              userId,
              amount
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true
                }
              }
            }
          })

          await tx.auction.update({
            where: { id: auctionId },
            data: {
              currentPrice: amount,
              bidCount: { increment: 1 },
              lastBidder: userId,
              lastBidTime: new Date()
            }
          })

          return bid
        })

        // Notificar a todos los suscriptores
        notifyNewBid(auctionId, result)

        // Confirmar al pujador
        socket.emit('bid_success', {
          message: 'Puja realizada exitosamente',
          bid: result
        })

        // Verificar si la puja alcanza el precio de reserva
        if (auction.reservePrice && amount >= auction.reservePrice) {
          io.to(`auction_${auctionId}`).emit('reserve_price_met', {
            auctionId,
            reservePrice: auction.reservePrice
          })
        }

        console.log(`💰 Puja de L.${amount} realizada en subasta ${auctionId} por usuario ${userId}`)
      } catch (error) {
        console.error('❌ Error al procesar puja:', error)
        socket.emit('bid_error', { message: 'Error al procesar la puja' })
      }
    })

    // Evento: Obtener detalles de una subasta
    socket.on('get_auction_details', async (data: { auctionId: string }) => {
      try {
        const { auctionId } = data

        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    rating: true
                  }
                }
              }
            },
            bids: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true
                  }
                }
              },
              orderBy: {
                amount: 'desc'
              },
              take: 10
            }
          }
        })

        if (!auction) {
          socket.emit('error', { message: 'Subasta no encontrada' })
          return
        }

        // Calcular tiempo restante
        const timeRemaining = new Date(auction.endDate).getTime() - Date.now()
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

        socket.emit('auction_details', {
          auction,
          timeRemaining: {
            hours: hoursRemaining,
            minutes: minutesRemaining,
            total: timeRemaining
          }
        })
      } catch (error) {
        console.error('❌ Error obteniendo detalles de subasta:', error)
        socket.emit('error', { message: 'Error al obtener detalles' })
      }
    })
  })

  httpServer.listen(PORT, () => {
    console.log(`🚀 Servicio de subastas iniciado en el puerto ${PORT}`)
  })
}

main().catch(console.error)