'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  LinearProgress,
  alpha,
} from '@mui/material';
import { RouterLink } from '@/routes/components';
import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';

// Mock configuration status data
const configurationStatus = [
  {
    title: 'Payment Gateway',
    status: 'configured',
    description: 'Payment methods are set up and ready',
    path: paths.dashboard.payment.configuration,
    icon: 'ic_banking',
    progress: 100,
  },
  {
    title: 'Shipping Configuration',
    status: 'partial',
    description: 'Some shipping zones need configuration',
    path: paths.dashboard.shipping.configuration,
    icon: 'ic_ecommerce',
    progress: 75,
  },
  {
    title: 'Tax Settings',
    status: 'configured',
    description: 'Tax rules are properly configured',
    path: paths.dashboard.tax.configuration,
    icon: 'ic_invoice',
    progress: 100,
  },
  {
    title: 'Multi-Currency',
    status: 'pending',
    description: 'Currency settings need to be configured',
    path: paths.dashboard.currency.configuration,
    icon: 'ic_banking',
    progress: 25,
  },
  {
    title: 'System Monitoring',
    status: 'configured',
    description: 'System logs and monitoring active',
    path: paths.dashboard.system.logs,
    icon: 'ic_analytics',
    progress: 95,
  },
  {
    title: 'Security & Audit',
    status: 'configured',
    description: 'Security features and audit logs enabled',
    path: paths.dashboard.security.auditLogs,
    icon: 'ic_lock',
    progress: 90,
  },
  {
    title: 'Integrations',
    status: 'partial',
    description: 'Some integrations need configuration',
    path: paths.dashboard.integrations,
    icon: 'ic_external',
    progress: 60,
  },
  {
    title: 'Customer Segmentation',
    status: 'partial',
    description: 'Customer segments partially configured',
    path: paths.dashboard.customer.segmentation,
    icon: 'ic_user',
    progress: 60,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'configured':
      return 'success';
    case 'partial':
      return 'warning';
    case 'pending':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'configured':
      return 'Ready';
    case 'partial':
      return 'Partial';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

export default function ConfigurationOverview() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Store Configuration Overview
      </Typography>
      
      <Grid container spacing={3}>
        {configurationStatus.map((config, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify 
                        icon={`solar:${config.icon === 'ic_banking' ? 'card-outline' : 
                          config.icon === 'ic_ecommerce' ? 'shop-outline' :
                          config.icon === 'ic_invoice' ? 'bill-list-outline' :
                          config.icon === 'ic_label' ? 'tag-outline' :
                          config.icon === 'ic_user' ? 'users-group-rounded-outline' :
                          config.icon === 'ic_analytics' ? 'chart-outline' :
                          config.icon === 'ic_lock' ? 'shield-check-outline' :
                          config.icon === 'ic_external' ? 'link-outline' : 'settings-outline'}`}
                        width={24}
                        sx={{ color: 'primary.main' }}
                      />
                    </Box>
                    <Chip
                      label={getStatusLabel(config.status)}
                      color={getStatusColor(config.status) as any}
                      size="small"
                    />
                  </Stack>

                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {config.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {config.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Configuration Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={config.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>

                  <Button
                    component={RouterLink}
                    href={config.path}
                    variant="outlined"
                    size="small"
                    endIcon={<Iconify icon="solar:arrow-right-outline" width={16} />}
                    sx={{ mt: 'auto' }}
                  >
                    Configure
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
