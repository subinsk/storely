import { prisma, OrderStatus, Role } from '@storely/database';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const organizationId = session.user.organizationId;

    // Get 30 days ago and 60 days ago dates for comparison
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      revenueData,
      previousPeriodData,
      previousPeriodOrders,
      previousPeriodCustomers,
      previousPeriodProducts
    ] = await Promise.all([
      // Total products count
      prisma.product.count({
        where: { 
          organizationId,
          isActive: true 
        }
      }),
      
      // Total orders count (last 30 days)
      prisma.order.count({
        where: { 
          organizationId,
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      
      // Total customers count (last 30 days)
      prisma.user.count({
        where: { 
          organizationId,
          role: Role.user,
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      
      // Total revenue (last 30 days)
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          organizationId,
          status: OrderStatus.delivered,
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      
      // Previous period revenue data (30-60 days ago)
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        },
        where: {
          organizationId,
          status: OrderStatus.delivered,
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),

      // Previous period orders count (30-60 days ago)
      prisma.order.count({
        where: {
          organizationId,
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),

      // Previous period customers count (30-60 days ago)
      prisma.user.count({
        where: {
          organizationId,
          role: Role.user,
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      }),

      // Previous period products count (30-60 days ago)
      prisma.product.count({
        where: {
          organizationId,
          isActive: true,
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo
          }
        }
      })
    ]);

    // Calculate growth percentages
    const currentRevenue = revenueData._sum.totalAmount || 0;
    const previousRevenue = previousPeriodData._sum.totalAmount || 0;
    
    // Calculate real growth metrics
    const growthData = {
      products: previousPeriodProducts > 0 
        ? ((totalProducts - previousPeriodProducts) / previousPeriodProducts) * 100 
        : 100,
      orders: previousPeriodOrders > 0 
        ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100 
        : 100,
      revenue: previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 100,
      customers: previousPeriodCustomers > 0 
        ? ((totalCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100 
        : 100
    };

    const analytics = {
      totalProducts,
      totalOrders,
      totalRevenue: currentRevenue,
      totalCustomers,
      growthData
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
