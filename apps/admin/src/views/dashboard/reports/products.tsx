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
  Chip,
  Avatar
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
  ScatterChart,
  Scatter
} from 'recharts';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import { useSettingsContext } from '@/components/settings';
import { paths } from '@/routes/paths';
import { useProductsReport } from '@/hooks/useReports';
import { fCurrency, fNumber } from '@/utils/format-number';
import Iconify from '@/components/iconify';
import Label from '@/components/label';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ProductsReportView() {
  const settings: any = useSettingsContext();
  
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: '30'
  });

  const { productsData, productsLoading, productsError, refresh } = useProductsReport(filters);

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

  if (productsError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Alert severity="error">Failed to load products report data</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Product Performance"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Reports', href: paths.dashboard.reports.sales },
          { name: 'Product Performance' },
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

      {productsLoading ? (
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
                    Total Products
                  </Typography>
                  <Typography variant="h4">
                    {fNumber(productsData?.summary?.totalProducts || 0)}
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
                    Average Price
                  </Typography>
                  <Typography variant="h4">
                    {fCurrency(productsData?.summary?.averagePrice || 0)}
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
                    Inventory Value
                  </Typography>
                  <Typography variant="h4">
                    {fCurrency(productsData?.summary?.totalInventoryValue || 0)}
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
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {fNumber(productsData?.insights?.needsRestocking || 0)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Stock Levels Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stock Levels Overview
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'In Stock', value: productsData?.summary?.stockLevels?.in_stock || 0, color: '#00C49F' },
                          { name: 'Low Stock', value: productsData?.summary?.stockLevels?.low_stock || 0, color: '#FFBB28' },
                          { name: 'Out of Stock', value: productsData?.summary?.stockLevels?.out_of_stock || 0, color: '#FF8042' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: 'In Stock', value: productsData?.summary?.stockLevels?.in_stock || 0, color: '#00C49F' },
                          { name: 'Low Stock', value: productsData?.summary?.stockLevels?.low_stock || 0, color: '#FFBB28' },
                          { name: 'Out of Stock', value: productsData?.summary?.stockLevels?.out_of_stock || 0, color: '#FF8042' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Performance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Performance
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productsData?.categoryPerformance || []}>
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

          {/* Top Selling Products */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Selling Products
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell align="right">Units Sold</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(productsData?.topSellingProducts || []).slice(0, 10).map((product: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                src={product.images?.[0] || '/placeholder.png'}
                                variant="rounded"
                                sx={{ width: 40, height: 40 }}
                              />
                              <Typography variant="body2">{product.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell align="right">{fNumber(product.units_sold || 0)}</TableCell>
                          <TableCell align="right">{fCurrency(product.revenue || 0)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Low Stock Products */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Low Stock Alert
                </Typography>
                <Stack spacing={1} maxHeight={400} sx={{ overflow: 'auto' }}>
                  {(productsData?.lowStockProducts || []).map((product: any, index: number) => (
                    <Card key={index} variant="outlined">
                      <CardContent sx={{ py: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={product.images?.[0] || '/placeholder.png'}
                            variant="rounded"
                            sx={{ width: 32, height: 32 }}
                          />
                          <Stack flex={1}>
                            <Typography variant="body2" noWrap>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              SKU: {product.sku}
                            </Typography>
                          </Stack>
                          <Chip
                            label={`${product.quantity} left`}
                            color={product.quantity === 0 ? 'error' : 'warning'}
                            size="small"
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Slow Moving Products */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Slow Moving Products
                </Typography>
                <Stack spacing={1} maxHeight={400} sx={{ overflow: 'auto' }}>
                  {(productsData?.slowMovingProducts || []).slice(0, 10).map((product: any, index: number) => (
                    <Card key={index} variant="outlined">
                      <CardContent sx={{ py: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Stack flex={1}>
                            <Typography variant="body2" noWrap>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              SKU: {product.sku} | Stock: {product.quantity}
                            </Typography>
                          </Stack>
                          <Label color="warning" variant="soft">
                            No sales
                          </Label>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
