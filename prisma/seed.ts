import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de la base de datos...')

  // Crear categorías
  const electronica = await prisma.category.upsert({
    where: { slug: 'electronica' },
    update: {},
    create: {
      name: 'Electrónica',
      slug: 'electronica',
      description: 'Dispositivos electrónicos, gadgets y tecnología',
      icon: '📱'
    }
  })

  const ropa = await prisma.category.upsert({
    where: { slug: 'ropa-y-accesorios' },
    update: {},
    create: {
      name: 'Ropa y Accesorios',
      slug: 'ropa-y-accesorios',
      description: 'Vestimenta, calzado y accesorios',
      icon: '👕'
    }
  })

  const hogar = await prisma.category.upsert({
    where: { slug: 'hogar-y-jardin' },
    update: {},
    create: {
      name: 'Hogar y Jardín',
      slug: 'hogar-y-jardin',
      description: 'Artículos para el hogar y jardinería',
      icon: '🏠'
    }
  })

  const vehiculos = await prisma.category.upsert({
    where: { slug: 'vehiculos' },
    update: {},
    create: {
      name: 'Vehículos',
      slug: 'vehiculos',
      description: 'Automóviles, motos y accesorios',
      icon: '🚗'
    }
  })

  const propiedades = await prisma.category.upsert({
    where: { slug: 'propiedades' },
    update: {},
    create: {
      name: 'Propiedades',
      slug: 'propiedades',
      description: 'Bienes raíces y alquileres',
      icon: '🏢'
    }
  })

  const servicios = await prisma.category.upsert({
    where: { slug: 'servicios' },
    update: {},
    create: {
      name: 'Servicios',
      slug: 'servicios',
      description: 'Servicios profesionales y freelancers',
      icon: '💼'
    }
  })

  // Crear usuarios de ejemplo
  const hashedPassword = await bcrypt.hash('password123', 12)

  const vendedor1 = await prisma.user.upsert({
    where: { email: 'juan@ejemplo.com' },
    update: { password: hashedPassword }, // Update password just in case
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

  const vendedor2 = await prisma.user.upsert({
    where: { email: 'maria@ejemplo.com' },
    update: { password: hashedPassword },
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

  const comprador = await prisma.user.upsert({
    where: { email: 'carlos@ejemplo.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Carlos Rodríguez',
      email: 'carlos@ejemplo.com',
      password: hashedPassword,
      role: 'USER',
      rating: 4.5
    }
  })

  // Crear usuario ADMIN
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hondumarket.com' },
    update: { password: adminPassword },
    create: {
      name: 'Administrador',
      email: 'admin@hondumarket.com',
      password: adminPassword,
      role: 'ADMIN',
      rating: 5.0,
      bio: 'Administrador del sistema HonduMarket'
    }
  })

  console.log('✅ Usuarios creados:')
  console.log('   - Vendedor: juan@ejemplo.com (password123)')
  console.log('   - Vendedora: maria@ejemplo.com (password123)')
  console.log('   - Comprador: carlos@ejemplo.com (password123)')
  console.log('   - 🔐 ADMIN: admin@hondumarket.com (admin123)')
  console.log('')

  // Crear productos de ejemplo
  // Use try-catch for products to avoid failing if they exist (since we use createMany which doesn't support upsert easily/natively for many)
  // Actually, better to check if products exist or just delete them and recreate?
  // Deleting is risky. Let's just create if not exists.

  const productsData = [
    {
      title: 'iPhone 13 Pro Max - Excelente Estado',
      description: 'iPhone 13 Pro Max de 256GB, color azul pacífico. Excelente estado, muy poco uso. Incluye caja, cargador y funda original.',
      price: 25000,
      originalPrice: 30000,
      condition: 'USED',
      stock: 1,
      categoryId: electronica.id,
      sellerId: vendedor1.id,
      slug: 'iphone-13-pro-max-excelente-estado',
      images: JSON.stringify(['/placeholder-product.svg']),
      tags: JSON.stringify(['iphone', 'apple', 'smartphone', 'celular']),
      views: 245,
      favoritesCount: 18
    },
    {
      title: 'Laptop Dell Inspiron 15',
      description: 'Laptop Dell Inspiron 15, Intel i5, 8GB RAM, 512GB SSD. Pantalla Full HD de 15 pulgadas. Como nueva, con garantía.',
      price: 18000,
      condition: 'NEW',
      stock: 3,
      categoryId: electronica.id,
      sellerId: vendedor2.id,
      slug: 'laptop-dell-inspiron-15',
      images: JSON.stringify(['/placeholder-product.svg']),
      tags: JSON.stringify(['laptop', 'dell', 'computadora', 'notebook']),
      views: 132,
      favoritesCount: 7
    },
    {
      title: 'Zapatillas Nike Air Max - Nuevas',
      description: 'Zapatillas Nike Air Max 270, completamente nuevas en caja. Talla 42. Color negro y blanco. Modelo original.',
      price: 3500,
      originalPrice: 4500,
      condition: 'NEW',
      stock: 2,
      categoryId: ropa.id,
      sellerId: vendedor2.id,
      slug: 'zapatillas-nike-air-max-nuevas',
      images: JSON.stringify(['/placeholder-product.svg']),
      tags: JSON.stringify(['nike', 'zapatillas', 'calzado', 'deportivo']),
      views: 89,
      favoritesCount: 12
    },
    {
      title: 'Sofá de 3 Plazas - Cuero Genuino',
      description: 'Sofá de 3 plazas en cuero genuino color marrón. Excelente estado, muy bien cuidado. Medidas: 2.5m x 0.9m.',
      price: 12000,
      condition: 'REFURBISHED',
      stock: 1,
      categoryId: hogar.id,
      sellerId: vendedor1.id,
      slug: 'sofa-3-plazas-cuero-genuino',
      images: JSON.stringify(['/placeholder-product.svg']),
      tags: JSON.stringify(['sofa', 'muebles', 'cuero', 'sala']),
      views: 167,
      favoritesCount: 9
    },
    {
      title: 'Toyota Corolla 2019',
      description: 'Toyota Corolla 2019, automático, 45,000 km. Color plateado. Excelente estado, mantenimiento al día. Aire acondicionado, vidrios eléctricos.',
      price: 285000,
      condition: 'USED',
      stock: 1,
      categoryId: vehiculos.id,
      sellerId: vendedor1.id,
      slug: 'toyota-corolla-2019',
      images: JSON.stringify(['/placeholder-product.svg']),
      tags: JSON.stringify(['toyota', 'corolla', 'auto', 'sedan']),
      views: 523,
      favoritesCount: 34
    },
    {
      title: 'Diseño Logo Profesional',
      description: 'Servicio de diseño de logo profesional. Incluye 3 propuestas iniciales, revisiones ilimitadas y archivos finales en todos los formatos.',
      price: 1500,
      condition: 'NEW',
      stock: 999,
      categoryId: servicios.id,
      sellerId: vendedor2.id,
      slug: 'disenyo-logo-profesional',
      images: JSON.stringify(['/placeholder-product.svg']),
      tags: JSON.stringify(['diseño', 'logo', 'branding', 'grafico']),
      views: 78,
      favoritesCount: 5
    }
  ]

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    })
  }

  // Crear algunas subastas
  const macbook = await prisma.product.findFirst({
    where: { title: { contains: 'Laptop Dell' } }
  })

  if (macbook) {
    // Check if auction already exists for this product to avoid duplicates if re-running
    // Auction doesn't have a unique slug, but productId usually unique for active auctions?
    // Just creating one is fine for now, or check count.
    const existingAuction = await prisma.auction.findFirst({
      where: { productId: macbook.id }
    })

    if (!existingAuction) {
      await prisma.auction.create({
        data: {
          productId: macbook.id,
          startingPrice: 15000,
          currentPrice: 18500,
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días
          status: 'ACTIVE'
        }
      })
    }
  }

  console.log('Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })