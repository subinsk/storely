'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import MultiCurrencyManagement from '@/sections/currency/multi-currency-management';

// ----------------------------------------------------------------------

export default function CurrencyConfigurationPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <MultiCurrencyManagement />
    </Container>
  );
}
