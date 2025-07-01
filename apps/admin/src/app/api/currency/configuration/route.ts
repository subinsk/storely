import { NextRequest, NextResponse } from 'next/server';

// Multi-currency management API without authentication for demo purposes

// Mock data for currencies
const mockCurrencies = [
  {
    id: '1',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchangeRate: 1.0,
    isDefault: true,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    autoUpdate: false
  },
  {
    id: '2',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    exchangeRate: 0.85,
    isDefault: false,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true
  },
  {
    id: '3',
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    exchangeRate: 0.73,
    isDefault: false,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true
  },
  {
    id: '4',
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    exchangeRate: 110.0,
    isDefault: false,
    isActive: false,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true
  }
];

const mockExchangeRateProviders = [
  { 
    id: 'fixer', 
    name: 'Fixer.io', 
    apiKey: '',
    isActive: false,
    updateInterval: 'daily'
  },
  { 
    id: 'openexchange', 
    name: 'Open Exchange Rates', 
    apiKey: '',
    isActive: false,
    updateInterval: 'daily'
  }
];

// GET: Fetch currencies and configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data = {};

    switch (type) {
      case 'currencies':
        data = { currencies: mockCurrencies };
        break;
      case 'providers':
        data = { providers: mockExchangeRateProviders };
        break;
      case 'rates':
        // Simulate fetching latest exchange rates
        const rates = mockCurrencies.reduce((acc, currency) => {
          acc[currency.code] = currency.exchangeRate;
          return acc;
        }, {} as Record<string, number>);
        data = { rates };
        break;
      default:
        data = {
          currencies: mockCurrencies,
          providers: mockExchangeRateProviders
        };
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Currency configuration fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currency configuration' },
      { status: 500 }
    );
  }
}

// POST: Add new currency or configure provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'currency':
        result = {
          id: Date.now().toString(),
          ...data,
          isActive: true,
          isDefault: false,
          lastUpdated: new Date().toISOString()
        };
        mockCurrencies.push(result);
        break;

      case 'provider':
        const providerIndex = mockExchangeRateProviders.findIndex(p => p.id === data.provider);
        if (providerIndex !== -1) {
          mockExchangeRateProviders[providerIndex] = {
            ...mockExchangeRateProviders[providerIndex],
            ...data,
            isActive: true
          };
          result = mockExchangeRateProviders[providerIndex];
        }
        break;

      case 'update-rates':
        // Simulate updating exchange rates from provider
        mockCurrencies.forEach((currency, index) => {
          if (!currency.isDefault && currency.autoUpdate) {
            mockCurrencies[index] = {
              ...currency,
              exchangeRate: currency.exchangeRate * (0.95 + Math.random() * 0.1),
              lastUpdated: new Date().toISOString()
            };
          }
        });
        result = { message: 'Exchange rates updated successfully' };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Currency ${type} processed successfully`
    });

  } catch (error) {
    console.error('Currency configuration creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process currency configuration' },
      { status: 500 }
    );
  }
}

// PUT: Update currency or provider configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    let updated = false;

    switch (type) {
      case 'currency':
        const currencyIndex = mockCurrencies.findIndex(currency => currency.id === id);
        if (currencyIndex !== -1) {
          // If setting as default, update all other currencies
          if (data.isDefault) {
            mockCurrencies.forEach((currency, index) => {
              mockCurrencies[index] = {
                ...currency,
                isDefault: currency.id === id,
                exchangeRate: currency.id === id ? 1.0 : currency.exchangeRate
              };
            });
          } else {
            mockCurrencies[currencyIndex] = {
              ...mockCurrencies[currencyIndex],
              ...data,
              lastUpdated: new Date().toISOString()
            };
          }
          updated = true;
        }
        break;

      case 'provider':
        const providerIndex = mockExchangeRateProviders.findIndex(provider => provider.id === id);
        if (providerIndex !== -1) {
          mockExchangeRateProviders[providerIndex] = {
            ...mockExchangeRateProviders[providerIndex],
            ...data
          };
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
        { error: `${type} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${type} updated successfully`
    });

  } catch (error) {
    console.error('Currency configuration update error:', error);
    return NextResponse.json(
      { error: 'Failed to update currency configuration' },
      { status: 500 }
    );
  }
}

// DELETE: Remove currency
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Currency ID is required' },
        { status: 400 }
      );
    }

    const currencyIndex = mockCurrencies.findIndex(currency => currency.id === id);
    
    if (currencyIndex === -1) {
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 404 }
      );
    }

    // Check if it's the default currency
    if (mockCurrencies[currencyIndex].isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default currency' },
        { status: 400 }
      );
    }

    mockCurrencies.splice(currencyIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Currency deleted successfully'
    });

  } catch (error) {
    console.error('Currency deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete currency' },
      { status: 500 }
    );
  }
}
