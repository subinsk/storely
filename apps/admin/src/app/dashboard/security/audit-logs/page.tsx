import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import AuditLogs from '@/sections/security/audit-logs';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Audit Logs | Furnerio Admin',
  description: 'Track all user actions and system changes for security and compliance purposes.',
};

// ----------------------------------------------------------------------

export default function AuditLogsPage() {
  return <AuditLogs />;
}
