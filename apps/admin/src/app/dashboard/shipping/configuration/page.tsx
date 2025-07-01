"use client";

import { Container } from '@mui/material';
import { useSettingsContext } from '@/components/settings/context';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';
import ShippingConfiguration from '@/components/shipping/shipping-configuration';

export default function ShippingConfigurationPage() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Shipping Configuration"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Settings', href: paths.dashboard.root },
          { name: 'Shipping Configuration' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ShippingConfiguration />
    </Container>
  );
}
