'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import ScheduledReports from '@/sections/reports/scheduled-reports';

// ----------------------------------------------------------------------

export default function ScheduledReportsPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ScheduledReports />
    </Container>
  );
}
