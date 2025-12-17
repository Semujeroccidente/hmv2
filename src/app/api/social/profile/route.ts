import { NextRequest, NextResponse } from 'next/server'
import { MOCK_USERS } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const user = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0]

    return NextResponse.json({
      profile: {
        ...user,
        bio: 'Vendedor entusiasta en HonduMarket. Ofrezco los mejores productos tecnológicos.',
        stats: {
          sales: 15,
          rating: 4.8,
          responseRate: '98%'
        },
        reviews: [
          {
            id: 'REV-1',
            text: 'Excelente vendedor, producto en perfecto estado',
            rating: 5,
            author: 'Cliente Satisfecho',
            date: new Date().toISOString()
          }
        ]
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}