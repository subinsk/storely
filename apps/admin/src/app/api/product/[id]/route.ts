import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { slugify } from "@storely/shared/utils/slugify";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: {
        id: id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        variants: {
          orderBy: {
            position: 'asc'
          }
        },
        inventory: {
          include: {
            variant: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!product) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Product not found'
      });
    }

    return sendResponse({
      data: product,
      success: true,
      message: 'Product fetched successfully'
    });
  } catch (e: any) {
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to fetch product'
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      categoryId,
      variants,
      inventory,
      ...productData
    } = body;

    // Update product with transaction to ensure data consistency
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update main product
      const product = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          slug: productData.name ? slugify(`${productData.name}-${productData.sku || id}`) : undefined,
          ...(categoryId && {
            category: {
              connect: { id: categoryId }
            }
          })
        }
      });

      // Handle variants if provided
      if (variants && Array.isArray(variants)) {
        // Delete existing variants
        await tx.productVariant.deleteMany({
          where: { productId: id }
        });

        // Create new variants
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((variant: any, index: number) => ({
              productId: id,
              name: variant.name,
              value: variant.value,
              sku: variant.sku,
              price: variant.price,
              comparePrice: variant.comparePrice,
              weight: variant.weight,
              image: variant.image,
              position: variant.position || index
            }))
          });
        }
      }

      // Handle inventory if provided
      if (inventory && Array.isArray(inventory)) {
        // Delete existing inventory
        await tx.productInventory.deleteMany({
          where: { productId: id }
        });

        // Create new inventory records
        if (inventory.length > 0) {
          await tx.productInventory.createMany({
            data: inventory.map((inv: any) => ({
              productId: id,
              variantId: inv.variantId,
              quantity: inv.quantity || 0,
              reservedQuantity: inv.reservedQuantity || 0,
              location: inv.location,
              cost: inv.cost,
              lastRestocked: inv.lastRestocked ? new Date(inv.lastRestocked) : undefined
            }))
          });
        }
      }

      return product;
    });

    return sendResponse({
      data: updatedProduct,
      success: true,
      message: 'Product updated successfully'
    });
  } catch (e: any) {
    console.error('Product update error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to update product'
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true
      }
    });

    if (!product) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product has orders
    if (product.orderItems.length > 0) {
      // Archive instead of delete if it has orders
      const archivedProduct = await prisma.product.update({
        where: { id },
        data: {
          status: 'archived'
        }
      });

      return sendResponse({
        data: archivedProduct,
        success: true,
        message: 'Product archived successfully (cannot delete products with orders)'
      });
    }

    // Delete product (variants and inventory will be cascade deleted)
    await prisma.product.delete({
      where: { id }
    });

    return sendResponse({
      data: null,
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (e: any) {
    console.error('Product deletion error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to delete product'
    });
  }
}
