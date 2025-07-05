import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import TwoFactorAuthentication from '@/sections/security/two-factor-auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Two-Factor Authentication | Furnerio Admin',
  description: 'Configure and manage two-factor authentication for enhanced security.',
};

// ----------------------------------------------------------------------

export default function TwoFactorAuthPage() {
  return <TwoFactorAuthentication />;
}
