import { NextResponse } from 'next/server';

// Mock system configuration data
const mockSystemConfig = {
  general: {
    siteName: 'Storely Admin',
    siteUrl: 'https://admin.storely.com',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'USD',
    maintenanceMode: false,
    debugMode: false,
  },
  performance: {
    cacheEnabled: true,
    compressionEnabled: true,
    minifyAssets: true,
    enableCDN: false,
    sessionTimeout: 30,
    maxFileUploadSize: 10,
    enableAPIRateLimit: true,
    apiRateLimitPerMinute: 1000,
  },
  email: {
    provider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'admin@storely.com',
    smtpPassword: '********',
    fromName: 'Storely Admin',
    fromEmail: 'noreply@storely.com',
    enableEmailNotifications: true,
  },
  security: {
    enableTwoFactorAuth: true,
    sessionSecure: true,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableAuditLogs: true,
    logRetentionDays: 90,
  },
  backup: {
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionPeriod: 30,
    compressionEnabled: true,
    encryptionEnabled: true,
    remoteBackupEnabled: false,
    remoteBackupProvider: 's3',
  },
  integrations: {
    enableWebhooks: true,
    webhookSecret: 'webhook_secret_key',
    enableAPIAccess: true,
    apiKeys: [
      { id: '1', name: 'Mobile App', key: 'api_key_1', lastUsed: new Date().toISOString() },
      { id: '2', name: 'Third Party Integration', key: 'api_key_2', lastUsed: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
};

const mockSystemInfo = {
  version: '3.0.0',
  buildNumber: '20250630.1',
  environment: 'production',
  uptime: '15 days, 8 hours, 32 minutes',
  serverTime: new Date().toISOString(),
  databaseVersion: 'PostgreSQL 15.2',
  nodeVersion: '18.17.0',
  memoryUsage: {
    used: 2.4,
    total: 8.0,
    unit: 'GB',
  },
  diskUsage: {
    used: 45.2,
    total: 100.0,
    unit: 'GB',
  },
  activeConnections: 24,
  requestsPerMinute: 150,
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      if (section === 'info') {
        return NextResponse.json({
          success: true,
          data: mockSystemInfo,
        });
      }
      
      if (mockSystemConfig[section as keyof typeof mockSystemConfig]) {
        return NextResponse.json({
          success: true,
          data: mockSystemConfig[section as keyof typeof mockSystemConfig],
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'Invalid section' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mockSystemConfig,
      info: mockSystemInfo,
    });
  } catch (error) {
    console.error('System configuration fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { section, config } = body;

    if (!section || !config) {
      return NextResponse.json(
        { success: false, error: 'Section and config are required' },
        { status: 400 }
      );
    }

    // In a real application, you would validate and save the configuration
    console.log(`Updating ${section} configuration:`, config);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: `${section} configuration updated successfully`,
      data: config,
    });
  } catch (error) {
    console.error('System configuration update error:', error);
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

    switch (action) {
      case 'test_email':
        // Simulate email test
        await new Promise(resolve => setTimeout(resolve, 2000));
        return NextResponse.json({
          success: true,
          message: 'Test email sent successfully',
        });

      case 'generate_api_key':
        const newApiKey = {
          id: Date.now().toString(),
          name: data.name,
          key: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          lastUsed: null,
        };
        return NextResponse.json({
          success: true,
          message: 'API key generated successfully',
          data: newApiKey,
        });

      case 'revoke_api_key':
        return NextResponse.json({
          success: true,
          message: 'API key revoked successfully',
        });

      case 'clear_cache':
        await new Promise(resolve => setTimeout(resolve, 1000));
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully',
        });

      case 'restart_service':
        await new Promise(resolve => setTimeout(resolve, 3000));
        return NextResponse.json({
          success: true,
          message: 'Service restarted successfully',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('System configuration action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
