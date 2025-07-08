import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const performanceMetricSchema = z.object({
  name: z.string(),
  value: z.number(),
  timestamp: z.string().transform(str => new Date(str)),
  url: z.string().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const metric = performanceMetricSchema.parse(body);

    // In a real implementation, you would save this to a database
    // For now, we'll just log it
    console.log('Performance metric received:', {
      name: metric.name,
      value: metric.value,
      timestamp: metric.timestamp,
      url: metric.url,
      userId: metric.userId,
      sessionId: metric.sessionId,
      metadata: metric.metadata,
    });

    // You could also send to external monitoring services like:
    // - New Relic
    // - DataDog
    // - Sentry
    // - Google Analytics
    // - Custom analytics service

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing performance metric:', error);
    return NextResponse.json(
      { error: 'Failed to process performance metric' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // In a real implementation, you would query your database
    // For now, return mock data
    const mockMetrics = [
      {
        name: 'page_load_time',
        value: 1250,
        timestamp: new Date(),
        url: 'https://example.com/home',
        sessionId,
        userId,
      },
      {
        name: 'lcp',
        value: 2100,
        timestamp: new Date(),
        url: 'https://example.com/home',
        sessionId,
        userId,
      },
      {
        name: 'cls',
        value: 0.05,
        timestamp: new Date(),
        url: 'https://example.com/home',
        sessionId,
        userId,
      },
    ];

    return NextResponse.json({ metrics: mockMetrics });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}
