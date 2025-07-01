import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, productIds, data } = body;

    if (!action || !productIds || !Array.isArray(productIds)) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Action and product IDs are required'
      });
    }

    let result;

    switch (action) {
      case 'delete':
        // Check if any products have orders before deleting
        const productsWithOrders = await prisma.product.findMany({
          where: {
            id: { in: productIds },
            orderItems: { some: {} }
          },
          select: { id: true, name: true }
        });

        if (productsWithOrders.length > 0) {
          // Archive products with orders instead of deleting
          await prisma.product.updateMany({
            where: { id: { in: productIds } },
            data: { status: 'archived' }
          });

          result = {
            archived: productIds.length,
            archivedProducts: productsWithOrders
          };
        } else {
          // Delete products without orders
          result = await prisma.product.deleteMany({
            where: { id: { in: productIds } }
          });
        }
        break;

      case 'updateStatus':
        if (!data || !data.status) {
          return sendResponse({
            data: null,
            success: false,
            message: 'Status is required for update action'
          });
        }
        
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: data.status }
        });
        break;

      case 'updateCategory':
        if (!data || !data.categoryId) {
          return sendResponse({
            data: null,
            success: false,
            message: 'Category ID is required for category update'
          });
        }
        
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { categoryId: data.categoryId }
        });
        break;

      case 'updateFeatured':
        if (!data || typeof data.featured !== 'boolean') {
          return sendResponse({
            data: null,
            success: false,
            message: 'Featured status is required'
          });
        }
        
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { featured: data.featured }
        });
        break;

      case 'updatePrice':
        if (!data || typeof data.price !== 'number') {
          return sendResponse({
            data: null,
            success: false,
            message: 'Price is required for price update'
          });
        }
        
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { 
            price: data.price,
            ...(data.comparePrice && { comparePrice: data.comparePrice })
          }
        });
        break;

      case 'addTags':
        if (!data || !Array.isArray(data.tags)) {
          return sendResponse({
            data: null,
            success: false,
            message: 'Tags array is required'
          });
        }

        // Get current products to merge tags
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, tags: true }
        });

        // Update each product with merged tags
        await Promise.all(
          products.map(product => {
            const mergedTags = Array.from(new Set([...product.tags, ...data.tags]));
            return prisma.product.update({
              where: { id: product.id },
              data: { tags: mergedTags }
            });
          })
        );

        result = { updated: products.length };
        break;

      case 'export':
        // Export products to CSV format
        const exportProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
          include: {
            category: { select: { name: true } },
            variants: true,
            inventory: true
          }
        });

        // Convert to CSV-like format
        const csvData = exportProducts.map(product => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          category: product.category.name,
          status: product.status,
          quantity: product.quantity,
          variants: product.variants.length,
          createdAt: product.createdAt
        }));

        return sendResponse({
          data: csvData,
          success: true,
          message: 'Products exported successfully'
        });

      default:
        return sendResponse({
          data: null,
          success: false,
          message: 'Invalid action specified'
        });
    }

    return sendResponse({
      data: result,
      success: true,
      message: `Bulk ${action} completed successfully`
    });

  } catch (e: any) {
    console.error('Bulk product operation error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to perform bulk operation'
    });
  }
}

// Get analytics for products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const whereClause = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get comprehensive product analytics
    const analytics = await Promise.all([
      // Total products
      prisma.product.count(),
      
      // Products by status
      prisma.product.groupBy({
        by: ['status'],
        _count: true,
        where: whereClause
      }),
      
      // Products by category
      prisma.product.groupBy({
        by: ['categoryId'],
        _count: true,
        where: whereClause
      }),
      
      // Low stock products
      prisma.product.count({
        where: {
          OR: [
            { quantity: { lte: 10 } },
            { 
              AND: [
                { lowStockAlert: { not: null } },
                { quantity: { lte: prisma.product.fields.lowStockAlert } }
              ]
            }
          ]
        }
      }),
      
      // Top selling products (by order items)
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: true,
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10
      }),
      
      // Recent products
      prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          category: { select: { name: true } }
        }
      })
    ]);

    const [
      totalProducts,
      productsByStatus,
      productsByCategory,
      lowStockCount,
      topSellingProducts,
      recentProducts
    ] = analytics;

    // Get product names for top selling products
    const topSellingProductIds = topSellingProducts.map(p => p.productId);
    const topSellingProductDetails = await prisma.product.findMany({
      where: { id: { in: topSellingProductIds } },
      select: { id: true, name: true, price: true, images: true }
    });

    const topSellingWithDetails = topSellingProducts.map(item => ({
      ...item,
      product: topSellingProductDetails.find(p => p.id === item.productId)
    }));

    return sendResponse({
      data: {
        overview: {
          totalProducts,
          lowStockCount,
          activeProducts: productsByStatus.find(s => s.status === 'active')?._count || 0,
          draftProducts: productsByStatus.find(s => s.status === 'draft')?._count || 0
        },
        productsByStatus: productsByStatus.map(item => ({
          status: item.status,
          count: item._count
        })),
        productsByCategory,
        topSellingProducts: topSellingWithDetails,
        recentProducts
      },
      success: true,
      message: 'Product analytics fetched successfully'
    });

  } catch (e: any) {
    console.error('Product analytics error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to fetch product analytics'
    });
  }
}
