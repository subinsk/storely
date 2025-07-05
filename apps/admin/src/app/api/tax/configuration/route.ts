import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Tax configuration API without authentication for demo purposes
// Mock data for tax management
const mockTaxRates = [
  {
    id: '1',
    name: 'US Sales Tax',
    rate: 8.5,
    type: 'percentage',
    country: 'US',
    state: 'CA',
    city: 'San Francisco',
    productCategories: ['furniture', 'electronics'],
    isActive: true,
    isDefault: true,
    description: 'Standard sales tax for California',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'EU VAT',
    rate: 20,
    type: 'percentage',
    country: 'GB',
    productCategories: ['all'],
    isActive: true,
    isDefault: false,
    description: 'UK Value Added Tax',
    createdAt: new Date().toISOString()
  }
];

const mockTaxRules = [
  {
    id: '1',
    name: 'US Domestic Sales',
    conditions: {
      customerLocation: ['US'],
      productCategories: ['furniture', 'electronics'],
      orderValue: { min: 0 },
      customerType: ['retail']
    },
    taxRates: ['1'],
    priority: 1,
    isActive: true
  },
  {
    id: '2',
    name: 'EU Sales',
    conditions: {
      customerLocation: ['GB', 'DE', 'FR'],
      productCategories: ['all'],
      orderValue: { min: 100 }
    },
    taxRates: ['2'],
    priority: 2,
    isActive: true
  }
];

const mockTaxClasses = [
  {
    id: '1',
    name: 'Standard',
    description: 'Standard tax class for most products',
    rates: ['1', '2'],
    products: 245,
    isDefault: true
  },
  {
    id: '2',
    name: 'Luxury',
    description: 'Tax class for luxury items',
    rates: ['3'],
    products: 12,
    isDefault: false
  }
];

// GET: Fetch tax configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data = {};

    switch (type) {
      case 'rates':
        data = { taxRates: mockTaxRates };
        break;
      case 'rules':
        data = { taxRules: mockTaxRules };
        break;
      case 'classes':
        data = { taxClasses: mockTaxClasses };
        break;
      default:
        data = {
          taxRates: mockTaxRates,
          taxRules: mockTaxRules,
          taxClasses: mockTaxClasses
        };
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Tax configuration fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tax configuration' },
      { status: 500 }
    );
  }
}

// POST: Create new tax rate, rule, or class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let newItem;

    switch (type) {
      case 'rate':
        newItem = {
          id: Date.now().toString(),
          ...data,
          isActive: true,
          isDefault: false,
          createdAt: new Date().toISOString()
        };
        mockTaxRates.push(newItem);
        break;

      case 'rule':
        newItem = {
          id: Date.now().toString(),
          ...data,
          isActive: true
        };
        mockTaxRules.push(newItem);
        break;

      case 'class':
        newItem = {
          id: Date.now().toString(),
          ...data,
          products: 0
        };
        mockTaxClasses.push(newItem);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: newItem,
      message: `Tax ${type} created successfully`
    });

  } catch (error) {
    console.error('Tax configuration creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create tax configuration' },
      { status: 500 }
    );
  }
}

// PUT: Update tax rate, rule, or class
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    let updated = false;

    switch (type) {
      case 'rate':
        const rateIndex = mockTaxRates.findIndex(rate => rate.id === id);
        if (rateIndex !== -1) {
          mockTaxRates[rateIndex] = { ...mockTaxRates[rateIndex], ...data };
          updated = true;
        }
        break;

      case 'rule':
        const ruleIndex = mockTaxRules.findIndex(rule => rule.id === id);
        if (ruleIndex !== -1) {
          mockTaxRules[ruleIndex] = { ...mockTaxRules[ruleIndex], ...data };
          updated = true;
        }
        break;

      case 'class':
        const classIndex = mockTaxClasses.findIndex(cls => cls.id === id);
        if (classIndex !== -1) {
          mockTaxClasses[classIndex] = { ...mockTaxClasses[classIndex], ...data };
          updated = true;
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

    if (!updated) {
      return NextResponse.json(
        { error: `Tax ${type} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tax ${type} updated successfully`
    });

  } catch (error) {
    console.error('Tax configuration update error:', error);
    return NextResponse.json(
      { error: 'Failed to update tax configuration' },
      { status: 500 }
    );
  }
}

// DELETE: Delete tax rate, rule, or class
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    let deleted = false;

    switch (type) {
      case 'rate':
        const rateIndex = mockTaxRates.findIndex(rate => rate.id === id);
        if (rateIndex !== -1) {
          mockTaxRates.splice(rateIndex, 1);
          deleted = true;
        }
        break;

      case 'rule':
        const ruleIndex = mockTaxRules.findIndex(rule => rule.id === id);
        if (ruleIndex !== -1) {
          mockTaxRules.splice(ruleIndex, 1);
          deleted = true;
        }
        break;

      case 'class':
        const classIndex = mockTaxClasses.findIndex(cls => cls.id === id);
        if (classIndex !== -1) {
          mockTaxClasses.splice(classIndex, 1);
          deleted = true;
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

    if (!deleted) {
      return NextResponse.json(
        { error: `Tax ${type} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tax ${type} deleted successfully`
    });

  } catch (error) {
    console.error('Tax configuration deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete tax configuration' },
      { status: 500 }
    );
  }
}
