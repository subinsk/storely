import { NextRequest, NextResponse } from 'next/server';

// Customer segmentation API without authentication for demo purposes

// Mock data for customer segments
const mockSegments = [
  {
    id: '1',
    name: 'VIP Customers',
    description: 'High-value customers with total spent > $1000',
    color: '#FFD700',
    rules: [
      { field: 'totalSpent', operator: '>', value: 1000, condition: 'and' },
      { field: 'totalOrders', operator: '>', value: 5, condition: 'and' }
    ],
    customerCount: 45,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'New Customers',
    description: 'Customers registered in the last 30 days',
    color: '#4CAF50',
    rules: [
      { field: 'registrationDate', operator: 'last_days', value: 30, condition: 'and' }
    ],
    customerCount: 123,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'At Risk Customers',
    description: 'Customers who haven\'t ordered in 90+ days',
    color: '#FF5722',
    rules: [
      { field: 'lastOrderDate', operator: 'older_than_days', value: 90, condition: 'and' },
      { field: 'totalOrders', operator: '>', value: 1, condition: 'and' }
    ],
    customerCount: 67,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Frequent Buyers',
    description: 'Customers with 10+ orders',
    color: '#2196F3',
    rules: [
      { field: 'totalOrders', operator: '>=', value: 10, condition: 'and' }
    ],
    customerCount: 89,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    totalOrders: 15,
    totalSpent: 2450.50,
    averageOrderValue: 163.37,
    lastOrderDate: '2024-06-28',
    registrationDate: '2023-01-15',
    segments: ['1', '4']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    totalOrders: 3,
    totalSpent: 450.25,
    averageOrderValue: 150.08,
    lastOrderDate: '2024-06-25',
    registrationDate: '2024-06-01',
    segments: ['2']
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    totalOrders: 8,
    totalSpent: 1850.75,
    averageOrderValue: 231.34,
    lastOrderDate: '2024-03-15',
    registrationDate: '2023-08-10',
    segments: ['1', '3']
  }
];

// GET: Fetch segments and customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const segmentId = searchParams.get('segmentId');

    let data = {};

    switch (type) {
      case 'segments':
        data = { segments: mockSegments };
        break;
      case 'customers':
        if (segmentId) {
          const segmentCustomers = mockCustomers.filter(customer => 
            customer.segments.includes(segmentId)
          );
          data = { customers: segmentCustomers };
        } else {
          data = { customers: mockCustomers };
        }
        break;
      case 'analytics':
        // Generate segment analytics
        const analytics = mockSegments.map(segment => ({
          segmentId: segment.id,
          name: segment.name,
          customerCount: segment.customerCount,
          totalRevenue: segment.customerCount * (Math.random() * 500 + 100),
          averageOrderValue: Math.random() * 200 + 50,
          growthRate: (Math.random() - 0.5) * 20
        }));
        data = { analytics };
        break;
      default:
        data = {
          segments: mockSegments,
          customers: mockCustomers
        };
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Customer segmentation fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer segmentation data' },
      { status: 500 }
    );
  }
}

// POST: Create new segment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, rules } = body;

    const newSegment = {
      id: Date.now().toString(),
      name,
      description,
      color,
      rules,
      customerCount: Math.floor(Math.random() * 100) + 10,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    mockSegments.push(newSegment);

    return NextResponse.json({
      success: true,
      data: newSegment,
      message: 'Customer segment created successfully'
    });

  } catch (error) {
    console.error('Customer segment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer segment' },
      { status: 500 }
    );
  }
}

// PUT: Update segment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, color, rules, isActive } = body;

    const segmentIndex = mockSegments.findIndex(segment => segment.id === id);
    
    if (segmentIndex === -1) {
      return NextResponse.json(
        { error: 'Segment not found' },
        { status: 404 }
      );
    }

    mockSegments[segmentIndex] = {
      ...mockSegments[segmentIndex],
      name: name ?? mockSegments[segmentIndex].name,
      description: description ?? mockSegments[segmentIndex].description,
      color: color ?? mockSegments[segmentIndex].color,
      rules: rules ?? mockSegments[segmentIndex].rules,
      isActive: isActive ?? mockSegments[segmentIndex].isActive,
      customerCount: Math.floor(Math.random() * 100) + 10 // Recalculate customer count
    };

    return NextResponse.json({
      success: true,
      data: mockSegments[segmentIndex],
      message: 'Segment updated successfully'
    });

  } catch (error) {
    console.error('Segment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update segment' },
      { status: 500 }
    );
  }
}

// DELETE: Remove segment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Segment ID is required' },
        { status: 400 }
      );
    }

    const segmentIndex = mockSegments.findIndex(segment => segment.id === id);
    
    if (segmentIndex === -1) {
      return NextResponse.json(
        { error: 'Segment not found' },
        { status: 404 }
      );
    }

    mockSegments.splice(segmentIndex, 1);

    // Remove segment from customers
    mockCustomers.forEach(customer => {
      customer.segments = customer.segments.filter(segmentId => segmentId !== id);
    });

    return NextResponse.json({
      success: true,
      message: 'Segment deleted successfully'
    });

  } catch (error) {
    console.error('Segment deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete segment' },
      { status: 500 }
    );
  }
}
