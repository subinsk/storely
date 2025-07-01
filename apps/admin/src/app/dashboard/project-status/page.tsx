'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from '@/components/settings';
import ProjectStatusSummary from '@/components/dashboard/project-status-summary';

export default function ProjectStatusPage() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ProjectStatusSummary />
    </Container>
  );
}
