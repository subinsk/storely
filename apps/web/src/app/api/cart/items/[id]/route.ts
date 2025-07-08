import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@storely/database';
import { z } from 'zod';

const updateCartItemSchema = z.object({
  quantity: z.number().min(1),
});

// PUT /api/cart/items/[id] - Update cart item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const organizationId = request.headers.get('x-organization-id');

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: 'User ID and Organization ID are required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quantity } = updateCartItemSchema.parse(body);

    // Verify the cart item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        cart: {
          userId,
          organizationId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Update the cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: {
        quantity,
        updatedAt: new Date(),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            price: true,
            comparePrice: true,
            status: true,
            isActive: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        variant: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[id] - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const organizationId = request.headers.get('x-organization-id');

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: 'User ID and Organization ID are required' },
        { status: 401 }
      );
    }

    // Verify the cart item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        cart: {
          userId,
          organizationId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart item removed successfully',
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
