import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Add category filter
    if (category) {
      where.categoryId = category;
    }
    
    // Add status filter
    if (status) {
      where.isActive = status === 'active';
    }
    
    // Get products and total count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          images: {
            select: {
              id: true,
              url: true,
              alt: true,
              isPrimary: true
            }
          },
          _count: {
            select: {
              orderItems: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      }),
      prisma.product.count({ where })
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage
      }
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      categoryId,
      isActive,
      stockQuantity,
      lowStockThreshold,
      weight,
      dimensions,
      images,
      variants,
      seoTitle,
      seoDescription,
      tags
    } = body;
    
    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }
    
    // Create product with related data
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        sku,
        categoryId,
        isActive: isActive ?? true,
        stockQuantity: stockQuantity || 0,
        lowStockThreshold: lowStockThreshold || 5,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        seoTitle,
        seoDescription,
        tags: tags || [],
        images: images ? {
          create: images.map((image: any, index: number) => ({
            url: image.url,
            alt: image.alt || name,
            isPrimary: index === 0
          }))
        } : undefined,
        variants: variants ? {
          create: variants.map((variant: any) => ({
            name: variant.name,
            value: variant.value,
            price: variant.price ? parseFloat(variant.price) : null,
            sku: variant.sku,
            stockQuantity: variant.stockQuantity || 0
          }))
        } : undefined
      },
      include: {
        category: true,
        images: true,
        variants: true
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
