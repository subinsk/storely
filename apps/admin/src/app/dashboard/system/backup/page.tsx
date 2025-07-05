import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import BackupRestore from '@/sections/system/backup-restore';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Backup & Restore | Furnerio Admin',
  description: 'Manage system backups and restore operations for data protection.',
};

// ----------------------------------------------------------------------

export default function BackupRestorePage() {
  return <BackupRestore />;
}
