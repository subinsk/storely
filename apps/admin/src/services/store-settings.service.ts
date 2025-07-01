import { api } from "@/lib/axios";
import useSWR from "swr";

export interface StoreSettings {
  id: string;
  organizationId: string;
  storeName: string;
  storeUrl?: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  currency: string;
  timezone: string;
  language: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  businessHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSettingsFormData {
  organizationId: string;
  storeName: string;
  storeUrl?: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  currency: string;
  timezone: string;
  language: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  socialMediaLinks?: any;
  contactInfo?: any;
  businessHours?: any;
}

class StoreSettingsService {
  private baseURL = '/api/store-settings';

  // Get store settings for an organization
  async getStoreSettings(organizationId: string): Promise<StoreSettings | null> {
    try {
      const response = await api.get(`${this.baseURL}?organizationId=${organizationId}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching store settings:', error);
      throw error;
    }
  }

  // Create or update store settings
  async saveStoreSettings(data: StoreSettingsFormData): Promise<StoreSettings> {
    try {
      const response = await api.post(this.baseURL, data);
      return response.data.data;
    } catch (error) {
      console.error('Error saving store settings:', error);
      throw error;
    }
  }

  // Update existing store settings
  async updateStoreSettings(data: Partial<StoreSettingsFormData> & { organizationId: string }): Promise<StoreSettings> {
    try {
      const response = await api.put(this.baseURL, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating store settings:', error);
      throw error;
    }
  }

  // Get default store settings template
  getDefaultSettings(organizationId: string): StoreSettingsFormData {
    return {
      organizationId,
      storeName: 'My Store',
      primaryColor: '#8B4513',
      secondaryColor: '#556B7D',
      fontFamily: 'Inter',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en',
      socialMediaLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      contactInfo: {
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true }
      }
    };
  }

  // Available currencies
  getCurrencies() {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
    ];
  }

  // Available timezones
  getTimezones() {
    return [
      { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
      { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
      { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
      { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
      { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
      { value: 'Europe/London', label: 'London' },
      { value: 'Europe/Paris', label: 'Paris' },
      { value: 'Europe/Berlin', label: 'Berlin' },
      { value: 'Asia/Tokyo', label: 'Tokyo' },
      { value: 'Asia/Shanghai', label: 'Shanghai' },
      { value: 'Asia/Kolkata', label: 'Mumbai, Delhi' },
      { value: 'Australia/Sydney', label: 'Sydney' }
    ];
  }

  // Available languages
  getLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' }
    ];
  }

  // Available font families
  getFontFamilies() {
    return [
      { value: 'Inter', label: 'Inter' },
      { value: 'Roboto', label: 'Roboto' },
      { value: 'Open Sans', label: 'Open Sans' },
      { value: 'Lato', label: 'Lato' },
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Source Sans Pro', label: 'Source Sans Pro' },
      { value: 'Raleway', label: 'Raleway' },
      { value: 'Nunito', label: 'Nunito' },
      { value: 'Poppins', label: 'Poppins' },
      { value: 'Playfair Display', label: 'Playfair Display' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Times New Roman', label: 'Times New Roman' }
    ];
  }
}

// Hook for using store settings
export function useStoreSettings(organizationId: string | null) {
  const { data, error, mutate } = useSWR(
    organizationId ? [`/api/store-settings`, organizationId] : null,
    () => organizationId ? storeSettingsService.getStoreSettings(organizationId) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    settings: data,
    isLoading: !error && !data && organizationId,
    error,
    mutate
  };
}

export const storeSettingsService = new StoreSettingsService();
