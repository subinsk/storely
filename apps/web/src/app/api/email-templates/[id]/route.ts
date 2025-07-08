import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const organizationId = headersList.get('x-organization-id');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 400 }
      );
    }

    const { id } = params;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const organizationId = headersList.get('x-organization-id');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 400 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, subject, type, content, htmlContent, variables, isActive } = body;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: 'Template not found' },
        { status: 404 }
      );
    }

    if (template.isSystem) {
      return NextResponse.json(
        { success: false, message: 'System templates cannot be modified' },
        { status: 403 }
      );
    }

    const updatedTemplate = await prisma.emailTemplate.update({
      where: {
        id,
      },
      data: {
        name,
        subject,
        type,
        content,
        htmlContent,
        variables,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const organizationId = headersList.get('x-organization-id');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 400 }
      );
    }

    const { id } = params;

    const template = await prisma.emailTemplate.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: 'Template not found' },
        { status: 404 }
      );
    }

    if (template.isSystem) {
      return NextResponse.json(
        { success: false, message: 'System templates cannot be deleted' },
        { status: 403 }
      );
    }

    await prisma.emailTemplate.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
