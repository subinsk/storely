'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import TaxConfiguration from '@/sections/tax/tax-configuration';

// ----------------------------------------------------------------------

export default function TaxConfigurationPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <TaxConfiguration />
    </Container>
  );
}
