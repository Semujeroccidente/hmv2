'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Store,
  Tag,
  Smartphone,
  Laptop,
  Home,
  Shirt,
  Dumbbell,
  Book,
  Gamepad2,
  Baby,
  Wrench,
  Car,
  Sofa,
  Watch,
  Music,
  Paintbrush,
  Utensils,
  Heart,
  Briefcase,
  Package
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string | null
  parent?: {
    id: string
    name: string
    slug?: string
  }
  children?: Category[]
  _count?: {
    products: number
  }
}

interface CategoryMenuProps {
  categories: Category[]
  className?: string
}

// Helper function to get category icon
function getCategoryIcon(categoryName: string) {
  const iconMap: Record<string, any> = {
    'electrónica': Smartphone,
    'electronica': Smartphone,
    'tecnología': Laptop,
    'tecnologia': Laptop,
    'computadoras': Laptop,
    'celulares': Smartphone,
    'hogar': Home,
    'moda': Shirt,
    'ropa': Shirt,
    'deportes': Dumbbell,
    'libros': Book,
    'bebés': Baby,
    'bebes': Baby,
    'herramientas': Wrench,
    'vehículos': Car,
    'vehiculos': Car,
    'salud': Heart,
    'belleza': Heart,
    'oficina': Briefcase,
    'muebles': Sofa,
    'juguetes': Gamepad2,
    'música': Music,
    'musica': Music,
    'cocina': Utensils,
    'decoración': Paintbrush,
    'decoracion': Paintbrush,
    'relojes': Watch,
    'accesorios': Watch,
  }

  const normalizedName = categoryName.toLowerCase().trim()
  return iconMap[normalizedName] || Package
}

// Helper function to get category color
function getCategoryColor(index: number): string {
  const colors = [
    'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
    'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
    'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
    'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200',
    'text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200',
    'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200',
    'text-red-600 bg-red-50 hover:bg-red-100 border-red-200',
  ]

  return colors[index % colors.length]
}

// Mega Menu Component
export function CategoryMenu({ categories, className = '' }: CategoryMenuProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 ${className}`}>
      {categories.map((category, index) => {
        const IconComponent = getCategoryIcon(category.name)
        const colorClass = getCategoryColor(index)

        return (
          <div key={category.id} className="group space-y-3">
            {/* Level 1: Category Header */}
            <Link
              href={`/categoria/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center space-x-2 font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span className={`p-2 rounded-lg transition-colors ${colorClass}`}>
                <IconComponent className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span>{category.name}</span>
            </Link>

            {/* Level 2 & 3 */}
            {category.children && category.children.length > 0 && (
              <div className="pl-2 space-y-4">
                {category.children.slice(0, 4).map((child) => (
                  <div key={child.id} className="space-y-1">
                    {/* Level 2: Subcategory Title */}
                    <Link
                      href={`/categoria/${category.slug}/${child.slug}`}
                      className="font-semibold text-sm text-gray-800 hover:text-blue-600 block"
                    >
                      {child.name}
                    </Link>

                    {/* Level 3: Sub-items */}
                    {child.children && child.children.length > 0 && (
                      <ul className="pl-2 space-y-1 border-l-2 border-gray-100">
                        {child.children.slice(0, 5).map((grandChild) => (
                          <li key={grandChild.id}>
                            <Link
                              href={`/categoria/${category.slug}/${child.slug}/${grandChild.slug}`}
                              className="text-xs text-gray-500 hover:text-blue-500 block py-0.5"
                            >
                              {grandChild.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* View All Details */}
                <Link
                  href={`/categoria/${category.slug}`}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center pt-2"
                >
                  Ver todo {category.name} <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            )}
          </div>
        )
      })}

      {/* Banner promocional */}
      <div className="col-span-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white flex flex-col justify-end relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Store className="h-32 w-32" />
        </div>
        <h3 className="text-xl font-bold relative z-10 mb-2">¡Vende con nosotros!</h3>
        <p className="text-blue-100 text-sm relative z-10 mb-4">Únete a miles de vendedores y haz crecer tu negocio.</p>
        <Link href="/vender">
          <Button size="sm" variant="secondary" className="w-full relative z-10 shadow-lg text-blue-700 font-bold hover:bg-white">
            Empezar a vender
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Componente para mostrar categorías en formato de grid (para página principal)
export function CategoryGrid({ categories }: { categories: Category[] }) {
  const getCategoryUrl = (category: Category) => {
    const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')

    if (category.parentId && category.parent) {
      const parentSlug = category.parent.slug || category.parent.name.toLowerCase().replace(/\s+/g, '-')
      return `/categoria/${parentSlug}/${categorySlug}`
    } else {
      return `/categoria/${categorySlug}`
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => {
        const IconComponent = getCategoryIcon(category.name)
        const colorClass = getCategoryColor(index)

        return (
          <Link
            key={category.id}
            href={getCategoryUrl(category)}
            className="group block"
          >
            <div className={`bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-all duration-200 ${colorClass}`}>
              <div className="mb-4 flex items-center justify-center">
                <div className="p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className="h-8 w-8" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-current transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}
              {category.children && category.children.length > 0 && (
                <div className="text-xs font-medium opacity-75">
                  {category.children.length} subcategorías
                </div>
              )}
              {category._count && category._count.products > 0 && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {category._count.products} productos
                </Badge>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// Componente para breadcrumbs de navegación
export function CategoryBreadcrumb({ category }: { category: Category }) {
  const getBreadcrumbItems = () => {
    const items: { id: string; name: string; url: string }[] = []
    let currentCategory: Category | undefined = category

    while (currentCategory) {
      items.unshift({
        id: currentCategory.id,
        name: currentCategory.name,
        url: `/categoria/${currentCategory.slug}`
      })

      if (currentCategory.parent) {
        currentCategory = {
          id: currentCategory.parent.id,
          name: currentCategory.parent.name,
          parent: undefined
        }
      } else {
        currentCategory = undefined
      }
    }

    return items
  }

  const breadcrumbItems = getBreadcrumbItems()

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link href="/" className="hover:text-blue-600 transition-colors">
        Inicio
      </Link>
      <span>/</span>
      {breadcrumbItems.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          {index > 0 && <span>/</span>}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.name}</span>
          ) : (
            <Link href={item.url} className="hover:text-blue-600 transition-colors">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}