import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // In a real multi-tenant app, get organizationId from middleware
    // const organizationId = request.headers.get('x-organization-id');
    
    // For now, we'll get all data (later filter by organizationId)
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      revenueData,
      previousPeriodData
    ] = await Promise.all([
      // Total products count
      prisma.product.count({
        where: { 
          // organizationId, 
          isActive: true 
        }
      }),
      
      // Total orders count
      prisma.order.count({
        // where: { organizationId }
      }),
      
      // Total customers count
      prisma.user.count({
        where: { 
          // organizationId,
          role: 'CUSTOMER' 
        }
      }),
      
      // Total revenue (last 30 days)
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          // organizationId,
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Previous period data for growth calculation (30-60 days ago)
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        _count: true,
        where: {
          // organizationId,
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate growth percentages
    const currentRevenue = revenueData._sum.total || 0;
    const previousRevenue = previousPeriodData._sum.total || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Calculate other growth metrics (simplified)
    const growthData = {
      products: Math.random() * 20 - 5, // TODO: Calculate real product growth
      orders: Math.random() * 15 - 2,   // TODO: Calculate real order growth
      revenue: revenueGrowth,
      customers: Math.random() * 10     // TODO: Calculate real customer growth
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
