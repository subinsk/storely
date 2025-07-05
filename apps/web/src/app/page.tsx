'use client';

import { Box } from '@mui/material';
import { HeroSection } from '@storely/shared/components/home/HeroSection';
import { FeaturedProducts } from '@storely/shared/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <FeaturedProducts />
    </Box>
  );
}
