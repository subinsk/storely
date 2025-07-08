"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  CardHeader,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Iconify } from '@storely/shared/components';

// ----------------------------------------------------------------------

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  chart?: React.ReactNode;
}

function AnalyticsCard({
  title,
  value,
  change,
  changeType,
  icon,
  color = 'primary',
  chart
}: AnalyticsCardProps) {
  const theme = useTheme();

  const isPositiveChange = changeType === 'increase';
  const changeColor = isPositiveChange ? 'success' : 'error';
  const changeIcon = isPositiveChange ? 'eva:trending-up-fill' : 'eva:trending-down-fill';

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" pt={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify
                icon={changeIcon}
                sx={{
                  width: 16,
                  height: 16,
                  color: `${changeColor}.main`,
                }}
              />
              <Typography
                variant="subtitle2"
                color={`${changeColor}.main`}
              >
                {Math.abs(change)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs last month
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette[color].main, 0.12),
            }}
          >
            <Iconify
              icon={icon}
              sx={{
                width: 28,
                height: 28,
                color: `${color}.main`,
              }}
            />
          </Box>
        </Stack>
        {chart && (
          <Box sx={{ mt: 2 }}>
            {chart}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  image?: string;
}

interface TopProductsCardProps {
  products: TopProduct[];
}

function TopProductsCard({ products }: TopProductsCardProps) {
  return (
    <Card>
      <CardHeader
        title="Top Products"
        action={<IconButton size="small"><Iconify icon="eva:more-vertical-fill" /></IconButton>}
      />
      <CardContent>
        <Stack spacing={2}>
          {products.map((product, index) => (
            <Stack key={product.id} direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {product.image ? (
                  <Box
                    component="img"
                    src={product.image}
                    sx={{ width: 32, height: 32, borderRadius: 1 }}
                  />
                ) : (
                  <Iconify icon="eva:cube-outline" sx={{ width: 20, height: 20 }} />
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" noWrap>
                  {product.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    {product.sales} sales
                  </Typography>
                  <Chip
                    size="small"
                    label={`+${product.growth}%`}
                    color={product.growth > 0 ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Stack>
              </Box>
              <Typography variant="subtitle2" color="text.primary">
                ${product.revenue.toLocaleString()}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard(){
  return(
    <Stack spacing={2}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon="eva:plus-fill" sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Add New Product</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create a new product listing
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'info.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon="eva:upload-fill" sx={{ color: 'info.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Bulk Import</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Import products from CSV
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'success.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon="eva:settings-2-fill" sx={{ color: 'success.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Store Settings</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configure your webstore
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Stack>
  )
}

// ----------------------------------------------------------------------

interface OverviewStatsProps {
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalCustomers?: number;
  growthData?: {
    products: number;
    orders: number;
    revenue: number;
    customers: number;
  };
}

export default function AnalyticsDashboard({
  totalProducts = 0,
  totalOrders = 0,
  totalRevenue = 0,
  totalCustomers = 0,
  growthData = {
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
  },
}: OverviewStatsProps) {
  const topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Modern Oak Dining Table',
      sales: 127,
      revenue: 15240,
      growth: 12.5,
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      sales: 89,
      revenue: 8900,
      growth: 8.2,
    },
    {
      id: '3',
      name: 'Vintage Leather Sofa',
      sales: 67,
      revenue: 13400,
      growth: -2.1,
    },
    {
      id: '4',
      name: 'Minimalist Bookshelf',
      sales: 45,
      revenue: 4500,
      growth: 15.3,
    },
  ];

  const SimpleChart = ({ color, value }: { color: string; value: number }) => (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={Math.abs(value)}
        color={color as any}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: alpha('#000', 0.08),
        }}
      />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Analytics Overview
      </Typography>

      <Grid container spacing={3} sx={{ ml: '-24px' }}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsCard
            title="Total Products"
            value={totalProducts.toLocaleString()}
            change={growthData.products}
            changeType={growthData.products >= 0 ? 'increase' : 'decrease'}
            icon="eva:cube-fill"
            color="primary"
            chart={<SimpleChart color="primary" value={Math.abs(growthData.products)} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            change={growthData.orders}
            changeType={growthData.orders >= 0 ? 'increase' : 'decrease'}
            icon="eva:shopping-cart-fill"
            color="info"
            chart={<SimpleChart color="info" value={Math.abs(growthData.orders)} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change={growthData.revenue}
            changeType={growthData.revenue >= 0 ? 'increase' : 'decrease'}
            icon="eva:pie-chart-2-fill"
            color="success"
            chart={<SimpleChart color="success" value={Math.abs(growthData.revenue)} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsCard
            title="Total Customers"
            value={totalCustomers.toLocaleString()}
            change={growthData.customers}
            changeType={growthData.customers >= 0 ? 'increase' : 'decrease'}
            icon="eva:people-fill"
            color="warning"
            chart={<SimpleChart color="warning" value={Math.abs(growthData.customers)} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={8}></Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <TopProductsCard products={topProducts} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Quick Actions"
            />
            <CardContent>
              <QuickActionsCard />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
