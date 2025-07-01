'use client';

import { Container } from '@mui/material';
import CustomPagesManagement from '@/components/website/custom-pages-management';

// ----------------------------------------------------------------------

export default function CustomPagesPage() {
  const settings = { themeStretch: false } as any;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomPagesManagement />
    </Container>
  );
}
