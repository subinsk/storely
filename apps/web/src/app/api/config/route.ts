import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get('storeId');

  try {
    // In a real application, you would fetch from your database
    // For now, return default configuration
    const config = {
      theme: {
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        headingSize: '2.5rem',
        borderRadius: 8,
        buttonBorderRadius: 8,
        buttonTextTransform: 'none'
      },
      payment: {
        enabledMethods: ['stripe', 'paypal'],
        currency: 'USD'
      },
      shipping: {
        methods: [
          {
            id: 'standard',
            name: 'Standard Shipping',
            price: 9.99,
            estimatedDays: '5-7 business days'
          },
          {
            id: 'express',
            name: 'Express Shipping',
            price: 19.99,
            estimatedDays: '2-3 business days'
          }
        ]
      },
      general: {
        storeName: 'Furnerio Store',
        storeDescription: 'Premium furniture for modern living',
        contactEmail: 'contact@furnerio.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Furniture Street, Design City, DC 12345'
      }
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching store config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store configuration' },
      { status: 500 }
    );
  }
}
