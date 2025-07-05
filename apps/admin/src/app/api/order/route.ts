import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');
        const status = searchParams.get('status');
        const paymentStatus = searchParams.get('paymentStatus');
        const shippingStatus = searchParams.get('shippingStatus');
        const customerId = searchParams.get('customerId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const minAmount = searchParams.get('minAmount');
        const maxAmount = searchParams.get('maxAmount');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build where clause
        const where: any = {};
        
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { 
                    user: {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ];
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        if (paymentStatus) {
            where.paymentStatus = paymentStatus;
        }

        if (shippingStatus) {
            where.shippingStatus = shippingStatus;
        }

        if (customerId) {
            where.userId = customerId;
        }

        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        if (minAmount || maxAmount) {
            where.totalAmount = {};
            if (minAmount) where.totalAmount.gte = parseFloat(minAmount);
            if (maxAmount) where.totalAmount.lte = parseFloat(maxAmount);
        }

        // Get total count for pagination
        const totalCount = await prisma.order.count({ where });

        // Get orders with pagination
        const orders = await prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                sku: true
                            }
                        },
                        variant: {
                            select: {
                                id: true,
                                name: true,
                                value: true
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
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        items: true
                    }
                }
            },
            orderBy: {
                [sortBy]: sortOrder
            },
            skip: (page - 1) * limit,
            take: limit
        });

        return sendResponse({
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    pages: Math.ceil(totalCount / limit)
                }
            },
            message: "Orders fetched successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to fetch orders",
            success: false
        });
    }
}

export async function POST(request: Request) {
    try {
        const requestBody: any = await request.json();
        
        const {
            customerId: userId,
            organizationId,
            items,
            shippingAddress,
            billingAddress,
            notes,
            subtotal,
            taxAmount,
            shippingAmount,
            discountAmount,
            totalAmount
        } = requestBody;

        // Validate required fields
        if (!userId) {
            return sendResponse({
                data: null,
                message: "Customer ID is required",
                success: false
            });
        }

        if (!organizationId) {
            return sendResponse({
                data: null,
                message: "Organization ID is required",
                success: false
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return sendResponse({
                data: null,
                message: "Order items are required",
                success: false
            });
        }

        // Generate order number
        const orderCount = await prisma.order.count();
        const orderNumber = `ORD-${Date.now()}-${String(orderCount + 1).padStart(4, '0')}`;

        const createResponse = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                organizationId,
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
                shippingAddress,
                billingAddress,
                notes,
                status: 'pending',
                paymentStatus: 'pending',
                shippingStatus: 'pending',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.quantity * item.price
                    }))
                }
            },
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                }
            }
        });

        return sendResponse({
            data: createResponse,
            message: "Order created successfully",
            success: true
        });
    } catch (e: any) {
        return sendResponse({
            data: e.message,
            message: "Failed to create order",
            success: false
        });
    }
}

