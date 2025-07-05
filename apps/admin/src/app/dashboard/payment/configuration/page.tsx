"use client"

import { Container } from '@mui/material';

export const dynamic = 'force-dynamic';

import { useSettingsContext } from '@storely/shared/components/settings';
import {CustomBreadcrumbs} from '@storely/shared/components';
import { paths } from '@/routes/paths';
import PaymentGatewayManagement from '@/sections/payment/payment-gateway-management';

export default function PaymentConfigurationPage() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Payment Configuration"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Settings', href: paths.dashboard.root },
          { name: 'Payment Configuration' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PaymentGatewayManagement />
    </Container>
  );
}
