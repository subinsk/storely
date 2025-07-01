import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { prisma } from 'src/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30';

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true }
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const organizationId = user.organizationId;

    // Date range calculation
    const endDateTime = endDate ? new Date(endDate) : new Date();
    const startDateTime = startDate ? new Date(startDate) : new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    let reportData: any = {};

    switch (reportType) {
      case 'revenue':
        reportData = await getRevenueAnalytics(organizationId, startDateTime, endDateTime);
        break;
      case 'products':
        reportData = await getProductAnalytics(organizationId, startDateTime, endDateTime);
        break;
      case 'customers':
        reportData = await getCustomerAnalytics(organizationId, startDateTime, endDateTime);
        break;
      case 'inventory':
        reportData = await getInventoryAnalytics(organizationId, startDateTime, endDateTime);
        break;
      case 'cohort':
        reportData = await getCohortAnalytics(organizationId, startDateTime, endDateTime);
        break;
      case 'conversion':
        reportData = await getConversionAnalytics(organizationId, startDateTime, endDateTime);
        break;
      default:
        reportData = await getOverviewAnalytics(organizationId, startDateTime, endDateTime);
    }

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Advanced reports API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advanced reports' },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    revenueByMonth,
    ordersByMonth,
    topProducts,
    topCategories
  ] = await Promise.all([
    // Total revenue
    prisma.order.aggregate({
      where: {
        organizationId,
        createdAt: { gte: startDate, lte: endDate },
        status: { notIn: ['cancelled', 'refunded'] }
      },
      _sum: { total: true }
    }),
    
    // Total orders
    prisma.order.count({
      where: {
        organizationId,
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Total customers
    prisma.customer.count({
      where: {
        organizationId,
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Total products
    prisma.product.count({
      where: { organizationId }
    }),
    
    // Revenue by month
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(total) as revenue
      FROM "Order"
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `,
    
    // Orders by month
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as orders
      FROM "Order"
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `,
    
    // Top products
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          organizationId,
          createdAt: { gte: startDate, lte: endDate }
        }
      },
      _sum: { quantity: true },
      _count: { _all: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    }),
    
    // Top categories
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          organizationId,
          createdAt: { gte: startDate, lte: endDate }
        }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })
  ]);

  return {
    overview: {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0
    },
    trends: {
      revenue: revenueByMonth,
      orders: ordersByMonth
    },
    topPerformers: {
      products: topProducts,
      categories: topCategories
    }
  };
}

async function getRevenueAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  const [
    revenueByDay,
    revenueByProduct,
    revenueByCustomerSegment,
    monthlyGrowth
  ] = await Promise.all([
    // Daily revenue
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        SUM(total) as revenue,
        COUNT(*) as orders
      FROM "Order"
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date
    `,
    
    // Revenue by product
    prisma.$queryRaw`
      SELECT 
        p.name,
        p.id,
        SUM(oi.quantity * oi.price) as revenue,
        SUM(oi.quantity) as units_sold
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."organizationId" = ${organizationId}
        AND o."createdAt" >= ${startDate}
        AND o."createdAt" <= ${endDate}
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT 20
    `,
    
    // Revenue by customer segment (based on order value)
    prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN total >= 1000 THEN 'Premium'
          WHEN total >= 500 THEN 'Gold'
          WHEN total >= 100 THEN 'Silver'
          ELSE 'Bronze'
        END as segment,
        SUM(total) as revenue,
        COUNT(*) as orders,
        COUNT(DISTINCT "customerId") as customers
      FROM "Order"
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY segment
      ORDER BY revenue DESC
    `,
    
    // Monthly growth
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(total) as revenue,
        LAG(SUM(total)) OVER (ORDER BY DATE_TRUNC('month', "createdAt")) as prev_revenue
      FROM "Order"
      WHERE "organizationId" = ${organizationId}
        AND "createdAt" >= ${new Date(startDate.getFullYear() - 1, startDate.getMonth(), 1)}
        AND "createdAt" <= ${endDate}
        AND status NOT IN ('cancelled', 'refunded')
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `
  ]);

  return {
    dailyRevenue: revenueByDay,
    productRevenue: revenueByProduct,
    customerSegments: revenueByCustomerSegment,
    monthlyGrowth
  };
}

async function getProductAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  const [
    productPerformance,
    categoryPerformance,
    inventoryStatus,
    pricingAnalysis
  ] = await Promise.all([
    // Product performance
    prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        COALESCE(SUM(oi.quantity * oi.price), 0) as revenue,
        COUNT(DISTINCT oi."orderId") as orders_count
      FROM "Product" p
      LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "Order" o ON oi."orderId" = o.id
      WHERE p."organizationId" = ${organizationId}
        AND (o."createdAt" IS NULL OR (o."createdAt" >= ${startDate} AND o."createdAt" <= ${endDate}))
        AND (o.status IS NULL OR o.status NOT IN ('cancelled', 'refunded'))
      GROUP BY p.id, p.name, p.price, p.stock
      ORDER BY revenue DESC
    `,
    
    // Category performance
    prisma.$queryRaw`
      SELECT 
        c.id,
        c.name,
        COUNT(p.id) as product_count,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM "Category" c
      LEFT JOIN "Product" p ON c.id = p."categoryId"
      LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "Order" o ON oi."orderId" = o.id
      WHERE c."organizationId" = ${organizationId}
        AND (o."createdAt" IS NULL OR (o."createdAt" >= ${startDate} AND o."createdAt" <= ${endDate}))
        AND (o.status IS NULL OR o.status NOT IN ('cancelled', 'refunded'))
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `,
    
    // Inventory status
    prisma.product.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: {
          select: { name: true }
        }
      },
      orderBy: { stock: 'asc' }
    }),
    
    // Pricing analysis
    prisma.$queryRaw`
      SELECT 
        FLOOR(price / 100) * 100 as price_range,
        COUNT(*) as product_count,
        AVG(price) as avg_price,
        COALESCE(SUM(oi.quantity), 0) as units_sold
      FROM "Product" p
      LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "Order" o ON oi."orderId" = o.id
      WHERE p."organizationId" = ${organizationId}
        AND (o."createdAt" IS NULL OR (o."createdAt" >= ${startDate} AND o."createdAt" <= ${endDate}))
        AND (o.status IS NULL OR o.status NOT IN ('cancelled', 'refunded'))
      GROUP BY FLOOR(price / 100) * 100
      ORDER BY price_range
    `
  ]);

  return {
    productPerformance,
    categoryPerformance,
    inventoryStatus,
    pricingAnalysis
  };
}

