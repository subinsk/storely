import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { emailService } from '../../../services/email.service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = body;
    
    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = 10.00;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        organizationId: session.user.organizationId,
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending',
        paymentStatus: 'pending',
        shippingStatus: 'pending',
        subtotal,
        taxAmount: tax,
        shippingAmount: shipping,
        totalAmount: total,
        shippingAddress,
        billingAddress,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Send order confirmation email
    try {
      await emailService.sendEmailWithTemplate(
        'order_confirmation',
        order.user.email,
        {
          customerName: order.user.name || order.user.email,
          orderNumber: order.orderNumber,
          orderTotal: `$${total.toFixed(2)}`,
          estimatedDelivery: '5-7 business days',
          items: order.items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: `$${item.price.toFixed(2)}`,
            total: `$${item.total.toFixed(2)}`,
          })),
          subtotal: `$${subtotal.toFixed(2)}`,
          shipping: `$${shipping.toFixed(2)}`,
          tax: `$${tax.toFixed(2)}`,
          total: `$${total.toFixed(2)}`,
          shippingAddress: shippingAddress,
        },
        order.organizationId || ''
      );
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      // Don't fail the order creation if email fails
    }
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  
  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }
  
  // Mock order retrieval
  const order = {
    id: orderId,
    items: [],
    status: 'pending',
    total: 0,
    createdAt: new Date()
  };
  
  return NextResponse.json(order);
}
