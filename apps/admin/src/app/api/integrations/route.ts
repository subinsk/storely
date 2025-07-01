import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockIntegrations = [
  {
    id: '1',
    name: 'Salesforce CRM',
    type: 'crm',
    provider: 'Salesforce',
    isConnected: true,
    isEnabled: true,
    lastSync: new Date().toISOString(),
    icon: 'simple-icons:salesforce',
    description: 'Sync customers and orders with Salesforce CRM',
    features: ['Customer sync', 'Order sync', 'Lead generation', 'Sales pipeline'],
    config: {
      apiKey: '****-****-****-1234',
      syncInterval: 'hourly',
      syncCustomers: true,
      syncOrders: true
    }
  },
  {
    id: '2',
    name: 'HubSpot CRM',
    type: 'crm',
    provider: 'HubSpot',
    isConnected: false,
    isEnabled: false,
    icon: 'simple-icons:hubspot',
    description: 'Connect with HubSpot for marketing automation and CRM',
    features: ['Contact management', 'Marketing automation', 'Deal tracking', 'Email campaigns']
  },
  {
    id: '3',
    name: 'Mailchimp',
    type: 'email',
    provider: 'Mailchimp',
    isConnected: true,
    isEnabled: true,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'simple-icons:mailchimp',
    description: 'Email marketing and customer segmentation',
    features: ['Email campaigns', 'Customer lists', 'Automation', 'Analytics'],
    config: {
      apiKey: '****-****-****-5678',
      audienceId: 'aud_123456',
      syncCustomers: true
    }
  },
];

const mockSyncLogs = [
  {
    id: '1',
    integrationId: '1',
    integrationName: 'Salesforce CRM',
    type: 'sync',
    status: 'success',
    timestamp: new Date().toISOString(),
    recordsProcessed: 150,
    duration: '2 minutes'
  },
  {
    id: '2',
    integrationId: '3',
    integrationName: 'Mailchimp',
    type: 'export',
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    recordsProcessed: 50,
    duration: '30 seconds'
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'logs') {
      return NextResponse.json({
        success: true,
        data: mockSyncLogs
      });
    }

    // Return integrations by default
    return NextResponse.json({
      success: true,
      data: mockIntegrations
    });
  } catch (error) {
    console.error('Integrations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, integrationId } = body;

    if (action === 'connect') {
      const { apiKey, domain, audienceId } = body;

      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'API key is required' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Integration connected successfully',
        data: {
          integrationId,
          isConnected: true,
          connectedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'disconnect') {
      return NextResponse.json({
        success: true,
        message: 'Integration disconnected successfully',
        data: {
          integrationId,
          isConnected: false,
          disconnectedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'toggle') {
      const { enabled } = body;
      
      return NextResponse.json({
        success: true,
        message: `Integration ${enabled ? 'enabled' : 'disabled'} successfully`,
        data: {
          integrationId,
          isEnabled: enabled,
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === 'sync') {
      // Simulate sync process
      return NextResponse.json({
        success: true,
        message: 'Sync completed successfully',
        data: {
          integrationId,
          lastSync: new Date().toISOString(),
          recordsProcessed: Math.floor(Math.random() * 200) + 10,
          duration: `${Math.floor(Math.random() * 5) + 1} minutes`
        }
      });
    }

    if (action === 'test_connection') {
      // Simulate connection test
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Connection test successful'
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Connection test failed - check your credentials' },
          { status: 400 }
        );
      }
    }

    if (action === 'update_config') {
      const { config } = body;
      
      return NextResponse.json({
        success: true,
        message: 'Configuration updated successfully',
        data: {
          integrationId,
          config,
          updatedAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Integrations API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
