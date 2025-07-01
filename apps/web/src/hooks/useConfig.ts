'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from './useOrganization';

export interface StoreConfig {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    headingSize?: string;
    borderRadius?: number;
    buttonBorderRadius?: number;
    buttonTextTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    customCSS?: string;
  };
  payment?: {
    enabledMethods?: string[];
    currency?: string;
    stripe?: {
      publicKey?: string;
      secretKey?: string;
    };
    paypal?: {
      clientId?: string;
      clientSecret?: string;
    };
  };
  shipping?: {
    methods?: Array<{
      id: string;
      name: string;
      price: number;
      estimatedDays: string;
    }>;
  };
  general?: {
    storeName?: string;
    storeDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  };
}

export function useConfig() {
  const { store } = useOrganization();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!store?.id) {
      // Set default config for development
      setConfig(getDefaultConfig());
      setLoading(false);
      return;
    }
    
    fetchStoreConfig(store.id).then(data => {
      setConfig(data);
      setLoading(false);
    }).catch(() => {
      setConfig(getDefaultConfig());
      setLoading(false);
    });
    
    // Poll for configuration updates every 30 seconds
    const interval = setInterval(() => {
      if (store?.id) {
        checkForConfigUpdates(store.id).then(updates => {
          if (updates && updates.length > 0) {
            fetchStoreConfig(store.id).then(setConfig);
          }
        }).catch(() => {
          // Silently fail for polling
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [store?.id]);
  
  return { config, loading };
}

async function fetchStoreConfig(storeId: string): Promise<StoreConfig> {
  const response = await fetch(`/api/config?storeId=${storeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch store config');
  }
  return response.json();
}

async function checkForConfigUpdates(storeId: string) {
  try {
    const response = await fetch(`/api/config/updates?storeId=${storeId}`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

function getDefaultConfig(): StoreConfig {
  return {
    theme: {
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      headingSize: '2.5rem',
      borderRadius: 8,
      buttonBorderRadius: 8,
      buttonTextTransform: 'none'
    },
    payment: {
      enabledMethods: ['stripe', 'paypal'],
      currency: 'USD'
    },
    shipping: {
      methods: [
        {
          id: 'standard',
          name: 'Standard Shipping',
          price: 9.99,
          estimatedDays: '5-7 business days'
        },
        {
          id: 'express',
          name: 'Express Shipping',
          price: 19.99,
          estimatedDays: '2-3 business days'
        }
      ]
    },
    general: {
      storeName: 'Furnerio Store',
      storeDescription: 'Premium furniture for modern living',
      contactEmail: 'contact@furnerio.com',
      contactPhone: '+1 (555) 123-4567',
      address: '123 Furniture Street, Design City, DC 12345'
    }
  };
}
