import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

// PATCH /api/order/bulk - Bulk update orders
export async function PATCH(request: NextRequest) {
    try {
        const { orders } = await request.json();

        if (!Array.isArray(orders) || orders.length === 0) {
            return sendResponse({
                data: null,
                message: "Invalid orders data provided",
                success: false
            });
        }

        // Process bulk updates
        const updatePromises = orders.map(({ id, data }) => {
            const updateData: any = { ...data };
            
            // Set timestamps based on status changes
            if (data.status === 'processing' && !updateData.processedAt) {
                updateData.processedAt = new Date();
            }
            if (data.shippingStatus === 'shipped' && !updateData.shippedAt) {
                updateData.shippedAt = new Date();
            }
            if (data.shippingStatus === 'delivered' && !updateData.deliveredAt) {
                updateData.deliveredAt = new Date();
            }

            return prisma.order.update({
                where: { id },
                data: updateData
            });
        });

        const updatedOrders = await Promise.all(updatePromises);

        return sendResponse({
            data: {
                updated: updatedOrders.length,
                orders: updatedOrders
            },
            message: `${updatedOrders.length} orders updated successfully`,
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to bulk update orders",
            success: false
        });
    }
}

// DELETE /api/order/bulk - Bulk delete orders
export async function DELETE(request: NextRequest) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return sendResponse({
                data: null,
                message: "Invalid order IDs provided",
                success: false
            });
        }

        // Check for orders that cannot be deleted
        const ordersToCheck = await prisma.order.findMany({
            where: { id: { in: ids } },
            include: { 
                payments: {
                    where: { status: 'paid' }
                }
            }
        });

        const cannotDelete = ordersToCheck.filter(order => 
            order.payments.length > 0 && order.status !== 'cancelled'
        );

        if (cannotDelete.length > 0) {
            return sendResponse({
                data: {
                    cannotDelete: cannotDelete.map(o => ({
                        id: o.id,
                        orderNumber: o.orderNumber,
                        reason: 'Has successful payments'
                    }))
                },
                message: `${cannotDelete.length} orders cannot be deleted due to successful payments`,
                success: false
            });
        }

        // Proceed with deletion
        const deleteResult = await prisma.order.deleteMany({
            where: { id: { in: ids } }
        });

        return sendResponse({
            data: {
                deleted: deleteResult.count,
                ids
            },
            message: `${deleteResult.count} orders deleted successfully`,
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to bulk delete orders",
            success: false
        });
    }
}
