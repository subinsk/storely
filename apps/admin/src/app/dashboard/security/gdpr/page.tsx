import type { Metadata } from 'next';
import GDPRCompliance from '@/components/security/gdpr-compliance';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'GDPR Compliance | Furnerio Admin',
  description: 'Manage GDPR compliance with tools for data subject requests, consent management, and privacy impact assessments.',
};

// ----------------------------------------------------------------------

export default function GDPRCompliancePage() {
  return <GDPRCompliance />;
}
