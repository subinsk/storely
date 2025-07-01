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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30';

    const start = startDate ? new Date(startDate) : new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const [
      productPerformance,
      categoryPerformance,
      lowStockProducts,
      topSellingProducts,
      slowMovingProducts,
      inventoryValue,
      stockLevels,
      productMetrics
    ] = await Promise.all([
      // Product performance with sales data
      prisma.$queryRaw`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.price,
          p.quantity as stock_level,
          p.low_stock_alert,
          COALESCE(SUM(oi.quantity), 0) as units_sold,
          COALESCE(SUM(oi.total), 0) as revenue,
          COUNT(DISTINCT oi.order_id) as total_orders,
          COALESCE(AVG(r.rating), 0) as avg_rating,
          COUNT(r.id) as review_count
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE u.organization_id = ${session.user.organizationId}
        OR u.organization_id IS NULL
        GROUP BY p.id, p.name, p.sku, p.price, p.quantity, p.low_stock_alert
        ORDER BY revenue DESC
        LIMIT 50
      `,

      // Category performance
      prisma.$queryRaw`
        SELECT 
          c.id,
          c.name as category_name,
          COUNT(DISTINCT p.id) as product_count,
          COALESCE(SUM(oi.quantity), 0) as units_sold,
          COALESCE(SUM(oi.total), 0) as revenue,
          COALESCE(AVG(oi.price), 0) as avg_price
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE u.organization_id = ${session.user.organizationId}
        OR u.organization_id IS NULL
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
      `,

      // Low stock products
      prisma.product.findMany({
        where: {
          OR: [
            { quantity: { lte: prisma.product.fields.lowStockAlert } },
            { quantity: { lte: 10 } } // Default low stock threshold
          ]
        },
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
          lowStockAlert: true,
          price: true,
          images: true
        },
        orderBy: { quantity: 'asc' },
        take: 20
      }),

      // Top selling products in period
      prisma.$queryRaw`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.images,
          SUM(oi.quantity) as units_sold,
          SUM(oi.total) as revenue
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        JOIN users u ON o.user_id = u.id
        WHERE u.organization_id = ${session.user.organizationId}
        AND o.created_at >= ${start}
        AND o.created_at <= ${end}
        GROUP BY p.id, p.name, p.sku, p.images
        ORDER BY units_sold DESC
        LIMIT 10
      `,

      // Slow moving products (no sales in period)
      prisma.$queryRaw`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.quantity,
          p.price,
          p.created_at
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE p.id NOT IN (
          SELECT DISTINCT oi2.product_id
          FROM order_items oi2
          JOIN orders o2 ON oi2.order_id = o2.id
          JOIN users u2 ON o2.user_id = u2.id
          WHERE u2.organization_id = ${session.user.organizationId}
          AND o2.created_at >= ${start}
          AND o2.created_at <= ${end}
        )
        ORDER BY p.created_at DESC
        LIMIT 20
      `,

      // Total inventory value
      prisma.product.aggregate({
        _sum: {
          quantity: true
        }
      }),

      // Stock levels summary
      prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN quantity = 0 THEN 1 END) as out_of_stock,
          COUNT(CASE WHEN quantity > 0 AND quantity <= COALESCE(low_stock_alert, 10) THEN 1 END) as low_stock,
          COUNT(CASE WHEN quantity > COALESCE(low_stock_alert, 10) THEN 1 END) as in_stock,
          COUNT(*) as total_products
        FROM products
      `,

      // Product metrics
      prisma.product.aggregate({
        _count: true,
        _avg: { price: true, quantity: true }
      })
    ]);

    // Calculate inventory value
    const inventoryValueData = await prisma.$queryRaw`
      SELECT SUM(quantity * price) as total_value
      FROM products
    `;

    return NextResponse.json({
      summary: {
        totalProducts: productMetrics._count,
        averagePrice: productMetrics._avg.price || 0,
        averageStock: productMetrics._avg.quantity || 0,
        totalInventoryValue: (inventoryValueData as any)[0]?.total_value || 0,
        stockLevels: (stockLevels as any)[0] || {}
      },
      productPerformance,
      categoryPerformance,
      lowStockProducts,
      topSellingProducts,
      slowMovingProducts,
      insights: {
        needsRestocking: lowStockProducts.length,
        slowMovers: Array.isArray(slowMovingProducts) ? slowMovingProducts.length : 0,
        topPerformers: Array.isArray(topSellingProducts) ? topSellingProducts.length : 0
      }
    });

  } catch (error) {
    console.error('Error fetching products report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
