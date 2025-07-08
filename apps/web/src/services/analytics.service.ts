import { prisma } from '../lib/prisma';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  topSellingProducts: Array<{
    product: any;
    totalSold: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    customerLifetimeValue: number;
  };
  inventoryMetrics: {
    lowStockProducts: number;
    outOfStockProducts: number;
    totalInventoryValue: number;
  };
}

export class AnalyticsService {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  async getDashboardMetrics(dateRange?: { startDate: Date; endDate: Date }): Promise<AnalyticsData> {
    const whereClause = {
      organizationId: this.organizationId,
      ...(dateRange && {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      }),
    };

    const [
      orders,
      customers,
      products,
      topSellingProducts,
      revenueByMonth,
      customerMetrics,
      inventoryMetrics,
    ] = await Promise.all([
      this.getOrderMetrics(whereClause),
      this.getCustomerMetrics(whereClause),
      this.getProductMetrics(),
      this.getTopSellingProducts(dateRange),
      this.getRevenueByMonth(dateRange),
      this.getCustomerLifetimeMetrics(dateRange),
      this.getInventoryMetrics(),
    ]);

    return {
      ...orders,
      ...customers,
      ...products,
      topSellingProducts,
      revenueByMonth,
      customerMetrics,
      inventoryMetrics,
    };
  }

  private async getOrderMetrics(whereClause: any) {
    const orderStats = await prisma.order.aggregate({
      where: {
        ...whereClause,
        status: { not: 'cancelled' },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    const totalRevenue = orderStats._sum.totalAmount || 0;
    const totalOrders = orderStats._count.id || 0;
    const averageOrderValue = orderStats._avg.totalAmount || 0;

    // Calculate conversion rate (orders / unique visitors)
    // This would require tracking page visits, for now using a mock calculation
    const conversionRate = totalOrders > 0 ? (totalOrders / (totalOrders * 10)) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
    };
  }

  private async getCustomerMetrics(whereClause: any) {
    const customerCount = await prisma.user.count({
      where: {
        organizationId: this.organizationId,
        role: 'user',
        ...(whereClause.createdAt && { createdAt: whereClause.createdAt }),
      },
    });

    return {
      totalCustomers: customerCount,
    };
  }

  private async getProductMetrics() {
    const productCount = await prisma.product.count({
      where: {
        organizationId: this.organizationId,
        status: 'active',
      },
    });

    return {
      totalProducts: productCount,
    };
  }

  private async getTopSellingProducts(dateRange?: { startDate: Date; endDate: Date }) {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          organizationId: this.organizationId,
          status: { not: 'cancelled' },
          ...(dateRange && {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
          }),
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item: { productId: string; _sum: { quantity: number | null; total: number | null } }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        });

        return {
          product,
          totalSold: item._sum.quantity || 0,
          revenue: item._sum.total || 0,
        };
      })
    );

    return productsWithDetails;
  }

  private async getRevenueByMonth(dateRange?: { startDate: Date; endDate: Date }) {
    const startDate = dateRange?.startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.endDate || new Date();

    const orders = await prisma.order.findMany({
      where: {
        organizationId: this.organizationId,
        status: { not: 'cancelled' },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    const revenueByMonth = orders.reduce((acc: Record<string, { revenue: number; orders: number }>, order: { createdAt: Date; totalAmount: number }) => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      
      if (!acc[month]) {
        acc[month] = { revenue: 0, orders: 0 };
      }
      
      acc[month].revenue += order.totalAmount;
      acc[month].orders += 1;
      
      return acc;
    }, {});

    return Object.entries(revenueByMonth).map(([month, data]: [string, any]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
    }));
  }

  private async getCustomerLifetimeMetrics(dateRange?: { startDate: Date; endDate: Date }) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [newCustomers, totalCustomers] = await Promise.all([
      prisma.user.count({
        where: {
          organizationId: this.organizationId,
          role: 'user',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.user.count({
        where: {
          organizationId: this.organizationId,
          role: 'user',
        },
      }),
    ]);

    const returningCustomers = totalCustomers - newCustomers;

    // Calculate customer lifetime value
    const customerOrders = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        organizationId: this.organizationId,
        status: { not: 'cancelled' },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalCustomerValue = customerOrders.reduce(
      (sum: number, customer: { _sum: { totalAmount: number | null } }) => sum + (customer._sum.totalAmount || 0),
      0
    );
    const customerLifetimeValue = customerOrders.length > 0 
      ? totalCustomerValue / customerOrders.length 
      : 0;

    return {
      newCustomers,
      returningCustomers,
      customerLifetimeValue,
    };
  }

  private async getInventoryMetrics() {
    const [lowStockProducts, outOfStockProducts, inventoryValue] = await Promise.all([
      prisma.product.count({
        where: {
          organizationId: this.organizationId,
          status: 'active',
          inventory: { lt: 10 }, // Less than 10 items
        },
      }),
      prisma.product.count({
        where: {
          organizationId: this.organizationId,
          status: 'active',
          inventory: { lte: 0 }, // Out of stock
        },
      }),
      prisma.product.aggregate({
        where: {
          organizationId: this.organizationId,
          status: 'active',
        },
        _sum: {
          price: true,
          inventory: true,
        },
      }),
    ]);

    const totalInventoryValue = (inventoryValue._sum.price || 0) * (inventoryValue._sum.inventory || 0);

    return {
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
    };
  }

  async getProductAnalytics(productId: string, dateRange?: { startDate: Date; endDate: Date }) {
    const whereClause = {
      productId,
      order: {
        organizationId: this.organizationId,
        status: { not: 'cancelled' },
        ...(dateRange && {
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        }),
      },
    };

    const [orderItems, reviews, views] = await Promise.all([
      prisma.orderItem.aggregate({
        where: whereClause,
        _sum: {
          quantity: true,
          total: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.review.aggregate({
        where: {
          productId,
          isActive: true,
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      }),
      // Product views would require tracking implementation
      Promise.resolve({ totalViews: 0, conversionRate: 0 }),
    ]);

    return {
      totalSold: orderItems._sum.quantity || 0,
      revenue: orderItems._sum.total || 0,
      orders: orderItems._count.id || 0,
      averageRating: reviews._avg.rating || 0,
      reviewCount: reviews._count.id || 0,
      views: views.totalViews,
      conversionRate: views.conversionRate,
    };
  }

  async getUserAnalytics(userId: string) {
    const [orders, reviews, wishlistCount] = await Promise.all([
      prisma.order.aggregate({
        where: {
          userId,
          organizationId: this.organizationId,
          status: { not: 'cancelled' },
        },
        _sum: {
          totalAmount: true,
        },
        _count: {
          id: true,
        },
        _avg: {
          totalAmount: true,
        },
      }),
      prisma.review.count({
        where: {
          userId,
          isActive: true,
        },
      }),
      prisma.wishlistItem.count({
        where: {
          userId,
        },
      }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return {
      user,
      totalSpent: orders._sum.totalAmount || 0,
      totalOrders: orders._count.id || 0,
      averageOrderValue: orders._avg.totalAmount || 0,
      reviewsWritten: reviews,
      wishlistItems: wishlistCount,
      customerSince: user?.createdAt,
    };
  }
}

export const analyticsService = (organizationId: string) => new AnalyticsService(organizationId);
