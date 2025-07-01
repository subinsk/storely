'use client';

import { Container } from '@mui/material';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';
import InvoiceManagement from '@/components/invoice/invoice-management';

export default function InvoicesPage() {
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Invoices"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Invoices' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvoiceManagement />
    </Container>
  );
}
