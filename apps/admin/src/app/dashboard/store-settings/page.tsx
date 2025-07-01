'use client';

import React from 'react';
import { Container } from '@mui/material';
import StoreSettingsManagement from '@/components/store/store-settings-management';
import { useRouter, useSearchParams } from 'next/navigation';

const StoreSettingsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // For demo purposes, using a default organization ID
  // In a real app, this would come from the user's session/context
  const organizationId = searchParams.get('orgId') || 'default-org-id';

  return (
    <Container maxWidth={false}>
      <StoreSettingsManagement organizationId={organizationId} />
    </Container>
  );
};

export default StoreSettingsPage;
