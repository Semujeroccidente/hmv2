import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { z } from 'zod';

// GET: Fetch all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('search');

    if (query) {
      const searchResults = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            // { slug: { contains: query } } // Removed for safety
          ]
        },
        include: { parent: true },
        take: 20
      });
      return NextResponse.json(searchResults);
    }

    const categories = await prisma.category.findMany({
      // orderBy: { visualOrder: 'asc' }, // Removed for safety
      include: {
        children: {
          select: {
            id: true,
          }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parentId, description, icon } = body;

    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon,
        parentId,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    );
  }
}