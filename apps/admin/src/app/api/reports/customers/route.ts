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
    const period = searchParams.get('period') || '30';

    const start = startDate ? new Date(startDate) : new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const [
      customerOverview,
      topCustomers,
      newCustomers,
      customerRetention,
      customersByLocation,
      orderFrequency,
      customerLifetimeValue,
      customerSegments,
      recentActivity
    ] = await Promise.all([
      // Customer overview
      prisma.user.aggregate({
        where: {
          organizationId: session.user.organizationId,
          createdAt: { gte: start, lte: end }
        },
        _count: true
      }),

      // Top customers by revenue
      prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.image,
          COUNT(o.id) as total_orders,
          SUM(o.total_amount) as total_spent,
          AVG(o.total_amount) as avg_order_value,
          MAX(o.created_at) as last_order_date,
          MIN(o.created_at) as first_order_date
        FROM users u
        JOIN orders o ON u.id = o.user_id
        WHERE u.organization_id = ${session.user.organizationId}
        AND o.created_at >= ${start}
        AND o.created_at <= ${end}
        GROUP BY u.id, u.name, u.email, u.image
        ORDER BY total_spent DESC
        LIMIT 20
      `,

      // New customers in period
      prisma.user.findMany({
        where: {
          organizationId: session.user.organizationId,
          createdAt: { gte: start, lte: end }
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Customer retention (repeat customers)
      prisma.$queryRaw`
        SELECT 
          COUNT(DISTINCT u.id) as total_customers,
          COUNT(DISTINCT CASE WHEN order_count > 1 THEN u.id END) as repeat_customers,
          ROUND(
            (COUNT(DISTINCT CASE WHEN order_count > 1 THEN u.id END) * 100.0 / 
             NULLIF(COUNT(DISTINCT u.id), 0)), 2
          ) as retention_rate
        FROM users u
        JOIN (
          SELECT user_id, COUNT(*) as order_count
          FROM orders
          WHERE created_at >= ${start} AND created_at <= ${end}
          GROUP BY user_id
        ) oc ON u.id = oc.user_id
        WHERE u.organization_id = ${session.user.organizationId}
      `,

      // Customers by location (if addresses are stored)
      prisma.$queryRaw`
        SELECT 
          COALESCE(a.country, 'Unknown') as country,
          COALESCE(a.state, 'Unknown') as state,
          COUNT(DISTINCT u.id) as customer_count
        FROM users u
        LEFT JOIN addresses a ON u.id = a.user_id
        WHERE u.organization_id = ${session.user.organizationId}
        AND u.created_at >= ${start}
        AND u.created_at <= ${end}
        GROUP BY a.country, a.state
        ORDER BY customer_count DESC
        LIMIT 10
      `,

      // Order frequency analysis
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN order_count = 1 THEN 'One-time'
            WHEN order_count BETWEEN 2 AND 5 THEN 'Occasional (2-5)'
            WHEN order_count BETWEEN 6 AND 10 THEN 'Regular (6-10)'
            ELSE 'Frequent (10+)'
          END as frequency_segment,
          COUNT(*) as customer_count,
          AVG(total_spent) as avg_revenue_per_customer
        FROM (
          SELECT 
            u.id,
            COUNT(o.id) as order_count,
            SUM(o.total_amount) as total_spent
          FROM users u
          JOIN orders o ON u.id = o.user_id
          WHERE u.organization_id = ${session.user.organizationId}
          AND o.created_at >= ${start}
          AND o.created_at <= ${end}
          GROUP BY u.id
        ) customer_stats
        GROUP BY frequency_segment
        ORDER BY 
          CASE frequency_segment
            WHEN 'Frequent (10+)' THEN 1
            WHEN 'Regular (6-10)' THEN 2
            WHEN 'Occasional (2-5)' THEN 3
            WHEN 'One-time' THEN 4
          END
      `,

      // Customer lifetime value calculation
      prisma.$queryRaw`
        SELECT 
          AVG(total_spent) as avg_lifetime_value,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_spent) as median_lifetime_value,
          MAX(total_spent) as max_lifetime_value,
          MIN(total_spent) as min_lifetime_value
        FROM (
          SELECT 
            u.id,
            SUM(o.total_amount) as total_spent
          FROM users u
          JOIN orders o ON u.id = o.user_id
          WHERE u.organization_id = ${session.user.organizationId}
          GROUP BY u.id
        ) customer_totals
      `,

      // Customer segments by value
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN total_spent >= 1000 THEN 'VIP (>$1000)'
            WHEN total_spent >= 500 THEN 'High Value ($500-$1000)'
            WHEN total_spent >= 100 THEN 'Medium Value ($100-$500)'
            ELSE 'Low Value (<$100)'
          END as value_segment,
          COUNT(*) as customer_count,
          AVG(total_spent) as avg_segment_value,
          SUM(total_spent) as segment_revenue
        FROM (
          SELECT 
            u.id,
            SUM(o.total_amount) as total_spent
          FROM users u
          JOIN orders o ON u.id = o.user_id
          WHERE u.organization_id = ${session.user.organizationId}
          GROUP BY u.id
        ) customer_values
        GROUP BY value_segment
        ORDER BY avg_segment_value DESC
      `,

      // Recent customer activity
      prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          o.created_at as last_activity,
          o.total_amount as last_order_value,
          o.status as last_order_status
        FROM users u
        JOIN orders o ON u.id = o.user_id
        WHERE u.organization_id = ${session.user.organizationId}
        AND o.created_at = (
          SELECT MAX(o2.created_at)
          FROM orders o2
          WHERE o2.user_id = u.id
        )
        ORDER BY o.created_at DESC
        LIMIT 20
      `
    ]);

    // Calculate growth metrics
    const previousPeriodStart = new Date(start.getTime() - (end.getTime() - start.getTime()));
    const previousCustomers = await prisma.user.count({
      where: {
        organizationId: session.user.organizationId,
        createdAt: { gte: previousPeriodStart, lt: start }
      }
    });

    const customerGrowth = previousCustomers > 0 ? 
      ((customerOverview._count - previousCustomers) / previousCustomers) * 100 : 0;

    return NextResponse.json({
      summary: {
        totalCustomers: customerOverview._count,
        newCustomers: newCustomers.length,
        customerGrowth,
        retentionData: customerRetention,
        lifetimeValue: customerLifetimeValue,
        period: { start, end }
      },
      topCustomers,
      newCustomers,
      customersByLocation,
      orderFrequency,
      customerSegments,
      recentActivity,
      insights: {
        retentionRate: Array.isArray(customerRetention) ? (customerRetention as any)[0]?.retention_rate || 0 : 0,
        avgLifetimeValue: Array.isArray(customerLifetimeValue) ? (customerLifetimeValue as any)[0]?.avg_lifetime_value || 0 : 0,
        topSegment: Array.isArray(customerSegments) ? (customerSegments as any)[0]?.value_segment || 'N/A' : 'N/A'
      }
    });

  } catch (error) {
    console.error('Error fetching customers report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