async function getCustomerAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  const [
    customerSegmentation,
    customerLifetime,
    acquisitionChannels,
    retentionAnalysis
  ] = await Promise.all([
    // Customer segmentation
    prisma.$queryRaw`
      SELECT 
        c.id,
        c.name,
        c.email,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total), 0) as total_spent,
        MAX(o."createdAt") as last_order_date,
        MIN(o."createdAt") as first_order_date
      FROM "Customer" c
      LEFT JOIN "Order" o ON c.id = o."customerId"
      WHERE c."organizationId" = ${organizationId}
        AND (o."createdAt" IS NULL OR (o."createdAt" >= ${startDate} AND o."createdAt" <= ${endDate}))
        AND (o.status IS NULL OR o.status NOT IN ('cancelled', 'refunded'))
      GROUP BY c.id, c.name, c.email
      ORDER BY total_spent DESC
    `,
    
    // Customer lifetime value
    prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN total_spent >= 2000 THEN 'VIP'
          WHEN total_spent >= 1000 THEN 'Premium'
          WHEN total_spent >= 500 THEN 'Regular'
          ELSE 'New'
        END as segment,
        COUNT(*) as customer_count,
        AVG(total_spent) as avg_ltv,
        AVG(order_count) as avg_orders
      FROM (
        SELECT 
          c.id,
          COUNT(o.id) as order_count,
          COALESCE(SUM(o.total), 0) as total_spent
        FROM "Customer" c
        LEFT JOIN "Order" o ON c.id = o."customerId"
        WHERE c."organizationId" = ${organizationId}
          AND (o.status IS NULL OR o.status NOT IN ('cancelled', 'refunded'))
        GROUP BY c.id
      ) customer_stats
      GROUP BY segment
      ORDER BY avg_ltv DESC
    `,
    
    // Acquisition channels (mock data for now)
    [
      { channel: 'Organic Search', customers: 45, percentage: 32.1 },
      { channel: 'Social Media', customers: 38, percentage: 27.1 },
      { channel: 'Email Marketing', customers: 28, percentage: 20.0 },
      { channel: 'Direct', customers: 18, percentage: 12.9 },
      { channel: 'Referral', customers: 11, percentage: 7.9 }
    ],
    
    // Retention analysis
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', first_order) as cohort_month,
        COUNT(*) as customers,
        COUNT(CASE WHEN months_since_first = 1 THEN 1 END) as month_1,
        COUNT(CASE WHEN months_since_first = 2 THEN 1 END) as month_2,
        COUNT(CASE WHEN months_since_first = 3 THEN 1 END) as month_3
      FROM (
        SELECT 
          c.id,
          MIN(o."createdAt") as first_order,
          DATE_PART('month', AGE(o."createdAt", MIN(o."createdAt") OVER (PARTITION BY c.id))) as months_since_first
        FROM "Customer" c
        JOIN "Order" o ON c.id = o."customerId"
        WHERE c."organizationId" = ${organizationId}
          AND o.status NOT IN ('cancelled', 'refunded')
        GROUP BY c.id, o."createdAt"
      ) cohort_data
      GROUP BY cohort_month
      ORDER BY cohort_month DESC
      LIMIT 12
    `
  ]);

  return {
    customerSegmentation,
    customerLifetime,
    acquisitionChannels,
    retentionAnalysis
  };
}

