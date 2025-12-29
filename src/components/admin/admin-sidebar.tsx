'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Package,
    Gavel,
    ShoppingCart,
    AlertTriangle,
    FolderTree,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        badge: null
    },
    {
        name: 'Usuarios',
        href: '/admin/usuarios',
        icon: Users,
        badge: null
    },
    {
        name: 'Productos',
        href: '/admin/productos',
        icon: Package,
        badge: '12'
    },
    {
        name: 'Subastas',
        href: '/admin/subastas',
        icon: Gavel,
        badge: null
    },
    {
        name: 'Órdenes',
        href: '/admin/ordenes',
        icon: ShoppingCart,
        badge: '5'
    },
    {
        name: 'Reportes',
        href: '/admin/reportes',
        icon: AlertTriangle,
        badge: '3'
    },
    {
        name: 'Categorías',
        href: '/admin/categorias',
        icon: FolderTree,
        badge: null
    },
    {
        name: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        badge: null
    },
    {
        name: 'Configuración',
        href: '/admin/configuracion',
        icon: Settings,
        badge: null
    }
]

export function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <div
            className={cn(
                'flex flex-col bg-gray-900 text-white transition-all duration-300',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                {!collapsed && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">HM</span>
                        </div>
                        <span className="font-bold text-lg">Admin Panel</span>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-800">
                {!collapsed ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">AD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-gray-400 truncate">admin@hondumarket.com</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    )
}
