'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from '@/components/settings';
import MultiCurrencyManagement from '@/components/currency/multi-currency-management';

// ----------------------------------------------------------------------

export default function CurrencyConfigurationPage() {
  const settings:any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <MultiCurrencyManagement />
    </Container>
  );
}
