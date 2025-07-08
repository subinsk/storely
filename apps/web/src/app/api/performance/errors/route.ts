import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const errorReportSchema = z.object({
  id: z.string(),
  message: z.string(),
  stack: z.string(),
  url: z.string(),
  lineNumber: z.number(),
  columnNumber: z.number(),
  timestamp: z.string().transform(str => new Date(str)),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  additionalData: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const error = errorReportSchema.parse(body);

    // In a real implementation, you would save this to a database
    // and potentially send alerts for critical errors
    console.error('Error report received:', {
      id: error.id,
      message: error.message,
      stack: error.stack,
      url: error.url,
      lineNumber: error.lineNumber,
      columnNumber: error.columnNumber,
      timestamp: error.timestamp,
      userId: error.userId,
      sessionId: error.sessionId,
      additionalData: error.additionalData,
    });

    // You could also send to external error tracking services like:
    // - Sentry
    // - Bugsnag
    // - Rollbar
    // - LogRocket
    // - Custom error tracking service

    // Example: Send to Sentry
    // Sentry.captureException(new Error(error.message), {
    //   extra: error.additionalData,
    //   user: { id: error.userId },
    //   tags: {
    //     sessionId: error.sessionId,
    //     url: error.url,
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing error report:', error);
    return NextResponse.json(
      { error: 'Failed to process error report' },
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
    const severity = searchParams.get('severity');

    // In a real implementation, you would query your database
    // For now, return mock data
    const mockErrors = [
      {
        id: 'error_1',
        message: 'Cannot read property of undefined',
        stack: 'TypeError: Cannot read property of undefined\n    at Component.render (app.js:123)',
        url: 'https://example.com/product/123',
        lineNumber: 123,
        columnNumber: 45,
        timestamp: new Date(),
        userId,
        sessionId,
        additionalData: {
          type: 'javascript_error',
          severity: 'error',
        },
      },
      {
        id: 'error_2',
        message: 'Network request failed',
        stack: 'Error: Network request failed\n    at fetch (network.js:67)',
        url: 'https://example.com/cart',
        lineNumber: 67,
        columnNumber: 12,
        timestamp: new Date(),
        userId,
        sessionId,
        additionalData: {
          type: 'network_error',
          severity: 'warning',
        },
      },
    ];

    return NextResponse.json({ errors: mockErrors });
  } catch (error) {
    console.error('Error fetching error reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch error reports' },
      { status: 500 }
    );
  }
}
