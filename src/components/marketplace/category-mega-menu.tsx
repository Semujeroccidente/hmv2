'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight, X, Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
    id: string
    name: string
    slug: string
    children?: Category[]
}

interface CategoryMegaMenuProps {
    categories: Category[]
}

export function CategoryMegaMenu({ categories }: CategoryMegaMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const menuRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                triggerRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsOpen(true)
        }
    }

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsOpen(false)
        }
    }

    const handleClick = () => {
        if (isMobile) {
            setIsOpen(!isOpen)
        }
    }

    // Calcular número de columnas basado en cantidad de categorías
    const getColumnsCount = () => {
        if (categories.length <= 4) return 2
        if (categories.length <= 8) return 3
        return 4
    }

    const columnsCount = getColumnsCount()
    const categoriesPerColumn = Math.ceil(categories.length / columnsCount)
    const columns: Category[][] = []

    for (let i = 0; i < columnsCount; i++) {
        const start = i * categoriesPerColumn
        const end = start + categoriesPerColumn
        columns.push(categories.slice(start, end))
    }

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                ref={triggerRef}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                className={cn(
                    "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg",
                    "text-white transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isOpen ? "bg-white/10" : "hover:bg-white/10"
                )}
                style={{
                    color: isOpen ? '#00A896' : '#ffffff'
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {isMobile ? (
                    <Menu className="h-5 w-5" />
                ) : (
                    <>
                        Comprar por categoría
                        <ChevronDown className={cn(
                            "ml-1.5 h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )} />
                    </>
                )}
            </button>

            {/* Desktop Mega Menu */}
            {!isMobile && isOpen && (
                <div
                    ref={menuRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="absolute left-0 top-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden"
                    style={{
                        width: 'max-content',
                        maxWidth: 'min(90vw, 900px)',
                        minWidth: '600px'
                    }}
                >
                    {/* Header con borde superior de marca */}
                    <div
                        className="h-1"
                        style={{
                            background: 'linear-gradient(to right, #003366, #00A896, #FF7F00)'
                        }}
                    ></div>

                    <div className={cn(
                        "p-8 grid gap-8",
                        columnsCount === 2 && "grid-cols-2",
                        columnsCount === 3 && "grid-cols-3",
                        columnsCount === 4 && "grid-cols-4"
                    )}>
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="space-y-6 min-w-[140px]">
                                {column.map((category) => (
                                    <div key={category.id} className="space-y-3">
                                        {/* Category Title */}
                                        <Link
                                            href={`/categoria/${category.slug}`}
                                            className="group block font-bold text-sm transition-colors duration-200 pb-2 border-b-2 border-gray-100"
                                            style={{ color: '#003366' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#00A896'
                                                e.currentTarget.querySelector('.border-indicator')?.setAttribute('style', 'border-color: #00A896')
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#003366'
                                                e.currentTarget.querySelector('.border-indicator')?.setAttribute('style', 'border-color: #f3f4f6')
                                            }}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="flex items-center justify-between border-indicator" style={{ borderColor: '#f3f4f6' }}>
                                                {category.name}
                                                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            </span>
                                        </Link>

                                        {/* Subcategories */}
                                        {category.children && category.children.length > 0 && (
                                            <ul className="space-y-2 pl-1">
                                                {category.children.slice(0, 5).map((child) => (
                                                    <li key={child.id}>
                                                        <Link
                                                            href={`/categoria/${category.slug}/${child.slug}`}
                                                            className="group/sub flex items-center text-xs text-gray-600 transition-all duration-200 py-1.5 px-2 rounded-lg hover:pl-3"
                                                            style={{
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#E6F7F5'
                                                                e.currentTarget.style.color = '#00A896'
                                                                const dot = e.currentTarget.querySelector('.dot-indicator')
                                                                if (dot) (dot as HTMLElement).style.backgroundColor = '#00A896'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent'
                                                                e.currentTarget.style.color = '#4B5563'
                                                                const dot = e.currentTarget.querySelector('.dot-indicator')
                                                                if (dot) (dot as HTMLElement).style.backgroundColor = '#D1D5DB'
                                                            }}
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            <span
                                                                className="dot-indicator w-1 h-1 rounded-full mr-2 transition-colors duration-200"
                                                                style={{ backgroundColor: '#D1D5DB' }}
                                                            ></span>
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                                {category.children.length > 5 && (
                                                    <li>
                                                        <Link
                                                            href={`/categoria/${category.slug}`}
                                                            className="flex items-center text-xs font-medium py-1.5 px-2 rounded-lg transition-all duration-200"
                                                            style={{ color: '#003366' }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#EFF6FF'
                                                                e.currentTarget.style.color = '#00A896'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent'
                                                                e.currentTarget.style.color = '#003366'
                                                            }}
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            Ver todas ({category.children.length}) →
                                                        </Link>
                                                    </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Footer con link a todas las categorías */}
                    <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                        <Link
                            href="/categorias"
                            className="text-sm font-semibold transition-colors duration-200 flex items-center justify-center group"
                            style={{ color: '#003366' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#00A896'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#003366'}
                            onClick={() => setIsOpen(false)}
                        >
                            Ver todas las categorías
                            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobile && isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200">
                    <div
                        ref={menuRef}
                        className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl animate-in slide-in-from-left duration-300 flex flex-col"
                    >
                        {/* Mobile Header */}
                        <div
                            className="flex items-center justify-between p-4 border-b border-gray-200"
                            style={{ backgroundColor: '#003366' }}
                        >
                            <h2 className="text-lg font-bold text-white">Categorías</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg transition-colors text-white"
                                style={{
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                aria-label="Cerrar menú"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Mobile Categories - Scrollable */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <div className="p-4 space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="border-b border-gray-100 last:border-0">
                                        {/* Category Header */}
                                        <button
                                            onClick={() => toggleCategory(category.id)}
                                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-left"
                                        >
                                            <span className="font-semibold text-gray-900 text-sm">{category.name}</span>
                                            <ChevronRight
                                                className={cn(
                                                    "h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
                                                    expandedCategories.has(category.id) && "rotate-90"
                                                )}
                                            />
                                        </button>

                                        {/* Subcategories */}
                                        {expandedCategories.has(category.id) && category.children && (
                                            <div className="bg-gray-50 rounded-lg mb-2 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                                <Link
                                                    href={`/categoria/${category.slug}`}
                                                    className="block py-2.5 px-4 text-xs font-medium transition-colors duration-200 border-b border-gray-200"
                                                    style={{ color: '#003366' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = '#EFF6FF'
                                                        e.currentTarget.style.color = '#00A896'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent'
                                                        e.currentTarget.style.color = '#003366'
                                                    }}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Ver todo en {category.name} →
                                                </Link>
                                                {category.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={`/categoria/${category.slug}/${child.slug}`}
                                                        className="flex items-center py-2.5 pl-6 pr-4 text-xs text-gray-700 transition-all duration-200"
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#ffffff'
                                                            e.currentTarget.style.color = '#00A896'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent'
                                                            e.currentTarget.style.color = '#374151'
                                                        }}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2.5"></span>
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Footer */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <Link
                                href="/categorias"
                                className="block w-full py-3 px-4 text-white text-center font-semibold rounded-lg transition-colors duration-200"
                                style={{ backgroundColor: '#003366' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00A896'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                                onClick={() => setIsOpen(false)}
                            >
                                Ver todas las categorías
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
