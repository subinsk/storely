'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import CustomerSegmentation from '@/sections/customer/customer-segmentation';

// ----------------------------------------------------------------------

export default function CustomerSegmentationPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomerSegmentation />
    </Container>
  );
}
