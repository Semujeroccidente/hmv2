'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

const breadcrumbMap: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/usuarios': 'Usuarios',
    '/admin/productos': 'Productos',
    '/admin/subastas': 'Subastas',
    '/admin/ordenes': 'Órdenes',
    '/admin/reportes': 'Reportes',
    '/admin/categorias': 'Categorías',
    '/admin/analytics': 'Analytics',
    '/admin/configuracion': 'Configuración'
}

export function AdminHeader() {
    const pathname = usePathname()

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean)
        const breadcrumbs = [{ name: 'Admin', href: '/admin' }]

        let currentPath = ''
        for (let i = 1; i < paths.length; i++) {
            currentPath += `/${paths[i]}`
            const fullPath = `/admin${currentPath}`
            const name = breadcrumbMap[fullPath] || paths[i]
            breadcrumbs.push({ name, href: fullPath })
        }

        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs()

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
                <nav className="flex items-center gap-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.href} className="flex items-center gap-2">
                            {index > 0 && <span className="text-gray-400">/</span>}
                            {index === breadcrumbs.length - 1 ? (
                                <span className="font-medium text-gray-900">{crumb.name}</span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {crumb.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Buscar..."
                        className="pl-10 w-64"
                    />
                </div>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                                3
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">Nuevo reporte recibido</p>
                                <p className="text-xs text-gray-500">Hace 5 minutos</p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">Producto pendiente de aprobación</p>
                                <p className="text-xs text-gray-500">Hace 1 hora</p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">Nueva orden creada</p>
                                <p className="text-xs text-gray-500">Hace 2 horas</p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-blue-600">
                            Ver todas las notificaciones
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
