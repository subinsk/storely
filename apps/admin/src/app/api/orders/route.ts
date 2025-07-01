import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      user: {
        organizationId: session.user.organizationId
      }
    };

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Get total count
    const total = await prisma.order.count({ where });

    // Get orders with relations
    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    // Transform data for frontend
    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        avatar: order.user.image
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
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      processedAt: order.processedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt
    }));

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.userId || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Verify user belongs to the organization
    const user = await prisma.user.findFirst({
      where: {
        id: data.userId,
        organizationId: session.user.organizationId
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate order number
    const orderCount = await prisma.order.count({
      where: {
        user: {
          organizationId: session.user.organizationId
        }
      }
    });
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

    // Calculate totals
    const subtotal = data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const taxAmount = data.taxAmount || 0;
    const shippingAmount = data.shippingAmount || 0;
    const discountAmount = data.discountAmount || 0;
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        status: data.status || 'pending',
        paymentStatus: data.paymentStatus || 'pending',
        shippingStatus: data.shippingStatus || 'pending',
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        currency: data.currency || 'USD',
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        notes: data.notes,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          }))
        }
      },
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
        }
      }
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
