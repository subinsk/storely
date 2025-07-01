import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

// PATCH /api/order/[id]/payment-status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { paymentStatus } = await request.json();

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { paymentStatus },
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
            message: "Payment status updated successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to update payment status",
            success: false
        });
    }
}
