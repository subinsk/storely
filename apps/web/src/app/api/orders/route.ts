import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = body;
    
    // Mock order creation - in real implementation, save to database
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      subtotal: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      shipping: 10.00,
      tax: 0,
      total: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    order.tax = order.subtotal * 0.08; // 8% tax
    order.total = order.subtotal + order.shipping + order.tax;
    
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
