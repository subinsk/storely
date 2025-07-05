export interface PaymentCard {
  id: string;
  cardNumber: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  cardHolder: string;
  holderName: string;
  expiryDate: string;
  cvv?: string;
  isDefault: boolean;
  primary: boolean;
  lastFourDigits: string;
  maskedNumber: string;
  status: 'active' | 'expired' | 'inactive';
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
