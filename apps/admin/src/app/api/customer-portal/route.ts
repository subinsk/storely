import { prisma } from '@storely/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


// Customer portal access validation schema
const CustomerPortalSchema = z.object({
  customerId: z.string().uuid(),
  email: z.string().email(),
  accessLevel: z.enum(['view_orders', 'manage_profile', 'track_shipments', 'full_access']).optional().default('view_orders')
});

const CustomerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional().default(false)
});

// Get customer portal access info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const email = searchParams.get('email');

    if (!customerId && !email) {
      return NextResponse.json(
        { error: 'Customer ID or email is required' },
        { status: 400 }
      );
    }

    // Find customer (user in our schema)
    const customer = await prisma.user.findFirst({
      where: customerId ? { id: customerId } : { email: email! },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            paymentStatus: true,
            shippingStatus: true,
            totalAmount: true,
            createdAt: true,
            items: {
              select: {
                id: true,
                quantity: true,
                price: true,
                total: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            country: true,
            zip: true
          }
        }
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Calculate customer statistics
    const orderStats = await prisma.order.aggregate({
      where: { userId: customer.id },
      _count: { id: true },
      _sum: { totalAmount: true }
    });

    const recentOrderCount = await prisma.order.count({
      where: {
        userId: customer.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const response = {
      customer: {
        ...customer,
        statistics: {
          totalOrders: orderStats._count.id || 0,
          totalSpent: orderStats._sum.totalAmount || 0,
          recentOrders: recentOrderCount
        }
      },
      portalFeatures: {
        orderTracking: true,
        profileManagement: true,
        addressBook: true,
        orderHistory: true,
        returns: true,
        wishlist: false, // To be implemented
        loyalty: false   // To be implemented
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Customer portal access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Customer portal login/authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CustomerLoginSchema.parse(body);

    // For now, we'll use a simple email verification
    // In production, you'd implement proper password hashing and verification
    const customer = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a simple session token (in production, use JWT or proper session management)
    const sessionToken = Buffer.from(`${customer.id}:${Date.now()}`).toString('base64');

    const response = NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email
      },
      sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      portalUrl: `/customer-portal/${customer.id}`
    });

    // Set httpOnly cookie for session management
    response.cookies.set('customer-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Customer portal login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update customer portal preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, preferences } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Update customer portal preferences
    // Since we don't have a metadata field in User model, we'll skip this for now
    // In a real implementation, you'd add a metadata field or preferences table
    
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer,
      message: 'Preferences update feature coming soon'
    });
  } catch (error) {
    console.error('Customer portal preferences update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
