import type { Metadata } from 'next';
import AuditLogs from '@/components/security/audit-logs';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Audit Logs | Furnerio Admin',
  description: 'Track all user actions and system changes for security and compliance purposes.',
};

// ----------------------------------------------------------------------

export default function AuditLogsPage() {
  return <AuditLogs />;
}
