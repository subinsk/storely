import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const organizationId = headersList.get('x-organization-id');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Extract all query parameters
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    const where: any = {
      organizationId,
      status: 'active',
    };

    // Filter by category ID
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by category slug
    if (categorySlug) {
      const category = await prisma.category.findFirst({
        where: {
          slug: categorySlug,
          organizationId,
        },
      });
      
      if (category) {
        where.categoryId = category.id;
      }
    }

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Featured filter
    if (featured !== undefined) {
      where.featured = featured;
    }

    // Sorting
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRatings = products.map((product: any) => {
      const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
        : 0;

      return {
        ...product,
        averageRating: Number(averageRating.toFixed(1)),
        reviewCount: product.reviews.length,
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithRatings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = headers();
    const organizationId = headersList.get('x-organization-id');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        ...body,
        organizationId,
        status: 'active',
      },
      include: {
        category: true,
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
