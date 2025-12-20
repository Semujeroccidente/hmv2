import { PrismaClient } from '@prisma/client';
// Use relative path for seed script to avoid alias issues during seed execution if not configured
import { slugify } from '../src/lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');

  // 1. Electronics
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronica' },
    update: {},
    create: {
      name: 'Electrónica',
      slug: 'electronica',
      level: 1,
      icon: '📱',
      visualOrder: 1,
      attributeTemplate: JSON.stringify(['Marca', 'Garantía']),
    },
  });

  // 1.1 Phones
  const phones = await prisma.category.upsert({
    where: { slug: 'telefonos' },
    update: { parentId: electronics.id },
    create: {
      name: 'Teléfonos',
      slug: 'telefonos',
      level: 2,
      parentId: electronics.id,
      visualOrder: 1,
      attributeTemplate: JSON.stringify(['Sistema Operativo', 'Almacenamiento']),
    },
  });

  // 1.1.1 Smartphones
  await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: { parentId: phones.id },
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      level: 3,
      parentId: phones.id,
      visualOrder: 1,
      attributeTemplate: JSON.stringify(['Tamaño de Pantalla', 'Cámara', 'RAM']),
    },
  });

  // 1.1.2 Accessories
  await prisma.category.upsert({
    where: { slug: 'accesorios-telefonos' },
    update: { parentId: phones.id },
    create: {
      name: 'Accesorios',
      slug: 'accesorios-telefonos',
      level: 3,
      parentId: phones.id,
      visualOrder: 2,
      attributeTemplate: JSON.stringify(['Tipo', 'Compatible con']),
    },
  });

  // 1.2 Computers
  const computers = await prisma.category.upsert({
    where: { slug: 'computadoras' },
    update: { parentId: electronics.id },
    create: {
      name: 'Computadoras',
      slug: 'computadoras',
      level: 2,
      parentId: electronics.id,
      visualOrder: 2,
      attributeTemplate: JSON.stringify(['Marca', 'Procesador']),
    },
  });

  // 1.2.1 Laptops
  await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: { parentId: computers.id },
    create: {
      name: 'Laptops',
      slug: 'laptops',
      level: 3,
      parentId: computers.id,
      visualOrder: 1,
      attributeTemplate: JSON.stringify(['RAM', 'Disco Duro', 'Tarjeta Gráfica']),
    },
  });


  // 2. Fashion
  const fashion = await prisma.category.upsert({
    where: { slug: 'moda' },
    update: {},
    create: {
      name: 'Moda',
      slug: 'moda',
      level: 1,
      icon: '👕',
      visualOrder: 2,
      attributeTemplate: JSON.stringify(['Marca', 'Género']),
    },
  });

  // 2.1 Men
  const men = await prisma.category.upsert({
    where: { slug: 'hombre' },
    update: { parentId: fashion.id },
    create: {
      name: 'Hombre',
      slug: 'hombre',
      level: 2,
      parentId: fashion.id,
      visualOrder: 1,
    },
  });

  // 2.1.1 Shirts
  await prisma.category.upsert({
    where: { slug: 'camisas-hombre' },
    update: { parentId: men.id },
    create: {
      name: 'Camisas',
      slug: 'camisas-hombre',
      level: 3,
      parentId: men.id,
      visualOrder: 1,
      attributeTemplate: JSON.stringify(['Talla', 'Color', 'Material']),
    },
  });


  console.log('Categories seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });