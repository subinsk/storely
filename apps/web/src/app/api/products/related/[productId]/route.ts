import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
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
    const { productId } = params;
    const limit = Number(searchParams.get('limit')) || 4;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // First get the product to find its category
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationId,
      },
      select: {
        categoryId: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        organizationId,
        status: 'active',
        categoryId: product.categoryId,
        NOT: {
          id: productId,
        },
      },
      include: {
        category: true,
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
    const productsWithRatings = relatedProducts.map((product: any) => {
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
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
