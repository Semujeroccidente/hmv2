import { createServer } from 'http'
import { Server } from 'socket.io'
import { db } from '../../lib/db'
import { ZAI } from 'z-ai-web-dev-sdk'

interface BidData {
  auctionId: string
  userId: string
  amount: number
  maxAmount?: number
}

interface AuctionUpdate {
  auctionId: string
  currentPrice: number
  bidCount: number
  lastBidder?: string
  lastBidTime?: Date
}

const PORT = 3003 // Puerto para el servicio de subastas

async function main() {
  const server = createServer()
  const io = new Server(PORT, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  })

  // Conexión a la base de datos
  await db.$connect()

  // Almacenamiento de conexiones activas
  const activeConnections = new Map<string, string>()
  const auctionSubscribers = new Map<string, Set<string>>()

  // Función para notificar a todos los suscriptores de una subasta
  const notifyAuctionUpdate = (auctionId: string, update: AuctionUpdate) => {
    const subscribers = auctionSubscribers.get(auctionId) || new Set()
    subscribers.forEach(socketId => {
      const socket = activeConnections.get(socketId)
      if (socket) {
        socket.emit('auction_update', update)
      }
    })
  }

  // Función para enviar notificación de puja
  const notifyNewBid = (auctionId: string, bid: any) => {
    notifyAuctionUpdate(auctionId, {
      type: 'new_bid',
      data: bid
    })
  }

  // Función para notificar fin de subasta
  const notifyAuctionEnd = async (auctionId: string) => {
    try {
      const auction = await db.auction.findUnique({
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
              createdAt: 'desc'
            },
            take: 1
          }
        }
      })

      if (auction) {
        const winner = auction.bids[0]?.user

        notifyAuctionUpdate(auctionId, {
          type: 'auction_ended',
          data: {
            winner,
            finalPrice: auction.currentPrice,
            totalBids: auction.bidCount
          }
        })

        // Enviar notificación al ganador
        if (winner) {
          // TODO: Implementar sistema de notificaciones por email
          console.log(`Notificación al ganador: ${winner.name}`)
        }
      }
    } catch (error) {
      console.error('Error notificando fin de subasta:', error)
    }
  }

  // Función para verificar si una subasta ha terminado
  const checkAuctionEnd = async (auctionId: string) => {
    try {
      const auction = await db.auction.findUnique({
        where: { id: auctionId }
      })

      if (auction && new Date(auction.endDate) <= new Date() && auction.status === 'ACTIVE') {
        // Marcar subasta como terminada
        await db.auction.update({
          where: { id: auctionId },
          data: {
            status: 'ENDED'
          }
        })

        notifyAuctionEnd(auctionId)
        return true
      }
      return false
    } catch (error) {
      console.error('Error verificando fin de subasta:', error)
      return false
    }
  }

  // Intervalo para verificar subastas que deben terminar
  setInterval(async () => {
    try {
      const activeAuctions = await db.auction.findMany({
        where: {
          status: 'ACTIVE'
        }
      })

      for (const auction of activeAuctions) {
        if (await checkAuctionEnd(auction.id)) {
          console.log(`Subasta ${auction.id} ha terminado automáticamente`)
        }
      }
    }, 60000) // Verificar cada minuto
  }

  io.on('connection', (socket) => {
    console.log('Usuario conectado al servicio de subastas:', socket.id)
    activeConnections.set(socket.id, socket.id)
  })

  io.on('disconnect', (socket) => {
    console.log('Usuario desconectado del servicio de subastas:', socket.id)
    activeConnections.delete(socket.id)
    
    // Remover de todas las suscripciones
    for (const [auctionId, subscribers] of auctionSubscribers.entries()) {
      subscribers.delete(socket.id)
      if (subscribers.size === 0) {
        auctionSubscribers.delete(auctionId)
      }
    }
  })

  // Unirse a una subasta
  socket.on('join_auction', async (data: { auctionId }) => {
    try {
      // Verificar que la subasta existe y está activa
      const auction = await db.auction.findUnique({
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
        bidCount: auction.bidCount,
        timeRemaining: new Date(auction.endDate).getTime() - Date.now()
      })

      console.log(`Usuario ${socket.id} se unió a la subasta ${auctionId}`)
    } catch (error) {
      socket.emit('error', { message: 'Error al unirse a la subasta' })
    }
  })

  // Abandonar una subasta
  socket.on('leave_auction', (data: { auctionId }) => {
    try {
      // Remover de las suscripciones
      if (auctionSubscribers.has(auctionId)) {
        auctionSubscribers.get(auctionId)!.delete(socket.id)
      }

      // Salir del room específico
      socket.leave(`auction_${auctionId}`)

      console.log(`Usuario ${socket.id} abandonó la subasta ${auctionId}`)
    } catch (error) {
      console.error('Error al abandonar la subasta:', error)
    }
  })

  // Hacer una puja
  socket.on('place_bid', async (data: BidData) => {
    try {
      const { auctionId, userId, amount, maxAmount } = data

      // Validar datos
      if (!auctionId || !userId || !amount) {
        socket.emit('error', { message: 'Datos inválidos para la puja' })
        return
      }

      // Verificar que la subasta existe y está activa
      const auction = await db.auction.findUnique({
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

      // Validar monto mínimo
      if (amount <= auction.currentPrice) {
        socket.emit('error', { message: 'La puja debe ser mayor al precio actual' })
        return
      }

      // Validar monto máximo (si aplica)
      if (maxAmount && amount > maxAmount) {
        socket.emit('error', { message: `La puja no puede ser mayor a L. ${maxAmount}` })
        return
      }

      // Crear la puja
      const bid = await db.bid.create({
        data: {
          auctionId,
          userId,
          amount,
          createdAt: new Date()
        }
      })

      // Actualizar subasta
      const updatedAuction = await db.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: amount,
          bidCount: auction.bidCount + 1,
          lastBidder: userId,
          lastBidTime: new Date()
        }
      })

      // Notificar a todos los suscriptores
      const bidData = {
        id: bid.id,
        auctionId,
        userId,
        amount,
        createdAt: bid.createdAt,
        user: {
          // TODO: Obtener datos del usuario
          id: userId,
          name: 'Usuario', // Placeholder
          email: 'usuario@ejemplo.com'
        }
      }

      notifyNewBid(auctionId, bidData)

      // Verificar si la puja alcanza el precio de reserva
      if (auction.reservePrice && amount >= auction.reservePrice) {
        socket.emit('reserve_price_met', {
          auctionId,
          reservePrice: auction.reservePrice
        })
      }

      console.log(`Puja de L.${amount} realizada en subasta ${auctionId} por usuario ${userId}`)
    } catch (error) {
      console.error('Error al procesar puja:', error)
      socket.emit('error', { message: 'Error al procesar la puja' })
    }
  })

  // Obtener detalles de una subasta
  socket.on('get_auction_details', async (data: { auctionId }) => {
    try {
      const auction = await db.auction.findUnique({
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
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
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
      console.error('Error obteniendo detalles de subasta:', error)
      socket.emit('error', { message: 'Error al obtener detalles' })
    }
  })

  console.log(`Servicio de subastas iniciado en el puerto ${PORT}`)
}

main().catch(console.error)