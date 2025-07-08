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

export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  OPENED = 'opened',
  CLICKED = 'clicked',
}

export interface EmailTemplate {
  id: string;
  organizationId: string;
  name: string;
  subject: string;
  type: EmailTemplateType;
  content: string;
  htmlContent?: string;
  variables?: Record<string, any>;
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailLog {
  id: string;
  organizationId: string;
  templateId?: string;
  recipientEmail: string;
  subject: string;
  content: string;
  status: EmailStatus;
  sentAt?: Date;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
