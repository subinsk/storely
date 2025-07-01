'use client';

import { Container } from '@mui/material';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';
import ComprehensiveDashboard from '@/components/analytics/comprehensive-dashboard';

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
