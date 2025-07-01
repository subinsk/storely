'use client';

import { Box } from '@mui/material';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <FeaturedProducts />
    </Box>
  );
}
