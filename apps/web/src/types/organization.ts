// Core Organization Types
export interface Organization {
  id: string;
  name: string;
  subdomain?: string;
  customDomain?: string;
  logo?: string;
  plan: 'free' | 'premium' | 'enterprise';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}