async function getInventoryAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  const [
    stockLevels,
    turnoverRates,
    lowStockAlerts,
    demandForecast
  ] = await Promise.all([
    // Stock levels
    prisma.product.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: { select: { name: true } }
      },
      orderBy: { stock: 'asc' }
    }),
    
    // Turnover rates
    prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.stock,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        CASE 
          WHEN p.stock > 0 THEN COALESCE(SUM(oi.quantity), 0) / p.stock 
          ELSE 0 
        END as turnover_rate
      FROM "Product" p
      LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "Order" o ON oi."orderId" = o.id
      WHERE p."organizationId" = ${organizationId}
        AND (o."createdAt" IS NULL OR (o."createdAt" >= ${startDate} AND o."createdAt" <= ${endDate}))
        AND (o.status IS NULL OR o.status NOT IN ('cancelled', 'refunded'))
      GROUP BY p.id, p.name, p.stock
      ORDER BY turnover_rate DESC
    `,
    
    // Low stock alerts
    prisma.product.findMany({
      where: {
        organizationId,
        stock: { lte: 10 }
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: { select: { name: true } }
      },
      orderBy: { stock: 'asc' }
    }),
    
    // Demand forecast (simplified)
    prisma.$queryRaw`
      SELECT 
        p.id,
        p.name,
        AVG(daily_sales.quantity) as avg_daily_demand,
        p.stock / NULLIF(AVG(daily_sales.quantity), 0) as days_of_stock
      FROM "Product" p
      LEFT JOIN (
        SELECT 
          oi."productId",
          DATE_TRUNC('day', o."createdAt") as day,
          SUM(oi.quantity) as quantity
        FROM "OrderItem" oi
        JOIN "Order" o ON oi."orderId" = o.id
        WHERE o."organizationId" = ${organizationId}
          AND o."createdAt" >= ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
          AND o.status NOT IN ('cancelled', 'refunded')
        GROUP BY oi."productId", DATE_TRUNC('day', o."createdAt")
      ) daily_sales ON p.id = daily_sales."productId"
      WHERE p."organizationId" = ${organizationId}
      GROUP BY p.id, p.name, p.stock
      HAVING AVG(daily_sales.quantity) > 0
      ORDER BY days_of_stock ASC
    `
  ]);

  return {
    stockLevels,
    turnoverRates,
    lowStockAlerts,
    demandForecast
  };
}

async function getCohortAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  const cohortData = await prisma.$queryRaw`
    WITH customer_cohorts AS (
      SELECT 
        c.id as customer_id,
        DATE_TRUNC('month', MIN(o."createdAt")) as cohort_month,
        MIN(o."createdAt") as first_order_date
      FROM "Customer" c
      JOIN "Order" o ON c.id = o."customerId"
      WHERE c."organizationId" = ${organizationId}
        AND o.status NOT IN ('cancelled', 'refunded')
      GROUP BY c.id
    ),
    customer_activities AS (
      SELECT 
        cc.customer_id,
        cc.cohort_month,
        o."createdAt" as order_date,
        DATE_PART('month', AGE(o."createdAt", cc.first_order_date)) as period_number
      FROM customer_cohorts cc
      JOIN "Order" o ON cc.customer_id = o."customerId"
      WHERE o.status NOT IN ('cancelled', 'refunded')
    )
    SELECT 
      cohort_month,
      period_number,
      COUNT(DISTINCT customer_id) as customers
    FROM customer_activities
    GROUP BY cohort_month, period_number
    ORDER BY cohort_month, period_number
  `;

  return { cohortData };
}

async function getConversionAnalytics(organizationId: string, startDate: Date, endDate: Date) {
  // For now, return mock conversion funnel data
  // In a real implementation, you'd track visitor sessions, cart additions, etc.
  
  const orderConversion = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', "createdAt") as date,
      COUNT(*) as orders,
      SUM(total) as revenue
    FROM "Order"
    WHERE "organizationId" = ${organizationId}
      AND "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
      AND status NOT IN ('cancelled', 'refunded')
    GROUP BY DATE_TRUNC('day', "createdAt")
    ORDER BY date
  `;

  return {
    funnelData: [
      { stage: 'Visitors', count: 10000, percentage: 100 },
      { stage: 'Product Views', count: 3000, percentage: 30 },
      { stage: 'Add to Cart', count: 800, percentage: 8 },
      { stage: 'Checkout', count: 300, percentage: 3 },
      { stage: 'Purchase', count: 150, percentage: 1.5 }
    ],
    conversionRates: {
      visitToView: 30,
      viewToCart: 26.7,
      cartToCheckout: 37.5,
      checkoutToPurchase: 50
    },
    orderConversion
  };
}
