import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationContext } from '@/lib/organization-context';

// Mock products data - replace with actual database calls
const mockProducts = [
  {
    id: '1',
    name: 'Modern Sofa',
    slug: 'modern-sofa',
    price: 899.99,
    mrp: 1199.99,
    images: ['/assets/images/sofa-1.jpg', '/assets/images/sofa-2.jpg'],
    sku: 'SF001',
    quantity: 5,
    subDescription: 'Comfortable modern sofa perfect for living rooms',
    newLabel: true,
    categoryId: '1',
    organizationId: '1',
    isActive: true,
    rating: 4.5,
    reviewCount: 23,
    description: 'A beautifully crafted modern sofa that combines comfort with style. Perfect for contemporary living spaces.',
    features: ['High-quality fabric', 'Sturdy wooden frame', 'Easy to clean'],
    specifications: {
      material: 'Fabric',
      dimensions: '200cm x 90cm x 80cm',
      weight: '45kg',
      color: 'Gray'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Dining Table Set',
    slug: 'dining-table-set',
    price: 1299.99,
    mrp: 1599.99,
    images: ['/assets/images/table-1.jpg', '/assets/images/table-2.jpg'],
    sku: 'DT001',
    quantity: 3,
    subDescription: 'Elegant dining table set for 6 people',
    saleLabel: 'Sale',
    categoryId: '2',
    organizationId: '1',
    isActive: true,
    rating: 4.8,
    reviewCount: 15,
    description: 'An elegant dining table set that seats 6 people comfortably. Made from premium wood.',
    features: ['Solid wood construction', 'Seats 6 people', 'Scratch resistant'],
    specifications: {
      material: 'Solid Wood',
      dimensions: '180cm x 90cm x 75cm',
      weight: '60kg',
      color: 'Natural Wood'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Office Chair',
    slug: 'office-chair',
    price: 299.99,
    mrp: 399.99,
    images: ['/assets/images/chair-1.jpg', '/assets/images/chair-2.jpg'],
    sku: 'OC001',
    quantity: 12,
    subDescription: 'Ergonomic office chair with lumbar support',
    categoryId: '3',
    organizationId: '1',
    isActive: true,
    rating: 4.3,
    reviewCount: 42,
    description: 'An ergonomic office chair designed for maximum comfort during long work hours.',
    features: ['Adjustable height', 'Lumbar support', '360° swivel'],
    specifications: {
      material: 'Mesh/Fabric',
      dimensions: '60cm x 60cm x 100-110cm',
      weight: '15kg',
      color: 'Black'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Bookshelf',
    slug: 'bookshelf',
    price: 199.99,
    mrp: 249.99,
    images: ['/assets/images/bookshelf-1.jpg'],
    sku: 'BS001',
    quantity: 8,
    subDescription: '5-tier wooden bookshelf for storage',
    categoryId: '4',
    organizationId: '1',
    isActive: true,
    rating: 4.2,
    reviewCount: 18,
    description: 'A spacious 5-tier bookshelf perfect for organizing books and decorative items.',
    features: ['5 shelves', 'Easy assembly', 'Stable construction'],
    specifications: {
      material: 'Engineered Wood',
      dimensions: '80cm x 30cm x 180cm',
      weight: '25kg',
      color: 'Walnut'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const { organizationId } = getOrganizationContext();
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const sortBy = searchParams.get('sortBy') || 'newest';
  
  try {
    // Filter products
    let filteredProducts = mockProducts.filter(product => 
      product.organizationId === organizationId && product.isActive
    );
    
    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.categoryId === category
      );
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    // Apply pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId } = getOrganizationContext();
    
    // In a real implementation, you would save to database
    const newProduct = {
      id: Date.now().toString(),
      ...body,
      organizationId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
