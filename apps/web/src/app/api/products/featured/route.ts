import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
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
    const limit = Number(searchParams.get('limit')) || 8;

    const products = await prisma.product.findMany({
      where: {
        organizationId,
        status: 'active',
        featured: true,
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
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

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
      data: productsWithRatings,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
