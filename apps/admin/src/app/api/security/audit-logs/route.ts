import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockAuditLogs = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    userId: 'admin_123',
    userName: 'John Admin',
    userEmail: 'admin@furnerio.com',
    action: 'DELETE_PRODUCT',
    resource: 'Product',
    resourceId: 'prod_456',
    details: { productName: 'Office Chair', reason: 'Discontinued' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    outcome: 'success',
    severity: 'high'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userId: 'user_789',
    userName: 'Jane Manager',
    userEmail: 'manager@furnerio.com',
    action: 'UPDATE_USER_PERMISSIONS',
    resource: 'User',
    resourceId: 'user_321',
    details: { addedPermissions: ['manage_products'], removedPermissions: [] },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    outcome: 'success',
    severity: 'medium'
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const resource = searchParams.get('resource');
    const outcome = searchParams.get('outcome');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let filteredLogs = [...mockAuditLogs];

    // Apply filters
    if (severity && severity !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.severity === severity);
    }
    if (resource && resource !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.resource === resource);
    }
    if (outcome && outcome !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.outcome === outcome);
    }

    return NextResponse.json({
      success: true,
      data: filteredLogs,
      total: filteredLogs.length
    });
  } catch (error) {
    console.error('Audit logs API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'create_log') {
      // In a real implementation, this would create a new audit log entry
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...data
      };

      return NextResponse.json({
        success: true,
        data: newLog,
        message: 'Audit log created successfully'
      });
    }

    if (action === 'export_logs') {
      // In a real implementation, this would generate an export file
      return NextResponse.json({
        success: true,
        downloadUrl: '/api/exports/audit-logs-export.csv',
        message: 'Audit logs exported successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Audit logs API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
