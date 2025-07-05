import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@storely/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        user: {
          organizationId: session.user.organizationId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true,
                subDescription: true
              }
            },
            variant: {
              select: {
                id: true,
                name: true,
                value: true
              }
            }
          }
        },
        payments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Transform data for frontend
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        avatar: order.user.image,
        phone: order.user.phone
      },
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      currency: order.currency,
      totalQuantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      items: order.items,
      payments: order.payments,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      processedAt: order.processedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    };

    return NextResponse.json(transformedOrder);

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Verify order exists and belongs to organization
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        user: {
          organizationId: session.user.organizationId
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order
    const updateData: any = {};
    
    if (data.status !== undefined) updateData.status = data.status;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
    if (data.shippingStatus !== undefined) updateData.shippingStatus = data.shippingStatus;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.shippingAddress !== undefined) updateData.shippingAddress = data.shippingAddress;
    if (data.billingAddress !== undefined) updateData.billingAddress = data.billingAddress;

    // Set processed/shipped/delivered timestamps based on status changes
    if (data.status === 'processing' && existingOrder.status !== 'processing') {
      updateData.processedAt = new Date();
    }
    if (data.status === 'shipped' && existingOrder.status !== 'shipped') {
      updateData.shippedAt = new Date();
    }
    if (data.status === 'delivered' && existingOrder.status !== 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true
              }
            },
            variant: {
              select: {
                id: true,
                name: true,
                value: true
              }
            }
          }
        },
        payments: true
      }
    });

    return NextResponse.json(order);

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify order exists and belongs to organization
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        user: {
          organizationId: session.user.organizationId
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Delete order (cascade will delete items and payments)
    await prisma.order.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Order deleted successfully' });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
