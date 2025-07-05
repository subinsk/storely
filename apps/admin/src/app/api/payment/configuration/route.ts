import { NextRequest } from 'next/server';
import { prisma } from '@storely/database';
import sendResponse from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'gateways', 'tax-rules', 'security'

    switch (type) {
      case 'gateways':
        // In a real app, this would fetch from a secure configuration store
        const gateways = [
          {
            id: '1',
            name: 'Stripe',
            type: 'stripe',
            enabled: true,
            testMode: true,
            supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
            fees: { percentage: 2.9, fixed: 0.30 },
            status: 'active'
          },
          {
            id: '2',
            name: 'PayPal',
            type: 'paypal',
            enabled: false,
            testMode: true,
            supportedCurrencies: ['USD', 'EUR', 'GBP'],
            fees: { percentage: 3.49, fixed: 0.49 },
            status: 'inactive'
          },
          {
            id: '3',
            name: 'Razorpay',
            type: 'razorpay',
            enabled: true,
            testMode: true,
            supportedCurrencies: ['INR'],
            fees: { percentage: 2.0, fixed: 0 },
            status: 'active'
          }
        ];
        
        return sendResponse({
          data: gateways,
          message: 'Payment gateways fetched successfully',
          success: true
        });

      case 'tax-rules':
        // Fetch tax rules from database
        // For now, return mock data
        const taxRules = [
          {
            id: '1',
            name: 'US Sales Tax',
            rate: 8.25,
            type: 'percentage',
            country: 'US',
            region: 'CA',
            productCategories: ['all'],
            enabled: true
          },
          {
            id: '2',
            name: 'EU VAT',
            rate: 20,
            type: 'percentage',
            country: 'GB',
            productCategories: ['all'],
            enabled: true
          },
          {
            id: '3',
            name: 'India GST',
            rate: 18,
            type: 'percentage',
            country: 'IN',
            productCategories: ['electronics', 'clothing'],
            enabled: true
          }
        ];

        return sendResponse({
          data: taxRules,
          message: 'Tax rules fetched successfully',
          success: true
        });

      case 'security':
        const securitySettings = {
          pciCompliance: true,
          requireCvv: true,
          enable3dSecure: false,
          fraudDetection: true,
          webhookUrl: process.env.WEBHOOK_URL || '',
          webhookSecret: process.env.WEBHOOK_SECRET || ''
        };

        return sendResponse({
          data: securitySettings,
          message: 'Security settings fetched successfully',
          success: true
        });

      default:
        return sendResponse({
          data: null,
          message: 'Invalid type parameter',
          success: false
        });
    }
  } catch (error: any) {
    console.error('Payment configuration fetch error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to fetch payment configuration',
      success: false
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'gateway-config':
        // In a real app, securely store gateway configuration
        // This would typically use environment variables or a secure vault
        console.log('Saving gateway configuration:', data);
        
        return sendResponse({
          data: { message: 'Gateway configuration saved securely' },
          message: 'Gateway configuration updated successfully',
          success: true
        });

      case 'tax-rule':
        // Create or update tax rule
        console.log('Saving tax rule:', data);
        
        return sendResponse({
          data: { id: Date.now().toString(), ...data },
          message: 'Tax rule saved successfully',
          success: true
        });

      case 'security-settings':
        // Update security settings
        console.log('Updating security settings:', data);
        
        return sendResponse({
          data: data,
          message: 'Security settings updated successfully',
          success: true
        });

      default:
        return sendResponse({
          data: null,
          message: 'Invalid configuration type',
          success: false
        });
    }
  } catch (error: any) {
    console.error('Payment configuration save error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to save payment configuration',
      success: false
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, enabled } = body;

    switch (type) {
      case 'gateway':
        // Toggle gateway status
        console.log(`Toggling gateway ${id} to ${enabled}`);
        
        return sendResponse({
          data: { id, enabled },
          message: 'Gateway status updated successfully',
          success: true
        });

      case 'tax-rule':
        // Toggle tax rule status
        console.log(`Toggling tax rule ${id} to ${enabled}`);
        
        return sendResponse({
          data: { id, enabled },
          message: 'Tax rule status updated successfully',
          success: true
        });

      default:
        return sendResponse({
          data: null,
          message: 'Invalid update type',
          success: false
        });
    }
  } catch (error: any) {
    console.error('Payment configuration update error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to update payment configuration',
      success: false
    });
  }
}
