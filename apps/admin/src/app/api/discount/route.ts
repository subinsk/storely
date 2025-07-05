import { NextRequest } from 'next/server';
import sendResponse from '@/lib/response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'coupons', 'campaigns', 'analytics'

    switch (type) {
      case 'coupons':
        // Fetch coupons from database
        // For now, return mock data
        const coupons = [
          {
            id: '1',
            code: 'WELCOME20',
            name: 'Welcome Discount',
            description: '20% off for new customers',
            type: 'percentage',
            value: 20,
            minimumAmount: 50,
            maximumDiscount: 100,
            usageLimit: 1000,
            usageCount: 234,
            usageLimitPerCustomer: 1,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            enabled: true,
            conditions: {
              customerGroups: ['new_customers']
            }
          },
          {
            id: '2',
            code: 'FREESHIP',
            name: 'Free Shipping',
            description: 'Free shipping on orders over $75',
            type: 'free_shipping',
            value: 0,
            minimumAmount: 75,
            usageLimit: null,
            usageCount: 1567,
            startDate: new Date(),
            enabled: true,
            conditions: {}
          },
          {
            id: '3',
            code: 'BUY2GET1',
            name: 'Buy 2 Get 1 Free',
            description: 'Buy 2 items, get 1 free from selected categories',
            type: 'buy_x_get_y',
            value: 0,
            usageCount: 89,
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            enabled: true,
            conditions: {
              categories: ['electronics', 'clothing']
            },
            buyXGetY: {
              buyQuantity: 2,
              getQuantity: 1,
              getDiscount: 100
            }
          }
        ];
        
        return sendResponse({
          data: coupons,
          message: 'Coupons fetched successfully',
          success: true
        });

      case 'campaigns':
        const campaigns = [
          {
            id: '1',
            name: 'Black Friday Sale',
            description: 'Massive discounts across all categories',
            type: 'flash_sale',
            discountType: 'percentage',
            discountValue: 40,
            conditions: {
              minimumAmount: 100
            },
            startDate: new Date('2024-11-29'),
            endDate: new Date('2024-12-02'),
            enabled: true,
            priority: 1,
            usageCount: 2450,
            conversionRate: 15.6
          },
          {
            id: '2',
            name: 'Summer Collection',
            description: 'Special prices on summer items',
            type: 'seasonal',
            discountType: 'percentage',
            discountValue: 25,
            conditions: {
              productCategories: ['summer_wear', 'accessories']
            },
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-08-31'),
            enabled: false,
            priority: 2,
            usageCount: 1200,
            conversionRate: 12.3
          }
        ];

        return sendResponse({
          data: campaigns,
          message: 'Campaigns fetched successfully',
          success: true
        });

      case 'analytics':
        const analytics = {
          activeCoupons: 3,
          totalUsage: 1890,
          averageDiscount: 24.50,
          conversionRate: 12.8,
          topPerformingCoupons: [
            {
              code: 'WELCOME20',
              usageCount: 234,
              conversionRate: 8.5,
              totalDiscount: 2450,
              revenueImpact: 12300
            },
            {
              code: 'FREESHIP',
              usageCount: 1567,
              conversionRate: 15.2,
              totalDiscount: 0,
              revenueImpact: 25600
            },
            {
              code: 'BUY2GET1',
              usageCount: 89,
              conversionRate: 18.7,
              totalDiscount: 1200,
              revenueImpact: 4500
            }
          ]
        };

        return sendResponse({
          data: analytics,
          message: 'Analytics fetched successfully',
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
    console.error('Discount fetch error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to fetch discount data',
      success: false
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'coupon':
        // Create coupon
        console.log('Creating coupon:', data);
        
        // Generate unique coupon code if not provided
        const couponCode = data.code || `COUPON${Date.now()}`;
        
        const newCoupon = {
          id: Date.now().toString(),
          code: couponCode,
          name: data.name,
          description: data.description,
          type: data.type,
          value: data.value,
          minimumAmount: data.minimumAmount,
          maximumDiscount: data.maximumDiscount,
          usageLimit: data.usageLimit,
          usageCount: 0,
          usageLimitPerCustomer: data.usageLimitPerCustomer,
          startDate: data.startDate,
          endDate: data.endDate,
          enabled: true,
          conditions: data.conditions || {}
        };
        
        return sendResponse({
          data: newCoupon,
          message: 'Coupon created successfully',
          success: true
        });

      case 'campaign':
        // Create campaign
        console.log('Creating campaign:', data);
        
        const newCampaign = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description,
          type: data.type,
          discountType: data.discountType,
          discountValue: data.discountValue,
          conditions: data.conditions || {},
          startDate: data.startDate,
          endDate: data.endDate,
          enabled: true,
          priority: data.priority || 1,
          usageCount: 0,
          conversionRate: 0
        };
        
        return sendResponse({
          data: newCampaign,
          message: 'Campaign created successfully',
          success: true
        });

      case 'validate-coupon':
        // Validate coupon code
        const { code, orderAmount, customerId } = data;
        console.log(`Validating coupon ${code} for order amount ${orderAmount}`);
        
        // Mock validation logic
        const isValid = code && code.length > 3;
        const discount = isValid ? orderAmount * 0.1 : 0; // 10% discount
        
        return sendResponse({
          data: {
            valid: isValid,
            discount: discount,
            message: isValid ? 'Coupon applied successfully' : 'Invalid coupon code'
          },
          message: 'Coupon validation completed',
          success: true
        });

      default:
        return sendResponse({
          data: null,
          message: 'Invalid operation type',
          success: false
        });
    }
  } catch (error: any) {
    console.error('Discount operation error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to process discount operation',
      success: false
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, enabled, data } = body;

    switch (type) {
      case 'coupon':
        if (enabled !== undefined) {
          // Toggle coupon status
          console.log(`Toggling coupon ${id} to ${enabled}`);
          
          return sendResponse({
            data: { id, enabled },
            message: 'Coupon status updated successfully',
            success: true
          });
        } else {
          // Update coupon data
          console.log(`Updating coupon ${id}:`, data);
          
          return sendResponse({
            data: { id, ...data },
            message: 'Coupon updated successfully',
            success: true
          });
        }

      case 'campaign':
        if (enabled !== undefined) {
          // Toggle campaign status
          console.log(`Toggling campaign ${id} to ${enabled}`);
          
          return sendResponse({
            data: { id, enabled },
            message: 'Campaign status updated successfully',
            success: true
          });
        } else {
          // Update campaign data
          console.log(`Updating campaign ${id}:`, data);
          
          return sendResponse({
            data: { id, ...data },
            message: 'Campaign updated successfully',
            success: true
          });
        }

      default:
        return sendResponse({
          data: null,
          message: 'Invalid update type',
          success: false
        });
    }
  } catch (error: any) {
    console.error('Discount update error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to update discount',
      success: false
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return sendResponse({
        data: null,
        message: 'Missing id or type parameter',
        success: false
      });
    }

    console.log(`Deleting ${type} with id:`, id);

    return sendResponse({
      data: { id },
      message: `${type} deleted successfully`,
      success: true
    });
  } catch (error: any) {
    console.error('Discount delete error:', error);
    return sendResponse({
      data: error.message,
      message: 'Failed to delete discount',
      success: false
    });
  }
}
