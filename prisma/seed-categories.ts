import { db } from '@/lib/db'

const categories = [
  // Electrónica
  {
    name: 'Electrónica',
    description: 'Dispositivos electrónicos, gadgets y tecnología',
    icon: '📱',
    children: [
      { name: 'Celulares', description: 'Smartphones y teléfonos móviles', icon: '📱' },
      { name: 'Tablets', description: 'Tablets y iPads', icon: '📱' },
      { name: 'Computadoras', description: 'Laptops y computadoras de escritorio', icon: '💻' },
      { name: 'Accesorios de Computación', description: 'Teclados, mouse, monitores', icon: '⌨️' },
      { name: 'Audio', description: 'Auriculares, parlantes, sistemas de audio', icon: '🎧' },
      { name: 'Gaming', description: 'Consolas, videojuegos y accesorios', icon: '🎮' },
      { name: 'Cámaras', description: 'Cámaras fotográficas y de video', icon: '📷' },
      { name: 'Smart TV', description: 'Televisores inteligentes y accesorios', icon: '📺' },
      { name: 'Wearables', description: 'Smartwatches y dispositivos portátiles', icon: '⌚' },
      { name: 'Drones', description: 'Drones y accesorios para vuelo', icon: '🚁' }
    ]
  },
  
  // Ropa y Accesorios
  {
    name: 'Ropa y Accesorios',
    description: 'Moda, vestimenta y accesorios personales',
    icon: '👕',
    children: [
      { name: 'Ropa de Hombre', description: 'Camisas, pantalones, ropa masculina', icon: '👔' },
      { name: 'Ropa de Mujer', description: 'Vestidos, blusas, ropa femenina', icon: '👗' },
      { name: 'Ropa Infantil', description: 'Ropa para niños y bebés', icon: '👶' },
      { name: 'Calzado', description: 'Zapatos, botas, sandalias', icon: '👟' },
      { name: 'Bolsos y Carteras', description: 'Bolsos, mochilas, carteras', icon: '👜' },
      { name: 'Joyería', description: 'Anillos, collares, joyas', icon: '💍' },
      { name: 'Relojes', description: 'Relojes de pulsera y bolsillo', icon: '⌚' },
      { name: 'Gafas', description: 'Gafas de sol y graduadas', icon: '🕶️' },
      { name: 'Ropa Deportiva', description: 'Ropa para hacer ejercicio', icon: '🏃' },
      { name: 'Trajes de Baño', description: 'Trajes de baño y ropa de playa', icon: '🏖️' }
    ]
  },
  
  // Hogar y Jardín
  {
    name: 'Hogar y Jardín',
    description: 'Artículos para el hogar, decoración y jardinería',
    icon: '🏠',
    children: [
      { name: 'Muebles', description: 'Sofás, camas, mesas, sillas', icon: '🛋️' },
      { name: 'Electrodomésticos', description: 'Neveras, lavadoras, cocinas', icon: '🔌' },
      { name: 'Decoración', description: 'Cuadros, alfombras, decoración', icon: '🖼️' },
      { name: 'Cocina', description: 'Utensilios de cocina y electrodomésticos', icon: '🍳' },
      { name: 'Baño', description: 'Accesorios y muebles de baño', icon: '🚿' },
      { name: 'Jardín', description: 'Herramientas de jardinería y plantas', icon: '🌱' },
      { name: 'Iluminación', description: 'Lámparas y sistemas de iluminación', icon: '💡' },
      { name: 'Organización', description: 'Cajas, estanterías, organizadores', icon: '📦' },
      { name: 'Limpieza', description: 'Productos y herramientas de limpieza', icon: '🧹' },
      { name: 'Seguridad', description: 'Cámaras, alarmas, seguridad del hogar', icon: '🔒' }
    ]
  },
  
  // Vehículos
  {
    name: 'Vehículos',
    description: 'Automóviles, motos y accesorios vehiculares',
    icon: '🚗',
    children: [
      { name: 'Carros', description: 'Automóviles nuevos y usados', icon: '🚗' },
      { name: 'Motos', description: 'Motocicletas y scooters', icon: '🏍️' },
      { name: 'Camiones y Vans', description: 'Vehículos comerciales y de carga', icon: '🚚' },
      { name: 'Accesorios de Auto', description: 'Accesorios y partes para vehículos', icon: '🔧' },
      { name: 'Neumáticos', description: 'Llantas y neumáticos', icon: '🛞' },
      { name: 'Audio Vehicular', description: 'Sistemas de audio para autos', icon: '📻' },
      { name: 'GPS y Navegación', description: 'Sistemas de navegación GPS', icon: '🗺️' },
      { name: 'Mantenimiento', description: 'Herramientas y productos de mantenimiento', icon: '🔧' },
      { name: 'Bicicletas', description: 'Bicicletas y accesorios', icon: '🚲' },
      { name: 'Barcos y Acuáticos', description: 'Lanchas, motores de agua', icon: '⛵' }
    ]
  },
  
  // Propiedades
  {
    name: 'Propiedades',
    description: 'Bienes raíces, alquiler y venta de inmuebles',
    icon: '🏢',
    children: [
      { name: 'Casas en Venta', description: 'Casas y residencias en venta', icon: '🏡' },
      { name: 'Apartamentos', description: 'Apartamentos y condominios', icon: '🏢' },
      { name: 'Terrenos', description: 'Terrenos y lotes urbanos/rurales', icon: '🏞️' },
      { name: 'Alquiler Residencial', description: 'Propiedades en alquiler', icon: '🔑' },
      { name: 'Alquiler Comercial', description: 'Oficinas y locales comerciales', icon: '🏪' },
      { name: 'Fincas y Ranchos', description: 'Propiedades rurales y agrícolas', icon: '🌾' },
      { name: 'Propiedades de Lujo', description: 'Mansiones y propiedades premium', icon: '🏰' },
      { name: 'Vacacionales', description: 'Casas de vacaciones y temporales', icon: '🏖️' },
      { name: 'Inversiones', description: 'Propiedades para inversión', icon: '💰' },
      { name: 'Alquiler de Vacaciones', description: 'Propiedades para alquiler temporal', icon: '🗓️' }
    ]
  },
  
  // Servicios
  {
    name: 'Servicios',
    description: 'Servicios profesionales y técnicos',
    icon: '💼',
    children: [
      { name: 'Reparaciones', description: 'Servicios de reparación técnica', icon: '🔧' },
      { name: 'Construcción', description: 'Servicios de construcción y remodelación', icon: '🏗️' },
      { name: 'Diseño', description: 'Diseño gráfico, web, interior', icon: '🎨' },
      { name: 'Consultoría', description: 'Servicios de consultoría profesional', icon: '💼' },
      { name: 'Educación', description: 'Clases particulares y capacitación', icon: '📚' },
      { name: 'Salud y Belleza', description: 'Servicios de salud, spa y belleza', icon: '💆' },
      { name: 'Transporte', description: 'Servicios de transporte y mudanza', icon: '🚚' },
      { name: 'Eventos', description: 'Organización de eventos y catering', icon: '🎉' },
      { name: 'Legales', description: 'Servicios legales y notariales', icon: '⚖️' },
      { name: 'Tecnología', description: 'Servicios de TI y soporte técnico', icon: '💻' }
    ]
  },
  
  // Deportes y Aire Libre
  {
    name: 'Deportes y Aire Libre',
    description: 'Equipamiento deportivo y artículos para actividades al aire libre',
    icon: '⚽',
    children: [
      { name: 'Fútbol', description: 'Balones, uniformes, accesorios de fútbol', icon: '⚽' },
      { name: 'Béisbol', description: 'Guantes, bates, equipamiento de béisbol', icon: '⚾' },
      { name: 'Basketball', description: 'Balones, aros, equipamiento de basketball', icon: '🏀' },
      { name: 'Camping', description: 'Tiendas de campaña, equipo de campamento', icon: '⛺' },
      { name: 'Pesca', description: 'Cañas, aparejos, equipo de pesca', icon: '🎣' },
      { name: 'Fitness', description: 'Equipamiento para gimnasio y ejercicio', icon: '💪' },
      { name: 'Ciclismo', description: 'Bicicletas y accesorios para ciclismo', icon: '🚴' },
      { name: 'Deportes Acuáticos', description: 'Equipamiento para deportes acuáticos', icon: '🏊' },
      { name: 'Caza', description: 'Equipamiento para caza y tiro', icon: '🏹' },
      { name: 'Extremo', description: 'Equipamiento para deportes extremos', icon: '🪂' }
    ]
  },
  
  // Libros y Medios
  {
    name: 'Libros y Medios',
    description: 'Libros, música, películas y contenido digital',
    icon: '📚',
    children: [
      { name: 'Libros', description: 'Libros nuevos y usados', icon: '📖' },
      { name: 'Textos Universitarios', description: 'Libros de texto y académicos', icon: '📓' },
      { name: 'Comics y Manga', description: 'Cómics, novelas gráficas y manga', icon: '📚' },
      { name: 'Música', description: 'CDs, vinilos, instrumentos musicales', icon: '🎵' },
      { name: 'Películas', description: 'DVDs, Blu-ray, películas', icon: '🎬' },
      { name: 'Videojuegos', description: 'Juegos para diferentes consolas', icon: '🎮' },
      { name: 'Libros Electrónicos', description: 'e-books y lectores digitales', icon: '📱' },
      { name: 'Arte y Coleccionables', description: 'Arte, cómics raros, colecciones', icon: '🎨' },
      { name: 'Revistas', description: 'Revistas y publicaciones periódicas', icon: '📰' },
      { name: 'Software', description: 'Programas y aplicaciones', icon: '💻' }
    ]
  },
  
  // Salud y Belleza
  {
    name: 'Salud y Belleza',
    description: 'Productos de salud, belleza y cuidado personal',
    icon: '💄',
    children: [
      { name: 'Maquillaje', description: 'Cosméticos y maquillaje', icon: '💄' },
      { name: 'Cuidado de la Piel', description: 'Cremas, lociones, cuidado facial', icon: '🧴' },
      { name: 'Cabello', description: 'Productos para el cuidado del cabello', icon: '💇' },
      { name: 'Fragancias', description: 'Perfumes y colonias', icon: '🌸' },
      { name: 'Vitaminas y Suplementos', description: 'Suplementos nutricionales y vitaminas', icon: '💊' },
      { name: 'Equipamiento Médico', description: 'Dispositivos médicos y de salud', icon: '🏥' },
      { name: 'Cuidado Personal', description: 'Productos de higiene personal', icon: '🧼' },
      { name: 'Bebés y Niños', description: 'Productos para bebés y niños', icon: '👶' },
      { name: 'Fitness y Salud', description: 'Equipamiento para ejercicio y salud', icon: '🏃' },
      { name: 'Salud Natural', description: 'Productos naturales y orgánicos', icon: '🌿' }
    ]
  },
  
  // Animales y Mascotas
  {
    name: 'Animales y Mascotas',
    description: 'Animales, productos y servicios para mascotas',
    icon: '🐕',
    children: [
      { name: 'Perros', description: 'Perros en adopción y productos caninos', icon: '🐕' },
      { name: 'Gatos', description: 'Gatos en adopción y productos felinos', icon: '🐈' },
      { name: 'Aves', description: 'Aves y productos para aves', icon: '🦜' },
      { name: 'Peces', description: 'Peces y acuarios', icon: '🐠' },
      { name: 'Alimentos para Mascotas', description: 'Comida y suplementos para mascotas', icon: '🍖' },
      { name: 'Accesorios', description: 'Juguetes, camas, accesorios para mascotas', icon: '🦴' },
      { name: 'Veterinaria', description: 'Servicios veterinarios y medicamentos', icon: '🏥' },
      { name: 'Peluquería Canina', description: 'Servicios de estética para mascotas', icon: '✂️' },
      { name: 'Entrenamiento', description: 'Servicios de entrenamiento para mascotas', icon: '🎓' },
      { name: 'Exóticos', description: 'Animales exóticos y productos especiales', icon: '🦎' }
    ]
  },
  
  // Negocios e Industria
  {
    name: 'Negocios e Industria',
    description: 'Equipamiento industrial, herramientas y negocios',
    icon: '🏭',
    children: [
      { name: 'Herramientas', description: 'Herramientas manuales y eléctricas', icon: '🔧' },
      { name: 'Maquinaria', description: 'Maquinaria industrial y agrícola', icon: '🏭' },
      { name: 'Equipamiento de Restaurantes', description: 'Cocinas industriales y equipos de restaurante', icon: '🍽️' },
      { name: 'Oficina', description: 'Muebles y equipos de oficina', icon: '🏢' },
      { name: 'Almacenamiento', description: 'Estanterías, bodegas, sistemas de almacenaje', icon: '📦' },
      { name: 'Seguridad Industrial', description: 'Equipamiento de seguridad industrial', icon: '🦺' },
      { name: 'Impresión', description: 'Impresoras y equipos de impresión', icon: '🖨️' },
      { name: 'Empaques', description: 'Materiales de empaque y embalaje', icon: '📦' },
      { name: 'Limpieza Industrial', description: 'Equipamiento de limpieza industrial', icon: '🧹' },
      { name: 'Construcción', description: 'Herramientas y equipos de construcción', icon: '🏗️' }
    ]
  }
]

