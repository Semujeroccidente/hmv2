'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  Users, 
  Eye, 
  Heart,
  TrendingUp,
  AlertTriangle
  RefreshCw
} from 'lucide-react'

interface AuctionTimerProps {
  endDate: Date
  onTimeUpdate: (timeRemaining: number) => void
  onAuctionEnd: () => void
}

export function AuctionTimer({ endDate, onTimeUpdate, onAuctionEnd }: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const end = new Date(endDate)
      const remaining = end.getTime() - now.getTime()
      
      setTimeRemaining(Math.max(0, remaining))
      setIsEnded(remaining <= 0)
      
      onTimeUpdate(remaining)
      
      if (remaining <= 0) {
        onAuctionEnd()
      }
    }

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeRemaining()
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const getProgressPercentage = () => {
    const totalTime = new Date(endDate).getTime() - new Date(endDate.getTime() - (24 * 60 * 60 * 1000))
    const elapsed = totalTime - timeRemaining
    return Math.max(0, (elapsed / totalTime) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          <h3>Tiempo Restante</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {isEnded ? (
            <div className="text-red-600 font-medium mb-2">
              ¡La subasta ha terminado!
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                {formatTime(timeRemaining)}
              </div>
              <Progress 
                value={getProgressPercentage()} 
                className="w-full h-3"
              />
              <div className="text-sm text-gray-500 mt-1">
                {Math.round(getProgressPercentage())}% completado
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          {isEnded ? (
            <span>La subasta terminó el {new Date(endDate).toLocaleString('es-HN')}</span>
          ) : (
            <span>Termina el {new Date(endDate).toLocaleString('es-HN')}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}