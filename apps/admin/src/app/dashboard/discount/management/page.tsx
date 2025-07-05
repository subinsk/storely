"use client"

import { Container } from '@mui/material';
import { useSettingsContext } from '@storely/shared/components/settings';
import {CustomBreadcrumbs} from '@storely/shared/components';
import { paths } from '@/routes/paths';
import DiscountCouponManagement from '@/sections/discount/discount-coupon-management';

export default function DiscountManagementPage() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Discount & Coupon Management"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Marketing', href: paths.dashboard.root },
          { name: 'Discounts & Coupons' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DiscountCouponManagement />
    </Container>
  );
}
