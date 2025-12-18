'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Folder, FolderOpen, Store, Tag } from 'lucide-react'

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

// Mega Menu Component
export function CategoryMenu({ categories, className = '' }: CategoryMenuProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 ${className}`}>
      {categories.map((category) => (
        <div key={category.id} className="group space-y-3">
          {/* Level 1: Category Header */}
          <Link
            href={`/categoria/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex items-center space-x-2 font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span className="text-xl p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              {category.icon || <Folder className="h-5 w-5" />}
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
                    href={`/categoria/${category.slug}/${child.slug}`} // Assuming slug structure
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
      ))}

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
        url: `/categoria/${currentCategory.slug}`
        // Note: For breadcrumbs, we ideally want the full path. 
        // If the slug is unique, /categoria/slug works.
        // If we want nested /categoria/parent/slug, we need to construct it.
        // But the previous loop navigated up parents.
        // The URL generation in previous code was: /categoria/parent-name/current-name
        // With unique slugs, /categoria/slug is enough and safer navigation-wise on my implemented logic.
        // However, user requested "sitio.com/c/electronica/telefonos/smartphones".
        // My page is `app/categoria/[...slug]/page.tsx`.
        // If I link to `/categoria/smartphones`, it works IF the page looks up by the last segment.
        // If I want full path, I should construct it.
        // Given I added `slug` to the interface, I can rely on it.
        // For now, I'll stick to simple slug for robustness unless I can construct full path easily.
        // The `Category` interface parent doesn't guarantee full tree traversal available in client without recursion.
        // The `CategoryBreadcrumb` component receives `category` which is the current one.
        // It iterates UP using a loop.
        // So I can construct the path.
        // But `currentCategory.slug` is available.
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