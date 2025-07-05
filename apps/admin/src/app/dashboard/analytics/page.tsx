'use client';

import { Container } from '@mui/material';
import {CustomBreadcrumbs} from '@storely/shared/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';
import ComprehensiveDashboard from '@/sections/analytics/comprehensive-dashboard';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Analytics"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Analytics' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ComprehensiveDashboard />
    </Container>
  );
}
