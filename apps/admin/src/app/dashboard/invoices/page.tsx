'use client';

export const dynamic = 'force-dynamic';


import { Container } from '@mui/material';
import { CustomBreadcrumbs } from '@storely/shared/components/custom-breadcrumbs';
import { paths } from '@/routes/paths';
import InvoiceManagement from '@/sections/invoice/invoice-management';

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
