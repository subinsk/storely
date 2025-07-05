import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

// PATCH /api/order/[id]/shipping-status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { shippingStatus, trackingNumber } = await request.json();

        const updateData: any = { shippingStatus };
        
        // Set appropriate timestamps
        if (shippingStatus === 'shipped') {
            updateData.shippedAt = new Date();
        }
        if (shippingStatus === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        // Store tracking number in notes for now (could be added to schema later)
        if (trackingNumber) {
            const existingOrder = await prisma.order.findUnique({
                where: { id },
                select: { notes: true }
            });

            const existingNotes = existingOrder?.notes || '';
            const trackingNote = `Tracking Number: ${trackingNumber}`;
            
            updateData.notes = existingNotes 
                ? `${existingNotes}\n${trackingNote}`
                : trackingNote;
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
            message: "Shipping status updated successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to update shipping status",
            success: false
        });
    }
}
