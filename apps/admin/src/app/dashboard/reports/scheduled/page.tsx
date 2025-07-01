'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import ScheduledReports from 'src/components/reports/scheduled-reports';

// ----------------------------------------------------------------------

export default function ScheduledReportsPage() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ScheduledReports />
    </Container>
  );
}
