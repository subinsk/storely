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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { paths } from '@/routes/paths';
import { useCustomersReport } from '@/hooks/useReports';
import { fCurrency, fNumber, fPercent } from '@/utils/format-number';
import { fDate, fDateTime } from '@/utils/format-time';
import Iconify from '@/components/iconify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function CustomersReportView() {
  const settings: any = useSettingsContext();
  
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: '30'
  });

  const { customersData, customersLoading, customersError, refresh } = useCustomersReport(filters);

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

  if (customersError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Alert severity="error">Failed to load customers report data</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Customer Analytics"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Reports', href: paths.dashboard.reports.sales },
          { name: 'Customer Analytics' },
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

      {customersLoading ? (
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
                    Total Customers
                  </Typography>
                  <Typography variant="h4">
                    {fNumber(customersData?.summary?.totalCustomers || 0)}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify 
                      icon={customersData?.summary?.customerGrowth >= 0 ? "eva:trending-up-fill" : "eva:trending-down-fill"}
                      color={customersData?.summary?.customerGrowth >= 0 ? "success.main" : "error.main"}
                    />
                    <Typography variant="body2" color={customersData?.summary?.customerGrowth >= 0 ? "success.main" : "error.main"}>
                      {fPercent(Math.abs(customersData?.summary?.customerGrowth || 0))}
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
                    New Customers
                  </Typography>
                  <Typography variant="h4">
                    {fNumber(customersData?.summary?.newCustomers || 0)}
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
                    Retention Rate
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {fPercent(customersData?.insights?.retentionRate || 0)}
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
                    Avg. Lifetime Value
                  </Typography>
                  <Typography variant="h4">
                    {fCurrency(customersData?.insights?.avgLifetimeValue || 0)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Segments */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Segments by Value
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customersData?.customerSegments || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="customer_count"
                        label={({ value_segment, customer_count }) => `${value_segment}: ${customer_count}`}
                      >
                        {(customersData?.customerSegments || []).map((entry: any, index: number) => (
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

          {/* Order Frequency */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Frequency Distribution
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customersData?.orderFrequency || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="frequency_segment" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [fNumber(value), 'Customers']} />
                      <Bar dataKey="customer_count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Customers */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Customers by Revenue
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell align="right">Total Orders</TableCell>
                        <TableCell align="right">Total Spent</TableCell>
                        <TableCell align="right">Avg. Order Value</TableCell>
                        <TableCell align="right">Last Order</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(customersData?.topCustomers || []).slice(0, 10).map((customer: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar src={customer.image} sx={{ width: 32, height: 32 }}>
                                {customer.name?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{customer.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {customer.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">{fNumber(customer.total_orders || 0)}</TableCell>
                          <TableCell align="right">{fCurrency(customer.total_spent || 0)}</TableCell>
                          <TableCell align="right">{fCurrency(customer.avg_order_value || 0)}</TableCell>
                          <TableCell align="right">{fDate(customer.last_order_date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* New Customers */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  New Customers
                </Typography>
                <Stack spacing={1} maxHeight={400} sx={{ overflow: 'auto' }}>
                  {(customersData?.newCustomers || []).map((customer: any, index: number) => (
                    <Card key={index} variant="outlined">
                      <CardContent sx={{ py: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={customer.image} sx={{ width: 32, height: 32 }}>
                            {customer.name?.charAt(0)}
                          </Avatar>
                          <Stack flex={1}>
                            <Typography variant="body2">{customer.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {customer.email}
                            </Typography>
                          </Stack>
                          <Stack alignItems="flex-end">
                            <Typography variant="caption" color="text.secondary">
                              Joined: {fDate(customer.createdAt)}
                            </Typography>
                            <Chip
                              label={`${customer._count?.orders || 0} orders`}
                              size="small"
                              color={customer._count?.orders > 0 ? 'success' : 'default'}
                            />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Customers by Location */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customers by Location
                </Typography>
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Country</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell align="right">Customers</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(customersData?.customersByLocation || []).map((location: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{location.country}</TableCell>
                          <TableCell>{location.state}</TableCell>
                          <TableCell align="right">{fNumber(location.customer_count || 0)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Customer Activity */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Customer Activity
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell align="right">Last Order Value</TableCell>
                        <TableCell align="right">Order Status</TableCell>
                        <TableCell align="right">Last Activity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(customersData?.recentActivity || []).slice(0, 10).map((activity: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {activity.name?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{activity.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">{fCurrency(activity.last_order_value || 0)}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={activity.last_order_status}
                              size="small"
                              color={
                                activity.last_order_status === 'delivered' ? 'success' :
                                activity.last_order_status === 'pending' ? 'warning' :
                                activity.last_order_status === 'cancelled' ? 'error' : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell align="right">{fDate(activity.last_activity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
