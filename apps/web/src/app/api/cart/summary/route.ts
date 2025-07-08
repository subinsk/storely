import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/cart/summary - Get cart summary with totals
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const organizationId = request.headers.get('x-organization-id');

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: 'User ID and Organization ID are required' },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        organizationId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                comparePrice: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: {
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          itemsCount: 0,
        },
      });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    return NextResponse.json({
      success: true,
      data: {
        subtotal,
        tax,
        shipping,
        total,
        itemsCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error('Error fetching cart summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
