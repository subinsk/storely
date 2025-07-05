'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import ProjectStatusSummary from '@/sections/dashboard/project-status-summary';

export default function ProjectStatusPage() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ProjectStatusSummary />
    </Container>
  );
}
