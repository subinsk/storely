'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import Iconify from '@/components/iconify';

const featureCategories = [
  {
    title: 'Core E-commerce',
    progress: 100,
    color: 'success',
    features: [
      '✅ Order Management',
      '✅ Product Catalog',
      '✅ Customer Management',
      '✅ Invoice System',
      '✅ Category Management',
    ],
  },
  {
    title: 'Store Configuration',
    progress: 100,
    color: 'info',
    features: [
      '✅ Payment Gateway Setup',
      '✅ Shipping Configuration',
      '✅ Tax Management',
      '✅ Multi-Currency Support',
      '✅ Store Settings',
    ],
  },
  {
    title: 'Marketing & Sales',
    progress: 100,
    color: 'warning',
    features: [
      '✅ Discount Management',
      '✅ Coupon System',
      '✅ Customer Segmentation',
      '✅ Loyalty Programs',
      '✅ Automated Reports',
    ],
  },
  {
    title: 'Analytics & Reporting',
    progress: 100,
    color: 'error',
    features: [
      '✅ Real-time Dashboard',
      '✅ Sales Analytics',
      '✅ Customer Analytics',
      '✅ Product Performance',
      '✅ Scheduled Reports',
    ],
  },
  {
    title: 'Website Management',
    progress: 100,
    color: 'secondary',
    features: [
      '✅ Footer Configuration',
      '✅ Custom Pages',
      '✅ Homepage Management',
      '✅ Navigation Builder',
      '✅ SEO Tools',
    ],
  },
  {
    title: 'User & Security',
    progress: 100,
    color: 'primary',
    features: [
      '✅ User Management',
      '✅ Role-based Access',
      '✅ Organization Support',
      '✅ Customer Portal',
      '✅ Authentication',
    ],
  },
];

const overallStats = {
  totalFeatures: 30,
  completedFeatures: 30,
  completionRate: 100,
  lastUpdated: 'June 30, 2025',
  version: '2.2',
  status: 'Production Ready',
};

export default function ProjectStatusSummary() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:checkmark-circle-bold" width={32} sx={{ color: 'success.main' }} />
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom>
                Furnerio Admin Dashboard
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={overallStats.status} color="success" size="small" />
                <Chip label={`v${overallStats.version}`} variant="outlined" size="small" />
                <Typography variant="body2" color="text.secondary">
                  Last updated: {overallStats.lastUpdated}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            A comprehensive e-commerce admin dashboard with {overallStats.totalFeatures} production-ready features
          </Typography>
        </Box>

        {/* Overall Progress */}
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Overall Project Completion</Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {overallStats.completionRate}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={overallStats.completionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: 'success.main',
                },
              }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {overallStats.completedFeatures} of {overallStats.totalFeatures} features completed
              </Typography>
              <Typography variant="caption" color="success.main" fontWeight="medium">
                Ready for Production
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Feature Categories */}
        <Grid container spacing={3}>
          {featureCategories.map((category, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6" noWrap>
                        {category.title}
                      </Typography>
                      <Chip
                        label={`${category.progress}%`}
                        color={category.color as any}
                        size="small"
                      />
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={category.progress}
                      color={category.color as any}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                        },
                      }}
                    />

                    <List dense disablePadding>
                      {category.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} disablePadding>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Iconify 
                              icon="solar:check-circle-bold" 
                              width={16} 
                              sx={{ color: 'success.main' }} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature.replace('✅ ', '')}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.secondary',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Technology Stack */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Technology Stack
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Frontend
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">Next.js 14 (App Router)</Typography>
                  <Typography variant="body2">React 18 + TypeScript</Typography>
                  <Typography variant="body2">Material-UI v5</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Backend
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">Next.js API Routes</Typography>
                  <Typography variant="body2">Prisma ORM</Typography>
                  <Typography variant="body2">PostgreSQL</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Authentication
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">NextAuth.js</Typography>
                  <Typography variant="body2">Role-based Access</Typography>
                  <Typography variant="body2">Multi-organization</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Features
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">Analytics Dashboard</Typography>
                  <Typography variant="body2">Payment Gateway</Typography>
                  <Typography variant="body2">Customer Portal</Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
