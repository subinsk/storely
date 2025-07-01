'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from '@/components/settings';
import FooterConfiguration from '@/components/website/footer-configuration';

// ----------------------------------------------------------------------

export default function FooterConfigurationPage() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <FooterConfiguration />
    </Container>
  );
}
