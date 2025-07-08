import { prisma } from '../lib/prisma';

export enum EmailTemplateType {
  WELCOME = 'welcome',
  ORDER_CONFIRMATION = 'order_confirmation',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_VERIFICATION = 'account_verification',
  NEWSLETTER = 'newsletter',
  ABANDONED_CART = 'abandoned_cart',
  PRODUCT_BACK_IN_STOCK = 'product_back_in_stock',
  RECEIPT = 'receipt',
  INVOICE = 'invoice',
  CUSTOM = 'custom',
}

export interface EmailSendOptions {
  to: string;
  templateType: EmailTemplateType;
  variables?: Record<string, any>;
  organizationId: string;
}

export class DatabaseEmailService {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  async sendEmail(options: EmailSendOptions): Promise<void> {
    const { to, templateType, variables = {} } = options;

    try {
      // Get the template
      const template = await prisma.emailTemplate.findFirst({
        where: {
          organizationId: this.organizationId,
          type: templateType,
          isActive: true,
        },
      });

      if (!template) {
        throw new Error(`Email template not found for type: ${templateType}`);
      }

      // Render the template with variables
      const renderedSubject = this.renderTemplate(template.subject, variables);
      const renderedContent = this.renderTemplate(template.content, variables);
      const renderedHtmlContent = template.htmlContent 
        ? this.renderTemplate(template.htmlContent, variables)
        : null;

      // Log the email
      await prisma.emailLog.create({
        data: {
          organizationId: this.organizationId,
          templateId: template.id,
          recipientEmail: to,
          subject: renderedSubject,
          content: renderedContent,
          metadata: {
            variables,
            htmlContent: renderedHtmlContent,
          },
        },
      });

      // Here you would integrate with your email service provider
      // For now, we'll just log it
      console.log('Email sent:', {
        to,
        subject: renderedSubject,
        content: renderedContent,
      });

      // Update the email log status to sent
      // In a real implementation, you would update this after successful delivery
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Log the failure
      await prisma.emailLog.create({
        data: {
          organizationId: this.organizationId,
          recipientEmail: to,
          subject: `Failed to send ${templateType} email`,
          content: '',
          status: 'failed',
          failureReason: error instanceof Error ? error.message : 'Unknown error',
          metadata: { variables },
        },
      });

      throw error;
    }
  }

  private renderTemplate(template: string, variables: Record<string, any>): string {
    let rendered = template;
    
    // Replace variables in the format {{variable}}
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }
    
    return rendered;
  }

  async createSystemTemplates(): Promise<void> {
    const systemTemplates = [
      {
        name: 'Welcome Email',
        subject: 'Welcome to {{organizationName}}!',
        type: EmailTemplateType.WELCOME,
        content: `Hi {{userName}},

Welcome to {{organizationName}}! We're excited to have you on board.

You can now browse our products and start shopping. If you have any questions, feel free to reach out to our support team.

Best regards,
The {{organizationName}} Team`,
        htmlContent: `<html>
<body>
  <h1>Welcome to {{organizationName}}!</h1>
  <p>Hi {{userName}},</p>
  <p>Welcome to {{organizationName}}! We're excited to have you on board.</p>
  <p>You can now browse our products and start shopping. If you have any questions, feel free to reach out to our support team.</p>
  <p>Best regards,<br>The {{organizationName}} Team</p>
</body>
</html>`,
        variables: { organizationName: 'string', userName: 'string' },
        isSystem: true,
      },
      {
        name: 'Order Confirmation',
        subject: 'Order Confirmation - {{orderNumber}}',
        type: EmailTemplateType.ORDER_CONFIRMATION,
        content: `Hi {{userName}},

Thank you for your order! Your order {{orderNumber}} has been confirmed.

Order Details:
- Order Number: {{orderNumber}}
- Total: {{orderTotal}}
- Items: {{itemCount}}

Your order will be processed and shipped within 1-3 business days.

Best regards,
The {{organizationName}} Team`,
        htmlContent: `<html>
<body>
  <h1>Order Confirmation</h1>
  <p>Hi {{userName}},</p>
  <p>Thank you for your order! Your order {{orderNumber}} has been confirmed.</p>
  <div>
    <h3>Order Details:</h3>
    <ul>
      <li>Order Number: {{orderNumber}}</li>
      <li>Total: {{orderTotal}}</li>
      <li>Items: {{itemCount}}</li>
    </ul>
  </div>
  <p>Your order will be processed and shipped within 1-3 business days.</p>
  <p>Best regards,<br>The {{organizationName}} Team</p>
</body>
</html>`,
        variables: { organizationName: 'string', userName: 'string', orderNumber: 'string', orderTotal: 'string', itemCount: 'number' },
        isSystem: true,
      },
      {
        name: 'Password Reset',
        subject: 'Reset Your Password - {{organizationName}}',
        type: EmailTemplateType.PASSWORD_RESET,
        content: `Hi {{userName}},

You requested to reset your password for your {{organizationName}} account.

Click the link below to reset your password:
{{resetLink}}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
The {{organizationName}} Team`,
        htmlContent: `<html>
<body>
  <h1>Reset Your Password</h1>
  <p>Hi {{userName}},</p>
  <p>You requested to reset your password for your {{organizationName}} account.</p>
  <p><a href="{{resetLink}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
  <p>This link will expire in 1 hour.</p>
  <p>If you didn't request this password reset, please ignore this email.</p>
  <p>Best regards,<br>The {{organizationName}} Team</p>
</body>
</html>`,
        variables: { organizationName: 'string', userName: 'string', resetLink: 'string' },
        isSystem: true,
      },
    ];

    for (const template of systemTemplates) {
      await prisma.emailTemplate.upsert({
        where: {
          organizationId_name: {
            organizationId: this.organizationId,
            name: template.name,
          },
        },
        update: {
          subject: template.subject,
          content: template.content,
          htmlContent: template.htmlContent,
          variables: template.variables,
        },
        create: {
          ...template,
          organizationId: this.organizationId,
        },
      });
    }
  }
}

export const createDatabaseEmailService = (organizationId: string) => {
  return new DatabaseEmailService(organizationId);
};
