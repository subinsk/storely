import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Generate PDF content (simplified HTML for now)
    const pdfContent = generateInvoicePDF(invoice);
    
    // In a real implementation, you would use a PDF generation library like puppeteer or jsPDF
    // For now, we'll return the HTML content
    const response = new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`
      }
    });

    return response;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generateInvoicePDF(invoice: any): string {
  // This is a simplified HTML template for the invoice
  // In production, you would use a proper PDF generation library
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        .customer-details { margin-bottom: 30px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .totals { text-align: right; }
        .total-row { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <h2>${invoice.invoiceNumber}</h2>
      </div>
      
      <div class="invoice-details">
        <p><strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
      </div>
      
      <div class="customer-details">
        <h3>Bill To:</h3>
        <p>${invoice.order.user.name}</p>
        <p>${invoice.order.user.email}</p>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item: any) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${item.unitPrice.toFixed(2)}</td>
              <td>$${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals">
        <p>Subtotal: $${invoice.subtotal.toFixed(2)}</p>
        <p>Tax: $${invoice.taxAmount.toFixed(2)}</p>
        <p class="total-row">Total: $${invoice.totalAmount.toFixed(2)}</p>
      </div>
      
      ${invoice.notes ? `<div><h3>Notes:</h3><p>${invoice.notes}</p></div>` : ''}
    </body>
    </html>
  `;
}
