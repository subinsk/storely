// This file contains shared payment-related types used across the application

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover';

export type CardStatus = 'active' | 'expired' | 'blocked';

export interface PaymentCard {
  id: string;
  cardNumber: string; // Last 4 digits only
  cardType: CardType;
  expiryDate: string;
  holderName: string;
  primary: boolean;
  status: CardStatus;
  maskedNumber: string; // e.g., '**** **** **** 1234'
  lastDigits: string; // e.g., '1234'
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
  testMode: boolean;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  status: 'active' | 'inactive' | 'error';
}

export interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  country: string;
  region?: string;
  productCategories: string[];
  enabled: boolean;
}
