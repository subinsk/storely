import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@storely/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const { domain } = params;

    if (!domain) {
      return NextResponse.json(
        { success: false, message: 'Domain is required' },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.findFirst({
      where: {
        customDomain: domain,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        customDomain: true,
        logo: true,
        plan: true,
        isActive: true,
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
    console.error('Error validating domain:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
