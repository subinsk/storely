import type { Metadata } from 'next';
import TwoFactorAuthentication from '@/components/security/two-factor-auth';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Two-Factor Authentication | Furnerio Admin',
  description: 'Configure and manage two-factor authentication for enhanced security.',
};

// ----------------------------------------------------------------------

export default function TwoFactorAuthPage() {
  return <TwoFactorAuthentication />;
}
