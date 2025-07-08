'use client';

import { Box } from '@mui/material';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { useOrganization } from '../contexts/OrganizationContext';
import { CircularProgress, Typography } from '@mui/material';

export default function HomePage() {
  const { organization, isLoading, error } = useOrganization();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !organization) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <Typography variant="h6" color="error">
          {error || 'Organization not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <HeroSection organization={organization} />
      <FeaturedProducts organizationId={organization.id} />
    </Box>
  );
}
