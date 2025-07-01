'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Organization {
  id: string;
  name: string;
  subdomain?: string;
  customDomain?: string;
  logo?: string;
}

interface Store {
  id: string;
  name: string;
  organizationId: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  store: Store | null;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  store: null,
  loading: true
});

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrganizationContextType>({
    organization: null,
    store: null,
    loading: true
  });
  
  useEffect(() => {
    fetchOrganizationData().then(data => {
      setState({
        organization: data.organization,
        store: data.store,
        loading: false
      });
    }).catch(() => {
      setState({
        organization: null,
        store: null,
        loading: false
      });
    });
  }, []);
  
  return (
    <OrganizationContext.Provider value={state}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => useContext(OrganizationContext);

async function fetchOrganizationData() {
  try {
    const response = await fetch('/api/organization');
    if (!response.ok) {
      throw new Error('Failed to fetch organization data');
    }
    return await response.json();
  } catch (error) {
    // Return mock data for development
    return {
      organization: {
        id: 'org-1',
        name: 'Furnerio Store',
        subdomain: 'default',
        logo: '/logo/logo_single.svg'
      },
      store: {
        id: 'store-1',
        name: 'Main Store',
        organizationId: 'org-1'
      }
    };
  }
}
