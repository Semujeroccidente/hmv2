'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCart } from '@/hooks/use-cart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { CategoryMenu } from './category-menu'
import {
  Search,
  ShoppingCart,
  Heart,
  MessageSquare,
  User,
  Package,
  Settings,
  LogOut,
  Menu,
  Bell,
  Store,
  Gavel,
  Shield,
  Users
} from 'lucide-react'

interface HeaderProps {
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  favoritesCount?: number
  messagesCount?: number
}

export function Header({
  user,
  favoritesCount = 0,
  messagesCount = 0
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState(user)
  const { itemCount } = useCart()

  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  useEffect(() => {
    const init = async () => {
      // Cargar categorías jerárquicas
      try {
        const response = await fetch('/api/categories?format=tree')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }

      // Si no se pasó usuario por props, intentar cargarlo
      if (!user) {
        try {
          const response = await fetch('/api/auth/me')
          if (response.ok) {
            const data = await response.json()
            if (data.user) {
              setCurrentUser(data.user)
            }
          }
        } catch (error) {
          // Silent error for auth check
        }
      }
    }

    init()
  }, [user])

  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        {/* Barra superior */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HonduMarket</span>
          </Link>

          {/* Barra de búsqueda - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos, servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Button type="submit" className="absolute right-0 top-0 h-full rounded-l-none">
                Buscar
              </Button>
            </div>
          </form>

          {/* Navegación principal - Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-screen max-w-6xl p-6">
                      <CategoryMenu categories={categories} />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/subastas" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      <Gavel className="h-4 w-4 mr-2" />
                      Subastas
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/social" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      <Users className="h-4 w-4 mr-2" />
                      Social
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-2">
            {/* Iconos de acción */}
            <Link href="/favoritos">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/mensajes">
              <Button variant="ghost" size="sm" className="relative">
                <MessageSquare className="h-5 w-5" />
                {messagesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {messagesCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/carrito">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Menu de usuario */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>
                        {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-pedidos">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Mis compras</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-ventas">
                      <Store className="mr-2 h-4 w-4" />
                      <span>Mis ventas</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracion">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Panel de Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Menú móvil */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda - Mobile */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Menú móvil */}
      {
        isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Categorías</p>
                {categories.slice(0, 5).map((category) => (
                  <Link key={category.id} href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="block py-2 text-gray-700 hover:text-blue-600">
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link href="/subastas" className="block py-2 text-gray-700 hover:text-blue-600">
                Subastas
              </Link>
              <Link href="/social" className="block py-2 text-gray-700 hover:text-blue-600">
                <Users className="inline h-4 w-4 mr-2" />
                Social
              </Link>
              <Link href="/vender" className="block py-2 text-gray-700 hover:text-blue-600">
                Vender
              </Link>
              {!currentUser && (
                <>
                  <Link href="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                    Iniciar sesión
                  </Link>
                  <Link href="/register" className="block py-2 text-gray-700 hover:text-blue-600">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )
      }
    </header >
  )
}