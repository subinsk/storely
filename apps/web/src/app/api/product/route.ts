import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { slugify } from "@/utils/slugify";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const slug = searchParams.get('slug')
        const id = searchParams.get('id')
        const categoryId = searchParams.get('categoryId')

        let products: any = []

        if (slug) {
            products = await prisma.product.findUnique({
                where: {
                    slug: slug
                },
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true
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
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }
        else if (categoryId) {
            products = await prisma.product.findMany({
                where: {
                    categoryId: categoryId
                },
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }
        else {
            products = await prisma.product.findMany({
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        }
        return sendResponse({
            data: products,
            success: true,
            message: 'Products fetched successfully'
        })
    }
    catch (e: any) {
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to fetch products'
        })
    }
}

export async function POST(request: Request) {
    try {
        const res: any = await request.json()
        const {
            categoryId,
            ...rest
        } = res

        const createProductResponse = await prisma.product.create({
            data: {
                ...rest,
                slug: slugify(`${res.name}-${res.sku}`),
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })

        return sendResponse({
            data: createProductResponse,
            success: true,
            message: 'Product created successfully'
        })
    }
    catch (e: any) {
        return sendResponse({
            data: e.message,
            success: false,
            message: 'Failed to create product'
        })
    }
}

export async function PUT(request: Request) {
    try {
        const res: any = await request.json()

        const updateProductResponse = await prisma.product.update({
            where: {
                id: res.id
            },
            data: {
                ...res,
                slug: slugify(`${res.name}-${res.sku}`),
            }
        })

        return sendResponse({
            data: updateProductResponse,
            success: true,
            message: 'Product updated successfully'
        })
    }
    catch (e: any) {
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