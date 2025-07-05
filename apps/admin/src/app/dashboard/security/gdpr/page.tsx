import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import GDPRCompliance from '@/sections/security/gdpr-compliance';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'GDPR Compliance | Furnerio Admin',
  description: 'Manage GDPR compliance with tools for data subject requests, consent management, and privacy impact assessments.',
};

// ----------------------------------------------------------------------

export default function GDPRCompliancePage() {
  return <GDPRCompliance />;
}
