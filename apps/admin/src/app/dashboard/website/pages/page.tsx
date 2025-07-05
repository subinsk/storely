'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import CustomPagesManagement from '@/sections/website/custom-pages-management';

// ----------------------------------------------------------------------

export default function CustomPagesPage() {
  const settings = { themeStretch: false } as any;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomPagesManagement />
    </Container>
  );
}
