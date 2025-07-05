import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@storely/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30'; // days

    const start = startDate ? new Date(startDate) : new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get sales data for the organization
    const [
      totalSales,
      ordersByStatus,
      dailySales,
      topProducts,
      salesByCategory,
      monthlyGrowth,
      paymentMethods,
      averageOrderValue
    ] = await Promise.all([
      // Total sales in period
      prisma.order.aggregate({
        where: {
          user: { organizationId: session.user.organizationId },
          createdAt: { gte: start, lte: end }
        },
        _sum: { totalAmount: true },
        _count: true
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        where: {
          user: { organizationId: session.user.organizationId },
          createdAt: { gte: start, lte: end }
        },
        _count: true,
        _sum: { totalAmount: true }
      }),

      // Daily sales trend
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as orders,
          SUM(total_amount) as revenue
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE u.organization_id = ${session.user.organizationId}
        AND o.created_at >= ${start}
        AND o.created_at <= ${end}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `,

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            user: { organizationId: session.user.organizationId },
            createdAt: { gte: start, lte: end }
          }
        },
        _sum: { quantity: true, total: true },
        _count: true,
        orderBy: { _sum: { total: 'desc' } },
        take: 10
      }),

      // Sales by category
      prisma.$queryRaw`
        SELECT 
          c.name as category_name,
          SUM(oi.total) as revenue,
          SUM(oi.quantity) as quantity_sold,
          COUNT(DISTINCT oi.order_id) as orders
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        JOIN users u ON o.user_id = u.id
        WHERE u.organization_id = ${session.user.organizationId}
        AND o.created_at >= ${start}
        AND o.created_at <= ${end}
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
      `,

      // Monthly growth (compare with previous period)
      prisma.order.aggregate({
        where: {
          user: { organizationId: session.user.organizationId },
          createdAt: { 
            gte: new Date(start.getTime() - (end.getTime() - start.getTime())),
            lt: start
          }
        },
        _sum: { totalAmount: true },
        _count: true
      }),

      // Payment methods breakdown
      prisma.payment.groupBy({
        by: ['paymentMethod'],
        where: {
          order: {
            user: { organizationId: session.user.organizationId },
            createdAt: { gte: start, lte: end }
          }
        },
        _sum: { amount: true },
        _count: true
      }),

      // Average order value
      prisma.order.aggregate({
        where: {
          user: { organizationId: session.user.organizationId },
          createdAt: { gte: start, lte: end }
        },
        _avg: { totalAmount: true }
      })
    ]);

    // Get product details for top products
    const productIds = topProducts.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, images: true, price: true }
    });

    const topProductsWithDetails = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    });

    // Calculate growth rates
    const currentRevenue = totalSales._sum.totalAmount || 0;
    const previousRevenue = monthlyGrowth._sum.totalAmount || 0;
    const revenueGrowth = previousRevenue > 0 ? 
      ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const currentOrders = totalSales._count || 0;
    const previousOrders = monthlyGrowth._count || 0;
    const ordersGrowth = previousOrders > 0 ? 
      ((currentOrders - previousOrders) / previousOrders) * 100 : 0;

    return NextResponse.json({
      summary: {
        totalRevenue: currentRevenue,
        totalOrders: currentOrders,
        averageOrderValue: averageOrderValue._avg.totalAmount || 0,
        revenueGrowth,
        ordersGrowth,
        period: { start, end }
      },
      ordersByStatus,
      dailySales,
      topProducts: topProductsWithDetails,
      salesByCategory,
      paymentMethods,
      trends: {
        daily: dailySales,
        growth: {
          revenue: revenueGrowth,
          orders: ordersGrowth
        }
      }
    });

  } catch (error) {
    console.error('Error fetching sales report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
