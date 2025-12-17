import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    console.log('Iniciando seed de la base de datos...')

    // Crear categorías
    const categorias = [
      { name: 'Electrónica', description: 'Dispositivos electrónicos, gadgets y tecnología', icon: '📱' },
      { name: 'Ropa y Accesorios', description: 'Vestimenta, calzado y accesorios', icon: '👕' },
      { name: 'Hogar y Jardín', description: 'Artículos para el hogar y jardinería', icon: '🏠' },
      { name: 'Vehículos', description: 'Automóviles, motos y accesorios', icon: '🚗' },
      { name: 'Propiedades', description: 'Bienes raíces y alquileres', icon: '🏢' },
      { name: 'Servicios', description: 'Servicios profesionales y freelancers', icon: '💼' }
    ]

    for (const cat of categorias) {
      await db.category.upsert({
        where: { name: cat.name },
        update: cat,
        create: cat
      })
    }

    // Crear usuarios de ejemplo
    const hashedPassword = await bcrypt.hash('password123', 12)

    const vendedor1 = await db.user.upsert({
      where: { email: 'juan@ejemplo.com' },
      update: {},
      create: {
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: hashedPassword,
        role: 'SELLER',
        rating: 4.8,
        salesCount: 45,
        bio: 'Vendedor especializado en electrónica y tecnología'
      }
    })

    const vendedor2 = await db.user.upsert({
      where: { email: 'maria@ejemplo.com' },
      update: {},
      create: {
        name: 'María González',
        email: 'maria@ejemplo.com',
        password: hashedPassword,
        role: 'SELLER',
        rating: 4.9,
        salesCount: 132,
        bio: 'Experta en moda y accesorios'
      }
    })

    // Obtener categorías creadas
    const electronica = await db.category.findUnique({ where: { name: 'Electrónica' } })
    const ropa = await db.category.findUnique({ where: { name: 'Ropa y Accesorios' } })
    const hogar = await db.category.findUnique({ where: { name: 'Hogar y Jardín' } })

    if (electronica && ropa && hogar) {
      // Crear productos de ejemplo
      const productos = [
        {
          title: 'iPhone 13 Pro Max - Excelente Estado',
          description: 'iPhone 13 Pro Max de 256GB, color azul pacífico. Excelente estado, muy poco uso.',
          price: 25000,
          originalPrice: 30000,
          condition: 'USED' as const,
          stock: 1,
          categoryId: electronica.id,
          sellerId: vendedor1.id,
          slug: 'iphone-13-pro-max-excelente-estado',
          images: JSON.stringify(['/placeholder-product.svg']),
          tags: JSON.stringify(['iphone', 'apple', 'smartphone']),
          views: 245,
          favoritesCount: 18
        },
        {
          title: 'Laptop Dell Inspiron 15',
          description: 'Laptop Dell Inspiron 15, Intel i5, 8GB RAM, 512GB SSD. Como nueva.',
          price: 18000,
          condition: 'NEW' as const,
          stock: 3,
          categoryId: electronica.id,
          sellerId: vendedor2.id,
          slug: 'laptop-dell-inspiron-15',
          images: JSON.stringify(['/placeholder-product.svg']),
          tags: JSON.stringify(['laptop', 'dell', 'computadora']),
          views: 132,
          favoritesCount: 7
        },
        {
          title: 'Zapatillas Nike Air Max - Nuevas',
          description: 'Zapatillas Nike Air Max 270, completamente nuevas en caja. Talla 42.',
          price: 3500,
          originalPrice: 4500,
          condition: 'NEW' as const,
          stock: 2,
          categoryId: ropa.id,
          sellerId: vendedor2.id,
          slug: 'zapatillas-nike-air-max-nuevas',
          images: JSON.stringify(['/placeholder-product.svg']),
          tags: JSON.stringify(['nike', 'zapatillas', 'calzado']),
          views: 89,
          favoritesCount: 12
        },
        {
          title: 'Sofá de 3 Plazas - Cuero Genuino',
          description: 'Sofá de 3 plazas en cuero genuino color marrón. Excelente estado.',
          price: 12000,
          condition: 'REFURBISHED' as const,
          stock: 1,
          categoryId: hogar.id,
          sellerId: vendedor1.id,
          slug: 'sofa-3-plazas-cuero-genuino',
          images: JSON.stringify(['/placeholder-product.svg']),
          tags: JSON.stringify(['sofa', 'muebles', 'cuero']),
          views: 167,
          favoritesCount: 9
        }
      ]

      for (const prod of productos) {
        await db.product.upsert({
          where: { slug: prod.slug },
          update: prod,
          create: prod
        })
      }
    }

    console.log('Seed completado exitosamente!')

    return NextResponse.json({
      message: 'Seed completado exitosamente',
      data: {
        categorias: categorias.length,
        usuarios: 2,
        productos: 4
      }
    })

  } catch (error) {
    console.error('Error en el seed:', error)
    return NextResponse.json(
      { error: 'Error en el seed', details: error.message },
      { status: 500 }
    )
  }
}