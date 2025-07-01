import { Metadata } from 'next';
import { Box, Container } from '@mui/material';
import LoyaltyProgramManagement from '@/components/loyalty/loyalty-program-management';

export const metadata: Metadata = {
  title: 'Loyalty Program Management | Furnerio Admin',
  description: 'Manage customer loyalty programs, tiers, and rewards'
};

export default function LoyaltyProgramPage() {
  return (
    <Container maxWidth={false}>
      <LoyaltyProgramManagement />
    </Container>
  );
}
