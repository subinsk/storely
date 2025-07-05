import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/order/analytics
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        // Default to last 30 days if no date range provided
        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 30);
        
        const dateFilter = {
            gte: startDate ? new Date(startDate) : defaultStartDate,
            lte: endDate ? new Date(endDate) : new Date()
        };

        // Get basic metrics
        const [
            totalOrders,
            totalRevenue,
            ordersByStatus,
            ordersByPaymentStatus,
            topProducts
        ] = await Promise.all([
            // Total orders in period
            prisma.order.count({
                where: {
                    createdAt: dateFilter
                }
            }),

            // Total revenue in period
            prisma.order.aggregate({
                where: {
                    createdAt: dateFilter,
                    paymentStatus: 'paid'
                },
                _sum: {
                    totalAmount: true
                }
            }),

            // Orders by status
            prisma.order.groupBy({
                by: ['status'],
                where: {
                    createdAt: dateFilter
                },
                _count: {
                    status: true
                }
            }),

            // Orders by payment status
            prisma.order.groupBy({
                by: ['paymentStatus'],
                where: {
                    createdAt: dateFilter
                },
                _count: {
                    paymentStatus: true
                }
            }),

            // Top selling products
            prisma.orderItem.groupBy({
                by: ['productId'],
                where: {
                    order: {
                        createdAt: dateFilter
                    }
                },
                _sum: {
                    quantity: true,
                    total: true
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc'
                    }
                },
                take: 10
            })
        ]);

        // Get product details for top products
        const topProductsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { id: true, name: true, images: true }
                });
                return {
                    productId: item.productId,
                    name: product?.name || 'Unknown Product',
                    image: product?.images?.[0] || null,
                    quantity: item._sum.quantity || 0,
                    revenue: item._sum.total || 0
                };
            })
        );

        // Calculate average order value
        const averageOrderValue = totalOrders > 0 
            ? (totalRevenue._sum.totalAmount || 0) / totalOrders 
            : 0;

        // Get daily revenue for chart
        const dailyRevenue = await prisma.$queryRaw`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as orders,
                SUM(total_amount) as revenue
            FROM orders 
            WHERE created_at >= ${dateFilter.gte} 
                AND created_at <= ${dateFilter.lte}
                AND payment_status = 'paid'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;

        // Format status distributions
        const statusDistribution = ordersByStatus.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {} as Record<string, number>);

        const paymentStatusDistribution = ordersByPaymentStatus.reduce((acc, item) => {
            acc[item.paymentStatus] = item._count.paymentStatus;
            return acc;
        }, {} as Record<string, number>);

        const analytics = {
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            averageOrderValue,
            conversionRate: 0, // Would need session/visitor data to calculate
            topProducts: topProductsWithDetails,
            statusDistribution,
            paymentStatusDistribution,
            revenueByPeriod: dailyRevenue
        };

        return sendResponse({
            data: analytics,
            message: "Order analytics fetched successfully",
            success: true
        });
    } catch (e: any) {
        console.error('Analytics error:', e);
        return sendResponse({
            data: e.message,
            message: "Failed to fetch order analytics",
            success: false
        });
    }
}
