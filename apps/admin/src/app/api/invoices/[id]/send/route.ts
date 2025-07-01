import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { email } = body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        items: true
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Update invoice status to sent
    await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });

    // In a real implementation, you would send the email here
    // using a service like SendGrid, Mailgun, or AWS SES
    console.log(`Sending invoice ${invoice.invoiceNumber} to ${email || invoice.order.user.email}`);

    // Simulate email sending
    const emailData = {
      to: email || invoice.order.user.email,
      subject: `Invoice ${invoice.invoiceNumber} from Your Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invoice ${invoice.invoiceNumber}</h2>
          <p>Dear ${invoice.order.user.name},</p>
          <p>Please find your invoice attached. The total amount is $${invoice.totalAmount.toFixed(2)}.</p>
          <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p>Thank you for your business!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice sent successfully',
      emailData 
    });
  } catch (error) {
    console.error('Failed to send invoice:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
