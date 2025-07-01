import { headers } from 'next/headers';

export function getOrganizationContext() {
  const headersList = headers();
  return {
    organizationId: headersList.get('x-organization-id') || 'default',
    storeId: headersList.get('x-store-id') || 'default'
  };
}

export interface OrganizationContextType {
  organizationId: string;
  storeId: string;
}
