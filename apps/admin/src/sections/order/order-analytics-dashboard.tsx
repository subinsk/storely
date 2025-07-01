import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import Iconify from '@/components/iconify';
import { getOrderAnalytics, OrderAnalytics } from '@/services/order.service';
import { fCurrency, fPercent } from '@/utils/format-number';
import useSWR from 'swr';

interface OrderAnalyticsDashboardProps {
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <Iconify 
                  icon={trend.isPositive ? "solar:trending-up-bold" : "solar:trending-down-bold"}
                  sx={{ 
                    fontSize: 16, 
                    color: trend.isPositive ? 'success.main' : 'error.main'
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {fPercent(Math.abs(trend.value))}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function OrderAnalyticsDashboard({ dateRange }: OrderAnalyticsDashboardProps) {
  const { data: analytics, error, isLoading } = useSWR(
    ['order-analytics', dateRange],
    () => getOrderAnalytics(dateRange)
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load order analytics: {error.message}
      </Alert>
    );
  }

  if (!analytics?.data) {
    return (
      <Alert severity="info">
        No order analytics data available
      </Alert>
    );
  }

  const data: OrderAnalytics = analytics.data;

  return (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Orders"
          value={data.totalOrders.toLocaleString()}
          icon={<Iconify icon="solar:cart-3-bold" />}
          color="primary"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Revenue"
          value={fCurrency(data.totalRevenue)}
          icon={<Iconify icon="solar:dollar-bold" />}
          color="success"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Average Order Value"
          value={fCurrency(data.averageOrderValue)}
          icon={<Iconify icon="solar:chart-bold" />}
          color="info"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Conversion Rate"
          value={fPercent(data.conversionRate)}
          icon={<Iconify icon="solar:users-group-two-rounded-bold" />}
          color="warning"
        />
      </Grid>

      {/* Order Status Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(data.statusDistribution).map(([status, count]) => (
                <Grid item xs={6} key={status}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Status Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Status Distribution
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(data.paymentStatusDistribution || {}).map(([status, count]) => (
                <Grid item xs={6} key={status}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {String(count)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Products */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <Grid container spacing={2}>
              {data.topProducts.slice(0, 5).map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product.productId}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Box flex={1}>
                      <Typography variant="subtitle2" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.quantity} sold
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        {fCurrency(product.revenue)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="text.secondary">
                      #{index + 1}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Revenue Trend */}
      {data.revenueByPeriod && data.revenueByPeriod.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box display="flex" gap={2} minWidth={600}>
                  {data.revenueByPeriod.map((period: any, index) => (
                    <Box key={index} textAlign="center" minWidth={80}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(period.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {fCurrency(period.revenue || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {period.orders} orders
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
