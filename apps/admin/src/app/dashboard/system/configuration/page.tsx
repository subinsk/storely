import { Metadata } from 'next';
import SystemConfiguration from '@/components/system/system-configuration';

export const metadata: Metadata = {
  title: 'System Configuration | Storely',
  description: 'Configure system settings, performance, and general preferences',
};

export default function SystemConfigurationPage() {
  return <SystemConfiguration />;
}
