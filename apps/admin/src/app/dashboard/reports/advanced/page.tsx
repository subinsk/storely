import { Metadata } from 'next';
import { Box, Container } from '@mui/material';
import AdvancedReportsAnalytics from '@/components/reports/advanced-reports-analytics';

export const metadata: Metadata = {
  title: 'Advanced Reports & Analytics | Furnerio Admin',
  description: 'Generate, schedule, and export comprehensive business reports'
};

export default function AdvancedReportsPage() {
  return (
    <Container maxWidth={false}>
      <AdvancedReportsAnalytics />
    </Container>
  );
}
