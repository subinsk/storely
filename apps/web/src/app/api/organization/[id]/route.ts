import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        storeSettings: true,
        themeSettings: true,
        stores: {
          where: { isActive: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
