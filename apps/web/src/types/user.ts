export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  image?: string;
  role: 'super_admin' | 'org_admin' | 'org_user' | 'member' | 'user';
  organizationId?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  image?: string;
  defaultAddressId?: string;
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    currency: string;
    language: string;
  };
}

export interface UserAddress {
  id: string;
  name?: string;
  phone?: string;
  street: string;
  house?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  pincode?: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  deliveryDays: string[];
  additionalInfo?: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}
