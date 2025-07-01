import type { Metadata } from 'next';
import IntegrationsManagement from '@/components/integrations/integrations-management';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Third-Party Integrations | Furnerio Admin',
  description: 'Connect your store with external services to streamline workflow and improve customer experience.',
};

// ----------------------------------------------------------------------

export default function IntegrationsPage() {
  return <IntegrationsManagement />;
}
