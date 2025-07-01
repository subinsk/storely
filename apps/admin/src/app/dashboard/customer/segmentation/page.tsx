'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomerSegmentation from 'src/components/customer/customer-segmentation';

// ----------------------------------------------------------------------

export default function CustomerSegmentationPage() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomerSegmentation />
    </Container>
  );
}
