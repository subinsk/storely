'use client';

import { useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { paths } from '@/routes/paths';
import { useSalesReport } from '@/hooks/useReports';
import { fCurrency, fNumber, fPercent } from '@/utils/format-number';
import { fDate } from '@/utils/format-time';
import Iconify from '@/components/iconify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SalesReportView() {
  const settings: any = useSettingsContext();
  
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: '30'
  });

  const { salesData, salesLoading, salesError, refresh } = useSalesReport(filters);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePeriodChange = useCallback((period: string) => {
    const end = new Date();
    const start = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    
    setFilters({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      period
    });
  }, []);

  if (salesError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Alert severity="error">Failed to load sales report data</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Sales Report"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Reports', href: paths.dashboard.reports.sales },
          { name: 'Sales Report' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={filters.period}
                label="Period"
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 3 months</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={new Date(filters.startDate)}
                onChange={(date) => handleFilterChange('startDate', date?.toISOString().split('T')[0])}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={new Date(filters.endDate)}
                onChange={(date) => handleFilterChange('endDate', date?.toISOString().split('T')[0])}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>

            <Button variant="outlined" onClick={refresh} startIcon={<Iconify icon="eva:refresh-fill" />}>
              Refresh
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {salesLoading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    {fCurrency(salesData?.summary?.totalRevenue || 0)}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify 
                      icon={salesData?.summary?.revenueGrowth >= 0 ? "eva:trending-up-fill" : "eva:trending-down-fill"}
                      color={salesData?.summary?.revenueGrowth >= 0 ? "success.main" : "error.main"}
                    />
                    <Typography variant="body2" color={salesData?.summary?.revenueGrowth >= 0 ? "success.main" : "error.main"}>
                      {fPercent(Math.abs(salesData?.summary?.revenueGrowth || 0))}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {fNumber(salesData?.summary?.totalOrders || 0)}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify 
                      icon={salesData?.summary?.ordersGrowth >= 0 ? "eva:trending-up-fill" : "eva:trending-down-fill"}
                      color={salesData?.summary?.ordersGrowth >= 0 ? "success.main" : "error.main"}
                    />
                    <Typography variant="body2" color={salesData?.summary?.ordersGrowth >= 0 ? "success.main" : "error.main"}>
                      {fPercent(Math.abs(salesData?.summary?.ordersGrowth || 0))}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" color="text.secondary">
                    Average Order Value
                  </Typography>
                  <Typography variant="h4">
                    {fCurrency(salesData?.summary?.averageOrderValue || 0)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h6" color="text.secondary">
                    Period
                  </Typography>
                  <Typography variant="body2">
                    {fDate(salesData?.summary?.period?.start)} - {fDate(salesData?.summary?.period?.end)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sales Trend Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Trend
                </Typography>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData?.dailySales || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'revenue' ? fCurrency(value) : fNumber(value),
                          name === 'revenue' ? 'Revenue' : 'Orders'
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Orders by Status */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Orders by Status
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesData?.ordersByStatus || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="_count"
                        label={({ status, _count }) => `${status}: ${_count}`}
                      >
                        {(salesData?.ordersByStatus || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sales by Category */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales by Category
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData?.salesByCategory || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category_name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [fCurrency(value), 'Revenue']} />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
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
                  {(salesData?.topProducts || []).slice(0, 6).map((item: any, index: number) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              component="img"
                              src={item.product?.images?.[0] || '/placeholder.png'}
                              sx={{ width: 60, height: 60, borderRadius: 1 }}
                            />
                            <Stack flex={1}>
                              <Typography variant="subtitle2" noWrap>
                                {item.product?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Sold: {fNumber(item._sum?.quantity || 0)} units
                              </Typography>
                              <Typography variant="body2" color="primary.main">
                                Revenue: {fCurrency(item._sum?.total || 0)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Methods */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Methods
                </Typography>
                <Box height={250}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesData?.paymentMethods || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="_sum.amount"
                        label={({ paymentMethod, _sum }) => `${paymentMethod}: ${fCurrency(_sum?.amount || 0)}`}
                      >
                        {(salesData?.paymentMethods || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [fCurrency(value), 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
