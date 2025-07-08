'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  subdomain: string | null;
  customDomain: string | null;
  logo: string | null;
  plan: string;
  isActive: boolean;
}

interface AdminContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  switchOrganization: (orgId: string) => void;
  refetch: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/organizations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }

      const data = await response.json();
      setOrganizations(data.organizations || []);

      // Set current organization
      const orgId = searchParams.get('orgId') || session.user.organizationId;
      if (orgId) {
        const org = data.organizations.find((o: Organization) => o.id === orgId);
        setCurrentOrganization(org || data.organizations[0] || null);
      } else {
        setCurrentOrganization(data.organizations[0] || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setIsLoading(false);
    }
  };

  const switchOrganization = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrganization(org);
      // Update URL with orgId parameter
      const url = new URL(window.location.href);
      url.searchParams.set('orgId', orgId);
      window.history.pushState({}, '', url.toString());
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [session?.user, searchParams]);

  const contextValue: AdminContextType = {
    currentOrganization,
    organizations,
    isLoading,
    error,
    switchOrganization,
    refetch: fetchOrganizations,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}
