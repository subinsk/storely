import { Metadata } from 'next';
import { Box, Container } from '@mui/material';
import AutomatedInventoryManagement from '@/sections/inventory/automated-inventory-management';

export const metadata: Metadata = {
  title: 'Automated Inventory Management | Furnerio Admin',
  description: 'Manage inventory with automation, alerts, and analytics'
};

export default function AutomatedInventoryPage() {
  return (
    <Container maxWidth={false}>
      <AutomatedInventoryManagement />
    </Container>
  );
}
