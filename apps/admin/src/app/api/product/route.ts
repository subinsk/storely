import { prisma } from '@storely/database';
import sendResponse from "@/lib/response";
import { slugify } from "@storely/shared/utils/slugify";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Unauthorized access'
            });
        }

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
            products = await prisma.product.findFirst({
                where: {
                    slug: slug,
                    organizationId: session.user.organizationId!
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
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
                                    image: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            reviews: true,
                            orderItems: true
                        }
                    }
                }
            });
        }
        else if (id) {
            products = await prisma.product.findFirst({
                where: {
                    id: id,
                    organizationId: session.user.organizationId!
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
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
                                    image: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            reviews: true,
                            orderItems: true
                        }
                    }
                }
            });
        }
        else {
            // Build where clause for filtering
            const where: any = {
                organizationId: session.user.organizationId!
            }

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
                // Get products where quantity is less than or equal to lowStockAlert
                where.OR = [
                    { 
                        AND: [
                            { lowStockAlert: { not: null } },
                            { quantity: { lte: 0 } }
                        ]
                    },
                    {
                        quantity: { lte: 5 } // Default low stock threshold
                    }
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
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Unauthorized access'
            });
        }

        const body = await request.json()
        console.log('Creating product with data: ', body)
        
        // Validate required fields
        if (!body.name || !body.categoryId || !body.sku) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Product name, category, and SKU are required'
            });
        }

        // Check if category belongs to organization
        const category = await prisma.category.findFirst({
            where: {
                id: body.categoryId,
                organizationId: session.user.organizationId!
            }
        });

        if (!category) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Invalid category selected'
            });
        }

        // Check for duplicate SKU within organization
        const existingSku = await prisma.product.findFirst({
            where: {
                sku: body.sku,
                organizationId: session.user.organizationId!
            }
        });

        if (existingSku) {
            return sendResponse({
                data: null,
                success: false,
                message: 'A product with this SKU already exists'
            });
        }

        const {
            variants = [],
            ...productData
        } = body

        // Create product with transaction to ensure data consistency
        const newProduct = await prisma.$transaction(async (tx) => {
            // Generate unique slug
            const baseSlug = slugify(`${productData.name}`);
            let slug = baseSlug;
            let counter = 1;
            
            while (await tx.product.findFirst({ 
                where: { 
                    slug, 
                    organizationId: session.user.organizationId! 
                } 
            })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            // Create main product
            const product = await tx.product.create({
                data: {
                    ...productData,
                    slug,
                    organizationId: session.user.organizationId!,
                    categoryId: body.categoryId,
                    publishedAt: productData.status === 'active' ? new Date() : null
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            })

            // Create variants if provided
            if (variants && Array.isArray(variants) && variants.length > 0) {
                const createdVariants = await Promise.all(
                    variants.map(async (variant: any, index: number) => {
                        return await tx.productVariant.create({
                            data: {
                                productId: product.id,
                                name: variant.name,
                                value: variant.value,
                                sku: variant.sku || `${product.sku}-${variant.value.slice(0, 3).toUpperCase()}`,
                                price: variant.price || 0,
                                comparePrice: variant.comparePrice,
                                quantity: variant.quantity || 0,
                                weight: variant.weight,
                                image: variant.image,
                                position: variant.position || index + 1,
                                attributes: variant.attributes || {}
                            }
                        });
                    })
                );

                // Create inventory records for variants
                for (const variant of createdVariants) {
                    await tx.productInventory.create({
                        data: {
                            productId: product.id,
                            variantId: variant.id,
                            quantity: variant.quantity,
                            reservedQuantity: 0,
                            location: 'Main Warehouse'
                        }
                    });
                }
            } else {
                // Create main product inventory
                await tx.productInventory.create({
                    data: {
                        productId: product.id,
                        quantity: productData.quantity || 0,
                        reservedQuantity: 0,
                        location: 'Main Warehouse'
                    }
                });
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
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Unauthorized access'
            });
        }

        const body = await request.json()
        const { id, variants, ...updateData } = body

        if (!id) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Product ID is required for update'
            })
        }

        // Check if product exists and belongs to organization
        const existingProduct = await prisma.product.findFirst({
            where: {
                id,
                organizationId: session.user.organizationId!
            }
        });

        if (!existingProduct) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Product not found or access denied'
            });
        }

        // If categoryId is being updated, verify it belongs to organization
        if (updateData.categoryId) {
            const category = await prisma.category.findFirst({
                where: {
                    id: updateData.categoryId,
                    organizationId: session.user.organizationId!
                }
            });

            if (!category) {
                return sendResponse({
                    data: null,
                    success: false,
                    message: 'Invalid category selected'
                });
            }
        }

        // If SKU is being updated, check for duplicates within organization
        if (updateData.sku && updateData.sku !== existingProduct.sku) {
            const existingSku = await prisma.product.findFirst({
                where: {
                    sku: updateData.sku,
                    organizationId: session.user.organizationId!,
                    id: { not: id }
                }
            });

            if (existingSku) {
                return sendResponse({
                    data: null,
                    success: false,
                    message: 'A product with this SKU already exists'
                });
            }
        }

        // Generate new slug if name is being updated
        if (updateData.name && updateData.name !== existingProduct.name) {
            const baseSlug = slugify(updateData.name);
            let slug = baseSlug;
            let counter = 1;
            
            while (await prisma.product.findFirst({ 
                where: { 
                    slug, 
                    organizationId: session.user.organizationId!,
                    id: { not: id }
                } 
            })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            updateData.slug = slug;
        }

        // Update publishedAt based on status
        if (updateData.status === 'active' && !existingProduct.publishedAt) {
            updateData.publishedAt = new Date();
        } else if (updateData.status === 'draft') {
            updateData.publishedAt = null;
        }

        const updatedProduct = await prisma.$transaction(async (tx) => {
            // Update main product
            const product = await tx.product.update({
                where: { id },
                data: updateData,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
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

            // Update variants if provided
            if (variants && Array.isArray(variants)) {
                // Get existing variants
                const existingVariants = await tx.productVariant.findMany({
                    where: { productId: id }
                });

                // Process variant updates
                for (const variant of variants) {
                    if (variant.id) {
                        // Update existing variant
                        await tx.productVariant.update({
                            where: { id: variant.id },
                            data: {
                                name: variant.name,
                                value: variant.value,
                                sku: variant.sku,
                                price: variant.price,
                                comparePrice: variant.comparePrice,
                                quantity: variant.quantity,
                                weight: variant.weight,
                                image: variant.image,
                                position: variant.position,
                                attributes: variant.attributes
                            }
                        });

                        // Update inventory
                        await tx.productInventory.upsert({
                            where: {
                                productId_variantId_location: {
                                    productId: id,
                                    variantId: variant.id,
                                    location: 'Main Warehouse'
                                }
                            },
                            update: {
                                quantity: variant.quantity || 0
                            },
                            create: {
                                productId: id,
                                variantId: variant.id,
                                quantity: variant.quantity || 0,
                                reservedQuantity: 0,
                                location: 'Main Warehouse'
                            }
                        });
                    } else {
                        // Create new variant
                        const newVariant = await tx.productVariant.create({
                            data: {
                                productId: id,
                                name: variant.name,
                                value: variant.value,
                                sku: variant.sku || `${product.sku}-${variant.value.slice(0, 3).toUpperCase()}`,
                                price: variant.price || 0,
                                comparePrice: variant.comparePrice,
                                quantity: variant.quantity || 0,
                                weight: variant.weight,
                                image: variant.image,
                                position: variant.position,
                                attributes: variant.attributes || {}
                            }
                        });

                        // Create inventory for new variant
                        await tx.productInventory.create({
                            data: {
                                productId: id,
                                variantId: newVariant.id,
                                quantity: newVariant.quantity,
                                reservedQuantity: 0,
                                location: 'Main Warehouse'
                            }
                        });
                    }
                }

                // Remove variants that are no longer in the update
                const variantIds = variants.filter(v => v.id).map(v => v.id);
                const variantsToDelete = existingVariants.filter(ev => !variantIds.includes(ev.id));
                
                for (const variantToDelete of variantsToDelete) {
                    // Delete inventory first
                    await tx.productInventory.deleteMany({
                        where: { variantId: variantToDelete.id }
                    });
                    // Delete variant
                    await tx.productVariant.delete({
                        where: { id: variantToDelete.id }
                    });
                }
            }

            return product;
        });

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
        const session = await getServerSession(authOptions);
        if (!session?.user?.organizationId) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Unauthorized access'
            });
        }

        const body = await request.json()
        const { id } = body;

        if (!id) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Product ID is required for deletion'
            });
        }

        // Check if product exists and belongs to organization
        const existingProduct = await prisma.product.findFirst({
            where: {
                id,
                organizationId: session.user.organizationId!
            },
            include: {
                orderItems: {
                    select: { id: true }
                }
            }
        });

        if (!existingProduct) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Product not found or access denied'
            });
        }

        // Check if product has associated orders (prevent deletion if it does)
        if (existingProduct.orderItems.length > 0) {
            return sendResponse({
                data: null,
                success: false,
                message: 'Cannot delete product that has associated orders. Consider marking it as inactive instead.'
            });
        }

        // Delete product and related data in transaction
        const deletedProduct = await prisma.$transaction(async (tx) => {
            // Delete inventory records
            await tx.productInventory.deleteMany({
                where: { productId: id }
            });

            // Delete variants
            await tx.productVariant.deleteMany({
                where: { productId: id }
            });

            // Delete reviews
            await tx.review.deleteMany({
                where: { productId: id }
            });

            // Delete the product
            return await tx.product.delete({
                where: { id }
            });
        });

        return sendResponse({
            data: deletedProduct,
            success: true,
            message: 'Product deleted successfully'
        })
    }
    catch (e: any) {
        console.error('Product deletion error:', e)
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to delete product'
        })
    }
}
