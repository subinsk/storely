import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '../../../services/analytics.service';

// GET /api/analytics - Get dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const organizationId = request.headers.get('x-organization-id');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const dateRange = startDate && endDate 
      ? { startDate: new Date(startDate), endDate: new Date(endDate) }
      : undefined;

    const analytics = analyticsService(organizationId);
    const metrics = await analytics.getDashboardMetrics(dateRange);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
