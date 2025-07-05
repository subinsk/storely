import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@storely/database';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schemas
const ReportTemplateSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['sales', 'inventory', 'customer', 'financial', 'custom']),
  description: z.string(),
  metrics: z.array(z.string()),
  charts: z.array(z.string()),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  recipients: z.array(z.string().email())
});

const ReportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metrics: z.array(z.string()).optional(),
  format: z.enum(['json', 'csv', 'excel', 'pdf']).optional()
});

// GET /api/reports - Get reports data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'templates' | 'scheduled' | 'analytics' | 'export'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (type === 'templates') {
      // Get report templates
      const templates = [
        {
          id: '1',
          name: 'Daily Sales Summary',
          type: 'sales',
          description: 'Daily overview of sales performance and key metrics',
          metrics: ['revenue', 'orders', 'conversion_rate'],
          charts: ['revenue_trend', 'orders_by_hour'],
          frequency: 'daily',
          recipients: ['manager@company.com', 'sales@company.com'],
          isActive: true,
          lastGenerated: '2025-06-30T08:00:00Z',
          nextScheduled: '2025-07-01T08:00:00Z'
        },
        {
          id: '2',
          name: 'Weekly Inventory Report',
          type: 'inventory',
          description: 'Weekly inventory status and stock level analysis',
          metrics: ['stock_levels', 'low_stock_alerts', 'inventory_value'],
          charts: ['stock_by_category', 'inventory_turnover'],
          frequency: 'weekly',
          recipients: ['inventory@company.com'],
          isActive: true,
          lastGenerated: '2025-06-23T09:00:00Z',
          nextScheduled: '2025-06-30T09:00:00Z'
        }
      ];

      return NextResponse.json({ templates });
    }

    if (type === 'scheduled') {
      // Get scheduled reports
      const scheduledReports = [
        {
          id: '1',
          templateId: '1',
          templateName: 'Daily Sales Summary',
          schedule: 'Daily at 8:00 AM',
          recipients: ['manager@company.com', 'sales@company.com'],
          isActive: true,
          lastRun: '2025-06-30T08:00:00Z',
          nextRun: '2025-07-01T08:00:00Z',
          status: 'active'
        },
        {
          id: '2',
          templateId: '2',
          templateName: 'Weekly Inventory Report',
          schedule: 'Weekly on Monday at 9:00 AM',
          recipients: ['inventory@company.com'],
          isActive: true,
          lastRun: '2025-06-23T09:00:00Z',
          nextRun: '2025-06-30T09:00:00Z',
          status: 'active'
        }
      ];

      return NextResponse.json({ scheduledReports });
    }

    if (type === 'analytics') {
      // Get analytics data for reports
      const dateFilter = {
        gte: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lte: endDate ? new Date(endDate) : new Date()
      };

      // Sales analytics
      const orders = await prisma.order.findMany({
        where: {
          createdAt: dateFilter
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          status: true
        }
      });

      const users = await prisma.user.count();

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const salesData = {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        conversionRate: 3.2, // Mock data
        growth: 12.5, // Mock data
        chartData: orders.map(order => ({
          date: order.createdAt.toISOString().split('T')[0],
          revenue: order.totalAmount || 0,
          orders: 1
        }))
      };

      const inventoryData = {
        totalProducts: products.length,
        lowStockItems: Math.floor(products.length * 0.1), // Mock calculation
        outOfStockItems: Math.floor(products.length * 0.02), // Mock calculation
        inventoryValue: products.reduce((sum, p) => sum + (p.price || 0), 0),
        turnoverRate: 6.8, // Mock data
        chartData: products.reduce((acc: any[], product) => {
          const existingCategory = acc.find(item => item.category === product.category);
          if (existingCategory) {
            existingCategory.stock += 1;
            existingCategory.value += product.price || 0;
          } else {
            acc.push({
              category: product.category || 'Uncategorized',
              stock: 1,
              value: product.price || 0
            });
          }
          return acc;
        }, [])
      };

      const customersData = {
        totalCustomers: users,
        newCustomers: Math.floor(users * 0.1), // Mock calculation
        returningCustomers: Math.floor(users * 0.3), // Mock calculation
        averageLifetimeValue: 1250.75, // Mock data
        retentionRate: 68.5, // Mock data
        chartData: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new: Math.floor(Math.random() * 50) + 20,
          returning: Math.floor(Math.random() * 80) + 40
        }))
      };

      return NextResponse.json({
        sales: salesData,
        inventory: inventoryData,
        customers: customersData,
        dateRange: { startDate, endDate }
      });
    }

    // Default: return summary
    const summary = {
      totalTemplates: 8,
      activeSchedules: 5,
      reportsGenerated: 127,
      lastGenerated: '2025-06-30T08:00:00Z'
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Reports API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Generate report or create template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'generate') {
      // Generate report immediately
      const { templateId, format = 'json', filters = {} } = data;
      
      if (!templateId) {
        return NextResponse.json(
          { error: 'Template ID is required' },
          { status: 400 }
        );
      }

      // In real implementation, generate actual report
      const reportData = {
        id: `report-${Date.now()}`,
        templateId,
        format,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        downloadUrl: `/api/reports/download/${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      return NextResponse.json({ 
        success: true, 
        report: reportData 
      });
    }

    if (action === 'create_template') {
      // Create new report template
      const validatedData = ReportTemplateSchema.parse(data);
      
      const newTemplate = {
        id: Date.now().toString(),
        ...validatedData,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      // In real implementation, save to database
      console.log('Creating report template:', newTemplate);

      return NextResponse.json({ 
        success: true, 
        template: newTemplate 
      });
    }

    if (action === 'schedule') {
      // Schedule a report
      const { templateId, schedule, recipients } = data;
      
      if (!templateId || !schedule) {
        return NextResponse.json(
          { error: 'Template ID and schedule are required' },
          { status: 400 }
        );
      }

      const scheduledReport = {
        id: Date.now().toString(),
        templateId,
        schedule,
        recipients: recipients || [],
        isActive: true,
        createdAt: new Date().toISOString(),
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Mock next run
      };

      return NextResponse.json({ 
        success: true, 
        scheduledReport 
      });
    }

    if (action === 'export') {
      // Export data in specified format
      const validatedFilters = ReportFilterSchema.parse(data);
      
      // In real implementation, generate and return file
      const exportResult = {
        success: true,
        format: validatedFilters.format || 'json',
        downloadUrl: `/api/reports/export/${Date.now()}`,
        fileName: `report-${Date.now()}.${validatedFilters.format || 'json'}`,
        size: '2.4 MB', // Mock size
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      return NextResponse.json(exportResult);
    }

    return NextResponse.json(
      { error: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Reports API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/reports - Update template or scheduled report
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, ...updateData } = body;

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    if (type === 'template') {
      // Update report template
      const validatedData = ReportTemplateSchema.partial().parse(updateData);
      
      // In real implementation, update in database
      console.log('Updating report template:', id, validatedData);
    }

    if (type === 'schedule') {
      // Update scheduled report
      console.log('Updating scheduled report:', id, updateData);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${type} updated successfully` 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Reports API PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/reports - Delete template or scheduled report
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      );
    }

    // In real implementation, delete from database
    console.log(`Deleting ${type} ${id}`);

    return NextResponse.json({ 
      success: true, 
      message: `${type} deleted successfully` 
    });
  } catch (error) {
    console.error('Reports API DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
