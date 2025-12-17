import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Usuario seguido exitosamente',
      isFollowing: true
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Return dummy follow status
  return NextResponse.json({
    isFollowing: false,
    followersCount: 156,
    followingCount: 42
  })
}