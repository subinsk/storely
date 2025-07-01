'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from '@/components/settings';
import TaxConfiguration from '@/components/tax/tax-configuration';

// ----------------------------------------------------------------------

export default function TaxConfigurationPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <TaxConfiguration />
    </Container>
  );
}
