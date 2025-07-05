'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import FooterConfiguration from '@/sections/website/footer-configuration';

// ----------------------------------------------------------------------

export default function FooterConfigurationPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <FooterConfiguration />
    </Container>
  );
}
