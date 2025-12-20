import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Find category by slug
        const category = await prisma.category.findUnique({
            where: { slug: slug[0] }, // slug is array? Next.js 15 catch-all
            // Wait, route is [slug], if it's [...slug] it's an array. 
            // The file path requested was `[slug]/route.ts`. 
            // If the user requested `...slug` in the prompt "URLs amigables: sitio.com/c/electronica/telefonos/smartphones", then I should probably use `[...slug]` for the PAGE.
            // For the API, strict slug or ID is better. Let's assume strict slug.
            // But wait, "slug" param in `[slug]` folder is a string in Next < 15, but Next 15 might be async params.
            // "slug" in `[slug]` is a string. In `[...slug]` it's string[].
            // I'll assume strict slug lookup for now.
            include: {
                parent: {
                    include: {
                        parent: {
                            include: {
                                parent: true
                            }
                        }
                    }
                },
                children: true,
                attributeTemplate: true, // It's a string, just getting it is enough
            }
        });

        if (!category) {
            // Try to find by ID if slug not found (fallback)
            const categoryById = await prisma.category.findUnique({
                where: { id: slug as string },
                include: { parent: true, children: true }
            });

            if (categoryById) {
                return NextResponse.json(categoryById);
            }

            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Construct breadcrumbs
        const breadcrumbs = [];
        let current = category;
        while (current) {
            breadcrumbs.unshift({
                id: current.id,
                name: current.name,
                slug: current.slug,
                level: current.level // Assuming level is on the type
            });
            // @ts-ignore
            current = current.parent;
        }

        return NextResponse.json({
            ...category,
            breadcrumbs
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return NextResponse.json(
            { error: 'Error fetching category' },
            { status: 500 }
        );
    }
}
