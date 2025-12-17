'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Folder, FolderOpen, Store, Tag } from 'lucide-react'

interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  parentId?: string | null
  parent?: {
    id: string
    name: string
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

// Mega Menu Component
export function CategoryMenu({ categories, className = '' }: CategoryMenuProps) {
  // En modo Mega Menu, mostramos un grid de categorías principales
  return (
    <div className={`grid grid-cols-4 gap-6 p-4 ${className}`}>
      {categories.map((category) => (
        <div key={category.id} className="group space-y-3">
          <Link
            href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex items-center space-x-2 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
          >
            <span className="text-xl p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              {category.icon || <Folder className="h-5 w-5" />}
            </span>
            <span>{category.name}</span>
          </Link>

          {category.children && category.children.length > 0 && (
            <ul className="space-y-2 pl-11">
              {category.children.slice(0, 5).map((child) => ( // Show top 5 subcategories
                <li key={child.id}>
                  <Link
                    href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}/${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors block"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
              {category.children.length > 5 && (
                <li>
                  <Link
                    href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    Ver todas <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
      ))}
      {/* Banner promocional en el menú */}
      <div className="col-span-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white flex flex-col justify-end relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Store className="h-32 w-32" />
        </div>
        <h3 className="text-xl font-bold relative z-10 mb-2">¡Vende con nosotros!</h3>
        <p className="text-blue-100 text-sm relative z-10 mb-4">Únete a miles de vendedores y haz crecer tu negocio hoy mismo.</p>
        <Link href="/vender">
          <Button size="sm" variant="secondary" className="w-full relative z-10 shadow-lg">
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
    if (category.parentId) {
      return `/categoria/${category.parent?.name?.toLowerCase().replace(/\s+/g, '-')}/${category.name.toLowerCase().replace(/\s+/g, '-')}`
    } else {
      return `/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={getCategoryUrl(category)}
          className="group block"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-all duration-200 hover:border-blue-300 hover:bg-blue-50">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
              {category.icon || <Tag className="h-10 w-10 mx-auto text-blue-600" />}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {category.description}
            </p>
            {category.children && category.children.length > 0 && (
              <div className="text-xs text-blue-600 font-medium">
                {category.children.length} subcategorías
              </div>
            )}
            {category._count && category._count.products > 0 && (
              <Badge variant="secondary" className="mt-2">
                {category._count.products} productos
              </Badge>
            )}
          </div>
        </Link>
      ))}
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
        url: currentCategory.parentId
          ? `/categoria/${currentCategory.parent?.name?.toLowerCase().replace(/\s+/g, '-')}/${currentCategory.name.toLowerCase().replace(/\s+/g, '-')}`
          : `/categoria/${currentCategory.name.toLowerCase().replace(/\s+/g, '-')}`
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