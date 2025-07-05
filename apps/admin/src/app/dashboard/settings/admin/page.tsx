import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import AdminSettings from '@/sections/settings/admin-settings';

export const metadata: Metadata = {
  title: 'Admin Settings | Storely',
  description: 'Configure system security, compliance, and integration settings',
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
