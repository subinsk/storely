'use client';

import React, { Suspense } from 'react';
import { Container } from '@mui/material';
import StoreSettingsManagement from '@/sections/store/store-settings-management';
import { useRouter, useSearchParams } from 'next/navigation';

const StoreSettingsContent: React.FC = () => {
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

const StoreSettingsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreSettingsContent />
    </Suspense>
  );
};

export default StoreSettingsPage;
