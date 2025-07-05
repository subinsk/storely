import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

// PATCH /api/order/[id]/status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { status } = await request.json();

        const updateData: any = { status };
        
        // Set appropriate timestamps
        if (status === 'processing') {
            updateData.processedAt = new Date();
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return sendResponse({
            data: updatedOrder,
            message: "Order status updated successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to update order status",
            success: false
        });
    }
}
