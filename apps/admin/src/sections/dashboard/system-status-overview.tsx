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
  LinearProgress,
  alpha,
  Avatar,
} from '@mui/material';
import { RouterLink } from '@/routes/components';
import { paths } from '@/routes/paths';
import {Iconify} from '@storely/shared/components/iconify';

// Mock system status data
const systemStatus = [
  {
    title: 'System Health',
    status: 'healthy',
    value: '99.9%',
    description: 'All systems operational',
    path: paths.dashboard.system.logs,
    icon: 'solar:heart-pulse-outline',
    color: 'success',
    progress: 99,
  },
  {
    title: 'Security Score',
    status: 'good',
    value: '85/100',
    description: 'Security measures active',
    path: paths.dashboard.security.auditLogs,
    icon: 'solar:shield-check-outline',
    color: 'primary',
    progress: 85,
  },
  {
    title: 'Active Sessions',
    status: 'normal',
    value: '247',
    description: 'Users currently online',
    path: paths.dashboard.security.twoFactor,
    icon: 'solar:users-group-rounded-outline',
    color: 'info',
    progress: 60,
  },
  {
    title: 'Data Backup',
    status: 'scheduled',
    value: '2h ago',
    description: 'Last backup completed',
    path: paths.dashboard.system.backup,
    icon: 'solar:database-outline',
    color: 'warning',
    progress: 100,
  },
  {
    title: 'GDPR Compliance',
    status: 'compliant',
    value: '100%',
    description: 'Fully compliant with GDPR',
    path: paths.dashboard.security.gdpr,
    icon: 'solar:document-text-outline',
    color: 'success',
    progress: 100,
  },
  {
    title: 'API Integrations',
    status: 'partial',
    value: '6/10',
    description: 'Active integrations',
    path: paths.dashboard.integrations,
    icon: 'solar:link-outline',
    color: 'warning',
    progress: 60,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'compliant':
      return 'success';
    case 'good':
    case 'normal':
      return 'info';
    case 'scheduled':
    case 'partial':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'Healthy';
    case 'good':
      return 'Good';
    case 'normal':
      return 'Normal';
    case 'scheduled':
      return 'Scheduled';
    case 'partial':
      return 'Partial';
    case 'compliant':
      return 'Compliant';
    case 'critical':
      return 'Critical';
    default:
      return 'Unknown';
  }
};

export default function SystemStatusOverview() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        System Status Overview
      </Typography>
      
      <Grid container spacing={3}>
        {systemStatus.map((item, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              component={RouterLink}
              href={item.path}
              sx={{
                height: '100%',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: `${item.color}.lighter`,
                        color: `${item.color}.main`,
                      }}
                    >
                      <Iconify icon={item.icon} width={24} />
                    </Avatar>
                    <Chip
                      label={getStatusLabel(item.status)}
                      color={getStatusColor(item.status) as any}
                      size="small"
                    />
                  </Stack>

                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h4" color={`${item.color}.main`} gutterBottom>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.progress}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={item.progress}
                      color={item.color as any}
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
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
