import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationContext } from '@/lib/organization-context';

// Mock product data - in real implementation, fetch from database
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
    description: 'A beautifully crafted modern sofa that combines comfort with style. Perfect for contemporary living spaces. This sofa features high-quality fabric upholstery and a sturdy wooden frame that ensures durability and comfort for years to come.',
    features: ['High-quality fabric upholstery', 'Sturdy wooden frame', 'Easy to clean', 'Comfortable seating', 'Modern design'],
    specifications: {
      material: 'Fabric',
      dimensions: '200cm x 90cm x 80cm',
      weight: '45kg',
      color: 'Gray',
      warranty: '2 years'
    },
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent quality and very comfortable!',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Great sofa, good value for money.',
        createdAt: new Date('2024-01-10')
      }
    ],
    relatedProducts: ['2', '4'],
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
    description: 'An elegant dining table set that seats 6 people comfortably. Made from premium solid wood with a beautiful natural finish.',
    features: ['Solid wood construction', 'Seats 6 people', 'Scratch resistant finish', 'Easy assembly'],
    specifications: {
      material: 'Solid Wood',
      dimensions: '180cm x 90cm x 75cm',
      weight: '60kg',
      color: 'Natural Wood',
      warranty: '5 years'
    },
    reviews: [
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Beautiful table, excellent craftsmanship!',
        createdAt: new Date('2024-01-12')
      }
    ],
    relatedProducts: ['1', '3'],
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
    description: 'An ergonomic office chair designed for maximum comfort during long work hours. Features adjustable height and excellent lumbar support.',
    features: ['Adjustable height', 'Lumbar support', '360° swivel', 'Breathable mesh back'],
    specifications: {
      material: 'Mesh/Fabric',
      dimensions: '60cm x 60cm x 100-110cm',
      weight: '15kg',
      color: 'Black',
      warranty: '1 year'
    },
    reviews: [
      {
        id: '4',
        userId: 'user4',
        userName: 'Sarah Wilson',
        rating: 4,
        comment: 'Very comfortable for long work sessions.',
        createdAt: new Date('2024-01-08')
      }
    ],
    relatedProducts: ['4'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { organizationId } = getOrganizationContext();
  
  try {
    const product = mockProducts.find(p => 
      p.slug === slug && 
      p.organizationId === organizationId && 
      p.isActive
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get related products
    const relatedProducts = mockProducts.filter(p =>
      product.relatedProducts.includes(p.id) &&
      p.organizationId === organizationId &&
      p.isActive
    );
    
    return NextResponse.json({
      ...product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
