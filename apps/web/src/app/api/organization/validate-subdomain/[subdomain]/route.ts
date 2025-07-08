import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@storely/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    console.log('Validating lol:', params);
    const { subdomain } = params;

    if (!subdomain) {
      return NextResponse.json(
        { success: false, message: 'Subdomain is required' },
        { status: 400 }
      );
    }

    console.log('subdomain:', subdomain);

    const organization = await prisma.organization.findFirst({
      where: {
        subdomain,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        logo: true,
        plan: true,
        isActive: true,
      },
    });

    console.log('organization:', organization);

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
    console.error('Error validating subdomain:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
