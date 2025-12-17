// Tipos de mensajes para el servicio de subastas
export interface IncomingMessage {
  type: 'join_auction' | 'leave_auction' | 'place_bid' | 'get_auction_info'
  auctionId: string
  amount?: number
}

export interface OutgoingMessage {
  type: 'joined_auction' | 'left_auction' | 'new_bid' | 'auction_update' | 'auction_info' | 'error' | 'user_joined' | 'user_left'
  auctionId?: string
  message?: string
  clientId?: string
  userName?: string
  bid?: any
  auction?: any
  timeRemaining?: number
}

export interface AuctionUpdate {
  id: string
  currentPrice: number
  bidCount: number
  endDate: string
  product: any
}

export interface BidInfo {
  id: string
  amount: number
  createdAt: string
  user: {
    id: string
    name: string
    rating: number
  }
}