export async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...')
    
    for (const category of categories) {
      // Create parent category
      const parentCategory = await db.category.upsert({
        where: { name: category.name },
        update: {
          description: category.description,
          icon: category.icon
        },
        create: {
          name: category.name,
          description: category.description,
          icon: category.icon
        }
      })
      
      console.log(`✅ Created parent category: ${parentCategory.name}`)
      
      // Create subcategories
      if (category.children && category.children.length > 0) {
        for (const subcategory of category.children) {
          const subCategory = await db.category.upsert({
            where: { name: subcategory.name },
            update: {
              description: subcategory.description,
              icon: subcategory.icon,
              parentId: parentCategory.id
            },
            create: {
              name: subcategory.name,
              description: subcategory.description,
              icon: subcategory.icon,
              parentId: parentCategory.id
            }
          })
          
          console.log(`  📁 Created subcategory: ${subCategory.name}`)
        }
      }
    }
    
    console.log('✅ Categories seeded successfully!')
    
    // Display statistics
    const totalCategories = await db.category.count()
    const parentCategories = await db.category.count({
      where: { parentId: null }
    })
    const subCategories = await db.category.count({
      where: { parentId: { not: null } }
    })
    
    console.log(`📊 Category Statistics:`)
    console.log(`   Total categories: ${totalCategories}`)
    console.log(`   Parent categories: ${parentCategories}`)
    console.log(`   Subcategories: ${subCategories}`)
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('✅ Category seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Category seeding failed:', error)
      process.exit(1)
    })
}