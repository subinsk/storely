'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '../contexts/OrganizationContext';
import { Box, Typography, Paper, Button, Container } from '@mui/material';
import { Lock, Warning, Store } from '@mui/icons-material';

interface StoreAccessGuardProps {
  children: React.ReactNode;
}

export default function StoreAccessGuard({ children }: StoreAccessGuardProps) {
  const { organization, isLoading, error } = useOrganization();
  const [accessStatus, setAccessStatus] = useState<'loading' | 'allowed' | 'inactive' | 'expired' | 'suspended'>('loading');

  useEffect(() => {
    if (isLoading) {
      setAccessStatus('loading');
      return;
    }

    if (error || !organization) {
      setAccessStatus('inactive');
      return;
    }

    // Check organization status
    if (!organization.isActive) {
      setAccessStatus('inactive');
      return;
    }

    // Check plan status
    if (organization.plan === 'expired') {
      setAccessStatus('expired');
      return;
    }

    if (organization.plan === 'suspended') {
      setAccessStatus('suspended');
      return;
    }

    setAccessStatus('allowed');
  }, [organization, isLoading, error]);

  if (accessStatus === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading store...</Typography>
      </Box>
    );
  }

  if (accessStatus === 'allowed') {
    return <>{children}</>;
  }

  // Show access denied page
  const getStatusConfig = () => {
    switch (accessStatus) {
      case 'inactive':
        return {
          icon: <Warning color="error" sx={{ fontSize: 64 }} />,
          title: 'Store Unavailable',
          message: 'This store is currently inactive or does not exist.',
          action: null,
        };
      case 'expired':
        return {
          icon: <Lock color="warning" sx={{ fontSize: 64 }} />,
          title: 'Subscription Expired',
          message: 'This store\'s subscription has expired. Please contact the store owner to renew.',
          action: (
            <Button
              variant="contained"
              color="warning"
              href="mailto:support@storely.com"
            >
              Contact Support
            </Button>
          ),
        };
      case 'suspended':
        return {
          icon: <Lock color="error" sx={{ fontSize: 64 }} />,
          title: 'Store Suspended',
          message: 'This store has been suspended. Please contact support for assistance.',
          action: (
            <Button
              variant="contained"
              color="error"
              href="mailto:support@storely.com"
            >
              Contact Support
            </Button>
          ),
        };
      default:
        return {
          icon: <Store color="disabled" sx={{ fontSize: 64 }} />,
          title: 'Store Access Denied',
          message: 'You don\'t have access to this store.',
          action: null,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          {statusConfig.icon}
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {statusConfig.title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {statusConfig.message}
        </Typography>
        
        {statusConfig.action && (
          <Box sx={{ mt: 3 }}>
            {statusConfig.action}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
