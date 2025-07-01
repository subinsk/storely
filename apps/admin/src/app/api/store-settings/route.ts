import { prisma } from "@/lib";
import sendResponse from "@/lib/response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Organization ID is required'
      });
    }

    const storeSettings = await prisma.storeSettings.findUnique({
      where: { organizationId },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return sendResponse({
      data: storeSettings,
      success: true,
      message: 'Store settings fetched successfully'
    });
  } catch (e: any) {
    console.error('Store settings fetch error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to fetch store settings'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, ...settingsData } = body;

    if (!organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Organization ID is required'
      });
    }

    const storeSettings = await prisma.storeSettings.upsert({
      where: { organizationId },
      update: {
        ...settingsData,
        updatedAt: new Date()
      },
      create: {
        organizationId,
        ...settingsData
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return sendResponse({
      data: storeSettings,
      success: true,
      message: 'Store settings saved successfully'
    });
  } catch (e: any) {
    console.error('Store settings save error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to save store settings'
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, ...updateData } = body;

    if (!organizationId) {
      return sendResponse({
        data: null,
        success: false,
        message: 'Organization ID is required'
      });
    }

    const updatedSettings = await prisma.storeSettings.update({
      where: { organizationId },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return sendResponse({
      data: updatedSettings,
      success: true,
      message: 'Store settings updated successfully'
    });
  } catch (e: any) {
    console.error('Store settings update error:', e);
    return sendResponse({
      data: e.message,
      success: false,
      message: 'Failed to update store settings'
    });
  }
}
