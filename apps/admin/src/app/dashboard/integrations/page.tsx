import type { Metadata } from 'next';
import IntegrationsManagement from '@/sections/integrations/integrations-management';

export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Third-Party Integrations | Furnerio Admin',
  description: 'Connect your store with external services to streamline workflow and improve customer experience.',
};

// ----------------------------------------------------------------------

export default function IntegrationsPage() {
  return <IntegrationsManagement />;
}
