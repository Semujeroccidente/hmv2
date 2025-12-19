import {
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
    Package,
    Tag
} from 'lucide-react'

// Mapeo de categorías a iconos minimalistas de Lucide
export const categoryIconMap: Record<string, any> = {
    // Electrónica y Tecnología
    'electrónica': Smartphone,
    'electronica': Smartphone,
    'tecnología': Laptop,
    'tecnologia': Laptop,
    'computadoras': Laptop,
    'celulares': Smartphone,
    'teléfonos': Smartphone,
    'telefonos': Smartphone,
    'audio': Music,
    'videojuegos': Gamepad2,
    'gaming': Gamepad2,

    // Hogar y Muebles
    'hogar': Home,
    'muebles': Sofa,
    'decoración': Paintbrush,
    'decoracion': Paintbrush,
    'cocina': Utensils,
    'jardín': Home,
    'jardin': Home,

    // Moda y Accesorios
    'ropa': Shirt,
    'moda': Shirt,
    'calzado': Shirt,
    'accesorios': Watch,
    'joyería': Watch,
    'joyeria': Watch,
    'relojes': Watch,

    // Deportes y Fitness
    'deportes': Dumbbell,
    'fitness': Dumbbell,
    'ejercicio': Dumbbell,
    'outdoor': Dumbbell,

    // Libros y Educación
    'libros': Book,
    'educación': Book,
    'educacion': Book,
    'papelería': Book,
    'papeleria': Book,

    // Bebés y Niños
    'bebés': Baby,
    'bebes': Baby,
    'niños': Baby,
    'ninos': Baby,
    'juguetes': Baby,
    'maternidad': Baby,

    // Herramientas y Mejoras
    'herramientas': Wrench,
    'construcción': Wrench,
    'construccion': Wrench,
    'mejoras': Wrench,

    // Vehículos
    'vehículos': Car,
    'vehiculos': Car,
    'autos': Car,
    'motos': Car,
    'automotriz': Car,

    // Salud y Belleza
    'salud': Heart,
    'belleza': Heart,
    'cuidado personal': Heart,

    // Oficina y Negocios
    'oficina': Briefcase,
    'negocios': Briefcase,
    'papelería': Briefcase,

    // Default
    'default': Package
}

// Función para obtener el icono de una categoría
export function getCategoryIcon(categoryName: string, className: string = 'h-6 w-6') {
    const normalizedName = categoryName.toLowerCase().trim()

    // Buscar coincidencia exacta
    const IconComponent = categoryIconMap[normalizedName] || categoryIconMap['default']

    return <IconComponent className={className} />
}

// Función para obtener el color de una categoría (colores suaves y consistentes)
export function getCategoryColor(index: number): string {
    const colors = [
        'text-blue-600 bg-blue-50 hover:bg-blue-100',
        'text-green-600 bg-green-50 hover:bg-green-100',
        'text-purple-600 bg-purple-50 hover:bg-purple-100',
        'text-orange-600 bg-orange-50 hover:bg-orange-100',
        'text-pink-600 bg-pink-50 hover:bg-pink-100',
        'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
        'text-teal-600 bg-teal-50 hover:bg-teal-100',
        'text-red-600 bg-red-50 hover:bg-red-100',
    ]

    return colors[index % colors.length]
}
