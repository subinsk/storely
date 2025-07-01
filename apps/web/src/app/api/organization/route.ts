import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch this from your database
    // For now, return mock data
    const organization = {
      id: 'org-1',
      name: 'Furnerio Store',
      subdomain: 'default',
      logo: '/logo/logo_single.svg'
    };

    const store = {
      id: 'store-1',
      name: 'Main Store',
      organizationId: 'org-1'
    };

    return NextResponse.json({
      organization,
      store
    });
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization data' },
      { status: 500 }
    );
  }
}
