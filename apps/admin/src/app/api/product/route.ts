import { prisma, validateApiRequest } from "@/lib";
import sendResponse from "@/lib/response";
import { slugify } from "@/utils/slugify";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const slug = searchParams.get('slug')
        const id = searchParams.get('id')
        const search = searchParams.get('search')
        const category = searchParams.get('category')
        const status = searchParams.get('status')
        const featured = searchParams.get('featured')
        const lowStock = searchParams.get('lowStock')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        let products: any = []

        if (slug) {
            products = await prisma.product.findUnique({
                where: {
                    slug: slug
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
                    }
                }
            });
        }
        else if (id) {
            products = await prisma.product.findUnique({
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
                    }
                }
            });
        }
        else {
            // Build where clause for filtering
            const where: any = {}

            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                    { tags: { has: search } }
                ]
            }

            if (category) {
                where.categoryId = category
            }

            if (status) {
                where.status = status
            }

            if (featured !== null && featured !== undefined) {
                where.featured = featured === 'true'
            }

            if (lowStock === 'true') {
                where.OR = [
                    { quantity: { lte: { lowStockAlert: true } } },
                    { AND: [{ lowStockAlert: { not: null } }, { quantity: { lte: { lowStockAlert: true } } }] }
                ]
            }

            // Get total count for pagination
            const total = await prisma.product.count({ where })

            // Get products with pagination
            products = await prisma.product.findMany({
                where,
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
                    _count: {
                        select: {
                            reviews: true,
                            orderItems: true
                        }
                    }
                },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip: (page - 1) * limit,
                take: limit
            })

            // Return paginated response
            return sendResponse({
                data: {
                    products,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                },
                success: true,
                message: 'Products fetched successfully'
            })
        }

        return sendResponse({
            data: products,
            success: true,
            message: 'Products fetched successfully'
        })
    }
    catch (e: any) {
        console.error('Product fetch error:', e)
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to fetch products'
        })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Creating product with data: ', body)
        const {
            categoryId,
            variants,
            inventory,
            ...productData
        } = body

        // Create product with transaction to ensure data consistency
        const newProduct = await prisma.$transaction(async (tx) => {
            // Create main product
            const product = await tx.product.create({
                data: {
                    ...productData,
                    slug: slugify(`${productData.name}-${productData.sku || Date.now()}`),
                    category: {
                        connect: {
                            id: categoryId
                        }
                    }
                }
            })

            // Create variants if provided
            if (variants && Array.isArray(variants) && variants.length > 0) {
                await tx.productVariant.createMany({
                    data: variants.map((variant: any, index: number) => ({
                        productId: product.id,
                        name: variant.name,
                        value: variant.value,
                        sku: variant.sku,
                        price: variant.price,
                        comparePrice: variant.comparePrice,
                        weight: variant.weight,
                        image: variant.image,
                        position: variant.position || index
                    }))
                })
            }

            // Create inventory records if provided
            if (inventory && Array.isArray(inventory) && inventory.length > 0) {
                await tx.productInventory.createMany({
                    data: inventory.map((inv: any) => ({
                        productId: product.id,
                        variantId: inv.variantId,
                        quantity: inv.quantity || 0,
                        reservedQuantity: inv.reservedQuantity || 0,
                        location: inv.location,
                        cost: inv.cost,
                        lastRestocked: inv.lastRestocked ? new Date(inv.lastRestocked) : undefined
                    }))
                })
            }

            return product
        })

        return sendResponse({
            data: newProduct,
            success: true,
            message: 'Product created successfully'
        })
    }
    catch (e: any) {
        console.error('Product creation error:', e)
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to create product'
        })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Product ID is required for update'
            })
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
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
                inventory: true
            }
        })

        return sendResponse({
            data: updatedProduct,
            success: true,
            message: 'Product updated successfully'
        })
    }
    catch (e: any) {
        console.error('Product update error:', e)
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to update product'
        })
    }
}
export async function DELETE(request: Request) {
    try {
        const res: any = await request.json()

        const deleteProductResponse = await prisma.product.delete({
            where: {
                id: res.id
            }
        })

        return sendResponse({
            data: deleteProductResponse,
            success: true,
            message: 'Product deleted successfully'
        })
    }
    catch (e: any) {
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to delete product'
        })
    }
}
