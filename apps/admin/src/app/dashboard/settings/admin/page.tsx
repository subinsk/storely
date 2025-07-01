import { Metadata } from 'next';
import AdminSettings from '@/components/settings/admin-settings';

export const metadata: Metadata = {
  title: 'Admin Settings | Storely',
  description: 'Configure system security, compliance, and integration settings',
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
