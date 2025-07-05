import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

// GET /api/order/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        phone: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                sku: true,
                                price: true
                            }
                        },
                        variant: {
                            select: {
                                id: true,
                                name: true,
                                value: true,
                                sku: true,
                                price: true
                            }
                        }
                    }
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        paymentMethod: true,
                        transactionId: true,
                        createdAt: true,
                        processedAt: true
                    }
                }
            }
        });

        if (!order) {
            return sendResponse({
                data: null,
                message: "Order not found",
                success: false
            });
        }

        return sendResponse({
            data: order,
            message: "Order fetched successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to fetch order",
            success: false
        });
    }
}

// PUT /api/order/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const requestBody: any = await request.json();

        const {
            status,
            paymentStatus,
            shippingStatus,
            notes,
            shippingAddress,
            billingAddress,
            items,
            subtotal,
            taxAmount,
            shippingAmount,
            discountAmount,
            totalAmount
        } = requestBody;

        // Update order
        const updateData: any = {};
        
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (shippingStatus) updateData.shippingStatus = shippingStatus;
        if (notes !== undefined) updateData.notes = notes;
        if (shippingAddress) updateData.shippingAddress = shippingAddress;
        if (billingAddress) updateData.billingAddress = billingAddress;
        if (subtotal !== undefined) updateData.subtotal = subtotal;
        if (taxAmount !== undefined) updateData.taxAmount = taxAmount;
        if (shippingAmount !== undefined) updateData.shippingAmount = shippingAmount;
        if (discountAmount !== undefined) updateData.discountAmount = discountAmount;
        if (totalAmount !== undefined) updateData.totalAmount = totalAmount;

        // Set processing timestamps
        if (status === 'processing' && !updateData.processedAt) {
            updateData.processedAt = new Date();
        }
        if (shippingStatus === 'shipped' && !updateData.shippedAt) {
            updateData.shippedAt = new Date();
        }
        if (shippingStatus === 'delivered' && !updateData.deliveredAt) {
            updateData.deliveredAt = new Date();
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                payments: true
            }
        });

        return sendResponse({
            data: updatedOrder,
            message: "Order updated successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to update order",
            success: false
        });
    }
}

// DELETE /api/order/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Check if order exists and can be deleted
        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: { payments: true }
        });

        if (!existingOrder) {
            return sendResponse({
                data: null,
                message: "Order not found",
                success: false
            });
        }

        // Prevent deletion of orders with successful payments
        const hasSuccessfulPayments = existingOrder.payments.some(
            payment => payment.status === 'paid'
        );

        if (hasSuccessfulPayments && existingOrder.status !== 'cancelled') {
            return sendResponse({
                data: null,
                message: "Cannot delete order with successful payments. Cancel the order instead.",
                success: false
            });
        }

        await prisma.order.delete({
            where: { id }
        });

        return sendResponse({
            data: { id },
            message: "Order deleted successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to delete order",
            success: false
        });
    }
}
