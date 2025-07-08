import nodemailer from 'nodemailer';
import { Order, User, Product } from '../types';
import { DatabaseEmailService } from './databaseEmail.service';

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

interface MarketingCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
}

interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Initialize email templates
    this.templates.set('order-confirmation', {
      subject: 'Order Confirmation - #{orderNumber}',
      html: this.getOrderConfirmationTemplate(),
    });

    this.templates.set('shipping-notification', {
      subject: 'Your Order Has Shipped - #{orderNumber}',
      html: this.getShippingNotificationTemplate(),
    });

    this.templates.set('welcome', {
      subject: 'Welcome to Our Store!',
      html: this.getWelcomeTemplate(),
    });

    this.templates.set('password-reset', {
      subject: 'Password Reset Request',
      html: this.getPasswordResetTemplate(),
    });

    this.templates.set('back-in-stock', {
      subject: 'Product Back in Stock!',
      html: this.getBackInStockTemplate(),
    });

    this.templates.set('abandoned-cart', {
      subject: 'Don\'t Forget Your Cart!',
      html: this.getAbandonedCartTemplate(),
    });

    this.templates.set('order-status-update', {
      subject: 'Order Status Update - #{orderNumber}',
      html: this.getOrderStatusUpdateTemplate(),
    });
  }

  private getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Storely</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #1976d2;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #1976d2;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              background: #1976d2;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background: #1565c0;
            }
            .info-box {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #1976d2;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              margin: 0 10px;
              color: #1976d2;
              text-decoration: none;
            }
            .unsubscribe {
              color: #999;
              font-size: 12px;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Storely</div>
              <p>Your Premium Shopping Experience</p>
            </div>
            ${content}
            <div class="footer">
              <div class="social-links">
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
                <a href="#">Instagram</a>
              </div>
              <p>© 2024 Storely. All rights reserved.</p>
              <p>
                <a href="{unsubscribe_url}" class="unsubscribe">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getOrderConfirmationTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Order Confirmation</h2>
      <p>Dear {customerName},</p>
      <p>Thank you for your order! Here are the details:</p>
      
      <div class="info-box">
        <h3>Order #{orderNumber}</h3>
        <p><strong>Order Date:</strong> {orderDate}</p>
        <p><strong>Total:</strong> {totalAmount}</p>
        <p><strong>Status:</strong> {status}</p>
      </div>

      <h3>Items Ordered:</h3>
      <div style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin: 15px 0;">
        {orderItems}
      </div>

      <h3>Shipping Address:</h3>
      <div class="info-box">
        {shippingAddress}
      </div>

      <p>We'll send you another email when your order ships.</p>
      <p>Thank you for shopping with us!</p>
    `;
  }

  private getShippingNotificationTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Your Order Has Shipped!</h2>
      <p>Dear {customerName},</p>
      <p>Great news! Your order has been shipped and is on its way to you.</p>
      
      <div class="info-box">
        <h3>Order #{orderNumber}</h3>
        <p><strong>Shipped Date:</strong> {shippedDate}</p>
        <p><strong>Tracking Number:</strong> {trackingNumber}</p>
        <p><strong>Estimated Delivery:</strong> {estimatedDelivery}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{trackingUrl}" class="button">Track Your Package</a>
      </div>

      <p>You can track your package using the tracking number above.</p>
      <p>Thank you for your business!</p>
    `;
  }

  private getWelcomeTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Welcome to Our Store!</h2>
      <p>Dear {customerName},</p>
      <p>Welcome to our store! We're excited to have you as part of our community.</p>
      
      <div class="info-box">
        <h3>What's Next?</h3>
        <ul style="margin: 15px 0; padding-left: 20px;">
          <li>Browse our latest products</li>
          <li>Add items to your wishlist</li>
          <li>Get exclusive member discounts</li>
          <li>Stay updated with our newsletter</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{shopUrl}" class="button">Start Shopping</a>
      </div>

      <p>Happy shopping!</p>
    `;
  }

  private getPasswordResetTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Password Reset Request</h2>
      <p>Dear {customerName},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{resetUrl}" class="button">Reset Password</a>
      </div>

      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      
      <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>Security tip:</strong> Never share your password with anyone. Our team will never ask for your password.
      </div>
    `;
  }

  private getBackInStockTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Product Back in Stock!</h2>
      <p>Dear {customerName},</p>
      <p>Great news! The product you were waiting for is back in stock.</p>
      
      <div class="info-box">
        <h3>{productName}</h3>
        <p><strong>Price:</strong> {productPrice}</p>
        <div style="text-align: center; margin: 15px 0;">
          <img src="{productImage}" alt="{productName}" style="max-width: 200px; height: auto; border-radius: 6px;">
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{productUrl}" class="button">Shop Now</a>
      </div>

      <p>Don't wait too long - limited stock available!</p>
    `;
  }

  private getAbandonedCartTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Don't Forget Your Cart!</h2>
      <p>Dear {customerName},</p>
      <p>You left some great items in your cart. Complete your purchase before they're gone!</p>
      
      <div class="info-box">
        <h3>Items in Your Cart:</h3>
        <div style="margin: 15px 0;">
          {cartItems}
        </div>
        <p><strong>Total:</strong> {cartTotal}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{cartUrl}" class="button">Complete Purchase</a>
      </div>

      <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>Special offer:</strong> Use code COMEBACK10 for 10% off your order!
      </div>
    `;
  }

  private getOrderStatusUpdateTemplate(): string {
    return `
      <h2 style="color: #1976d2; margin-bottom: 20px;">Order Status Update</h2>
      <p>Dear {customerName},</p>
      <p>Your order status has been updated:</p>
      
      <div class="info-box">
        <h3>Order #{orderNumber}</h3>
        <p><strong>Previous Status:</strong> {previousStatus}</p>
        <p><strong>New Status:</strong> {newStatus}</p>
        <p><strong>Updated:</strong> {updateDate}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{orderUrl}" class="button">View Order Details</a>
      </div>

      <p>Thank you for your patience!</p>
    `;
  }

  private replaceTemplate(template: string, replacements: Record<string, string>): string {
    let result = template;
    Object.entries(replacements).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  }

  async sendOrderConfirmation(order: Order, user: User) {
    const template = this.templates.get('order-confirmation');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const orderItems = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
        <span>${item.product.name}</span>
        <span>Qty: ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    const shippingAddress = order.shippingAddress ? `
      ${order.shippingAddress.name || ''}<br>
      ${order.shippingAddress.street || ''}<br>
      ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zip || ''}<br>
      ${order.shippingAddress.country || ''}
    ` : 'No shipping address provided';

    const content = this.replaceTemplate(template.html, {
      customerName,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      totalAmount: order.totalAmount.toFixed(2),
      status: order.status,
      orderItems,
      shippingAddress,
    });

    const finalHtml = this.getBaseTemplate(content);
    const subject = this.replaceTemplate(template.subject, { orderNumber: order.orderNumber });

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject,
        html: finalHtml,
      });
      
      console.log('Order confirmation email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw error;
    }
  }

  async sendShippingNotification(order: Order, user: User, trackingNumber?: string) {
    const template = this.templates.get('shipping-notification');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const content = this.replaceTemplate(template.html, {
      customerName,
      orderNumber: order.orderNumber,
      shippedDate: new Date().toLocaleDateString(),
      trackingNumber: trackingNumber || 'N/A',
      estimatedDelivery: '5-7 business days',
      trackingUrl: trackingNumber ? `https://tracking.example.com/${trackingNumber}` : '#',
    });

    const finalHtml = this.getBaseTemplate(content);
    const subject = this.replaceTemplate(template.subject, { orderNumber: order.orderNumber });

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject,
        html: finalHtml,
      });
      
      console.log('Shipping notification email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send shipping notification email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user: User) {
    const template = this.templates.get('welcome');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const content = this.replaceTemplate(template.html, {
      customerName,
      shopUrl: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,
    });

    const finalHtml = this.getBaseTemplate(content);

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject: template.subject,
        html: finalHtml,
      });
      
      console.log('Welcome email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(user: User, resetToken: string) {
    const template = this.templates.get('password-reset');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const content = this.replaceTemplate(template.html, {
      customerName,
      resetUrl,
    });

    const finalHtml = this.getBaseTemplate(content);

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject: template.subject,
        html: finalHtml,
      });
      
      console.log('Password reset email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  async sendProductBackInStockNotification(user: User, product: Product) {
    const template = this.templates.get('back-in-stock');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const content = this.replaceTemplate(template.html, {
      customerName,
      productName: product.name,
      productPrice: product.price.toFixed(2),
      productImage: product.images?.[0] || '/placeholder.jpg',
      productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
    });

    const finalHtml = this.getBaseTemplate(content);

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject: template.subject,
        html: finalHtml,
      });
      
      console.log('Back in stock notification sent to:', user.email);
    } catch (error) {
      console.error('Failed to send back in stock notification:', error);
      throw error;
    }
  }

  async sendAbandonedCartEmail(user: User, cartItems: any[]) {
    const template = this.templates.get('abandoned-cart');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const cartItemsHtml = cartItems.map(item => `
      <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
        <span>${item.product.name}</span>
        <span>$${item.price.toFixed(2)}</span>
      </div>
    `).join('');

    const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

    const content = this.replaceTemplate(template.html, {
      customerName,
      cartItems: cartItemsHtml,
      cartTotal: cartTotal.toFixed(2),
      cartUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    const finalHtml = this.getBaseTemplate(content);

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject: template.subject,
        html: finalHtml,
      });
      
      console.log('Abandoned cart email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send abandoned cart email:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdate(order: Order, user: User, previousStatus: string, newStatus: string) {
    const template = this.templates.get('order-status-update');
    if (!template) throw new Error('Template not found');

    const customerName = user.name || user.email;
    const content = this.replaceTemplate(template.html, {
      customerName,
      orderNumber: order.orderNumber,
      previousStatus,
      newStatus,
      updateDate: new Date().toLocaleDateString(),
      orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
    });

    const finalHtml = this.getBaseTemplate(content);
    const subject = this.replaceTemplate(template.subject, { orderNumber: order.orderNumber });

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@storely.com',
        to: user.email,
        subject,
        html: finalHtml,
      });
      
      console.log('Order status update email sent to:', user.email);
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      throw error;
    }
  }

  // Marketing Campaign Methods
  async sendMarketingCampaign(campaign: MarketingCampaign, recipients: User[]) {
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const user of recipients) {
      try {
        const customerName = user.name || user.email;
        const content = this.replaceTemplate(campaign.content, {
          customerName,
          unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${user.id}`,
        });

        const finalHtml = this.getBaseTemplate(content);

        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@storely.com',
          to: user.email,
          subject: campaign.subject,
          html: finalHtml,
        });

        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to send to ${user.email}: ${error}`);
      }
    }

    return results;
  }

  async getEmailMetrics(campaignId: string): Promise<EmailMetrics> {
    // This would typically connect to your email service provider's API
    // For now, returning mock data
    return {
      sent: 1000,
      delivered: 980,
      opened: 450,
      clicked: 120,
      bounced: 20,
      unsubscribed: 5,
    };
  }

  // Utility methods
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }

  async scheduleEmail(emailData: any, scheduledDate: Date) {
    // This would typically integrate with a job queue like Bull or Agenda
    console.log('Email scheduled for:', scheduledDate);
    // Implementation would depend on your job queue setup
  }

  // Use database-driven email templates
  async sendEmailWithTemplate(
    templateType: string,
    recipientEmail: string,
    variables: Record<string, any>,
    organizationId: string
  ) {
    try {
      const databaseEmailService = new DatabaseEmailService(organizationId);
      return await databaseEmailService.sendEmail({
        to: recipientEmail,
        templateType: templateType as any,
        variables,
        organizationId,
      });
    } catch (error) {
      console.error('Failed to send email with database template:', error);
      // Fallback to hardcoded templates
      return this.sendEmailWithHardcodedTemplate(templateType, recipientEmail, variables);
    }
  }

  private async sendEmailWithHardcodedTemplate(
    templateType: string,
    recipientEmail: string,
    variables: Record<string, any>
  ) {
    const template = this.templates.get(templateType);
    if (!template) {
      throw new Error(`Template ${templateType} not found`);
    }

    const subject = this.replaceTemplate(template.subject, variables);
    const content = this.replaceTemplate(template.html, variables);
    const finalHtml = this.getBaseTemplate(content);

    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@storely.com',
      to: recipientEmail,
      subject,
      html: finalHtml,
    });
  }
}

export const emailService = new EmailService();
