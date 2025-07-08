'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { headers } from 'next/headers';

interface Organization {
  id: string;
  name: string;
  subdomain: string | null;
  customDomain: string | null;
  logo: string | null;
  plan: string;
  isActive: boolean;
  storeSettings?: any;
  themeSettings?: any;
}

interface OrganizationContextType {
  organization: Organization | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

interface OrganizationProviderProps {
  children: ReactNode;
  organizationId?: string;
}

export function OrganizationProvider({ children, organizationId }: OrganizationProviderProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    if (!organizationId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/organization/${organizationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch organization');
      }

      const data = await response.json();
      setOrganization(data.organization);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization');
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  const contextValue: OrganizationContextType = {
    organization,
    isLoading,
    error,
    refetch: fetchOrganization,
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
}

// Hook to get organization from server headers in server components
// export function getOrganizationFromHeaders() {
//   // This will be used in server components
//   const headersList = headers();
//   return {
//     organizationId: headersList.get('x-organization-id'),
//     subdomain: headersList.get('x-tenant-subdomain'),
//     customDomain: headersList.get('x-tenant-custom-domain'),
//   };
// }
