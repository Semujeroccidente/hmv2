'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Mail, 
  Phone, 
  Star, 
  ShoppingBag, 
  Heart, 
  MessageSquare,
  Edit,
  Settings
} from 'lucide-react'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    bio?: string
    role: string
    rating: number
    salesCount: number
    address?: {
      city: string
      state: string
      country: string
    }
    createdAt: Date
  }
  isOwnProfile?: boolean
}

export function UserProfile({ user, isOwnProfile = false }: UserProfileProps) {
  const getRoleText = (role: string) => {
    switch (role) {
      case 'USER': return 'Comprador'
      case 'SELLER': return 'Vendedor'
      case 'ADMIN': return 'Administrador'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'USER': return 'bg-blue-100 text-blue-800'
      case 'SELLER': return 'bg-green-100 text-green-800'
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="space-y-6">
      {/* Tarjeta principal de perfil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center sm:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="mt-4 text-center sm:text-left">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <Badge className={getRoleColor(user.role)} variant="secondary">
                  {getRoleText(user.role)}
                </Badge>
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Información de contacto</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {user.address.city}, {user.address.state}, {user.address.country}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Acerca de mí</h3>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Miembro desde: {formatDate(user.createdAt)}
              </div>
            </div>

            {/* Botones de acción */}
            {isOwnProfile && (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="text-2xl font-bold">{user.rating.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Calificación</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{user.salesCount}</div>
            <div className="text-sm text-gray-500">Ventas realizadas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Favoritos</div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      {!isOwnProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar mensaje
            </Button>
            <Button variant="outline" className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              Seguir vendedor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}