import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { getPaginationParams, getPaginationMeta, getSkip } from '@/lib/pagination';

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
};

const productSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
  stock: z.number().int().min(1, 'El stock debe ser al menos 1'),
  categoryId: z.string().min(1, 'La categoría principal es requerida'),
  otherCategoryIds: z.array(z.string()).optional(),
  images: z.array(z.string().url()).min(1, 'Al menos una imagen es requerida'),
  attributes: z.record(z.string(), z.any()).optional(), // JSON for attributes
});

// GET: Fetch products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Use pagination utilities
    const { page, limit } = getPaginationParams(searchParams);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = getSkip(page, limit);

    const where: any = {
      status: 'ACTIVE',
    };

    if (category) {
      where.OR = [
        { category: { slug: category } },
        { otherCategories: { some: { slug: category } } }
      ];
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } }
          ]
        }
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              rating: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      pagination: getPaginationMeta(page, limit, total)
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(request: NextRequest) {
  try {
    // 1. Verify Auth
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No estás autenticado' }, { status: 401 });
    }

    let userId: string;
    try {
      let decoded: any
      try {
        decoded = jwt.verify(token, getJWTSecret())
      } catch {
        throw new Error('INVALID_TOKEN')
      }

      // Validate token structure
      if (!decoded.userId || !decoded.email || !decoded.role) {
        throw new Error('INVALID_TOKEN')
      };
      userId = decoded.userId;
    } catch (e) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Generate Slug
    let slug = slugify(validatedData.title);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Connect categories
    const otherCategoriesConnect = validatedData.otherCategoryIds?.map(id => ({ id })) || [];

    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        condition: validatedData.condition,
        stock: validatedData.stock,
        images: JSON.stringify(validatedData.images),
        thumbnail: validatedData.images[0],
        slug,
        sellerId: userId,
        categoryId: validatedData.categoryId,
        status: 'ACTIVE',
        // Note: otherCategories removed due to SQLite limitation with implicit many-to-many
        // Can be added via update operation if needed
      }
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Format Zod errors to a single string if possible or return detail
      const errorMessage = error.issues.map(e => e.message).join(', ');
      return NextResponse.json({ error: errorMessage, details: error.issues }, { status: 400 });
    }

    // Handle Prisma Unique Constraint specifically?
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un producto con este slug/nombre' }, { status: 409 });
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error interno al crear el producto' },
      { status: 500 }
    );
  }
}