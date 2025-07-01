"use client";

import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
  Badge,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, subDays, startOfDay, endOfDay, addDays } from 'date-fns';
import { fCurrency, fNumber, fPercent } from '@/utils/format-number';
import Iconify from '@/components/iconify';

// Types
interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
  avgOrderValue: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  margin: number;
  category: string;
  inventory: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  percentage: number;
  avgOrderValue: number;
  color: string;
}

interface AnalyticsMetrics {
  revenue: {
    total: number;
    growth: number;
    target: number;
    forecast: number;
  };
  orders: {
    total: number;
    growth: number;
    avgValue: number;
    conversionRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    churnRate: number;
  };
  products: {
    totalSKUs: number;
    outOfStock: number;
    lowStock: number;
    topPerforming: number;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Mock data - in real app, this would come from API
const generateMockData = (days: number): TimeSeriesData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i);
    const baseRevenue = 3000 + Math.sin((i / days) * Math.PI * 2) * 1000;
    return {
      date: format(date, 'MMM dd'),
      revenue: Math.floor(baseRevenue + (Math.random() - 0.5) * 500),
      orders: Math.floor((baseRevenue / 50) + (Math.random() - 0.5) * 10),
      visitors: Math.floor((baseRevenue / 10) + (Math.random() - 0.5) * 50),
      conversionRate: Number(((Math.random() * 0.05) + 0.02).toFixed(3)),
      avgOrderValue: Math.floor(baseRevenue / ((baseRevenue / 50) + (Math.random() - 0.5) * 10))
    };
  });
};

const mockMetrics: AnalyticsMetrics = {
  revenue: {
    total: 125000,
    growth: 15.3,
    target: 150000,
    forecast: 142000
  },
  orders: {
    total: 1250,
    growth: 8.2,
    avgValue: 100,
    conversionRate: 2.5
  },
  customers: {
    total: 2340,
    new: 156,
    returning: 89,
    churnRate: 5.2
  },
  products: {
    totalSKUs: 450,
    outOfStock: 12,
    lowStock: 23,
    topPerforming: 67
  }
};

const mockProductData: ProductPerformance[] = [
  { name: 'Modern Sofa Set', sales: 145, revenue: 72500, growth: 12.5, margin: 35, category: 'Living Room', inventory: 23 },
  { name: 'Dining Table Oak', sales: 98, revenue: 49000, growth: 8.3, margin: 42, category: 'Dining', inventory: 15 },
  { name: 'Office Chair Pro', sales: 87, revenue: 26100, growth: -2.1, margin: 28, category: 'Office', inventory: 45 },
  { name: 'Bedroom Set Deluxe', sales: 65, revenue: 97500, growth: 18.7, margin: 38, category: 'Bedroom', inventory: 8 },
  { name: 'Coffee Table Glass', sales: 54, revenue: 16200, growth: 5.4, margin: 45, category: 'Living Room', inventory: 32 }
];

const mockCustomerSegments: CustomerSegment[] = [
  { segment: 'VIP Customers', count: 234, revenue: 45600, percentage: 36.5, avgOrderValue: 195, color: '#0088FE' },
  { segment: 'Regular Customers', count: 856, revenue: 52300, percentage: 41.8, avgOrderValue: 61, color: '#00C49F' },
  { segment: 'New Customers', count: 432, revenue: 18700, percentage: 14.9, avgOrderValue: 43, color: '#FFBB28' },
  { segment: 'Churned Risk', count: 178, revenue: 8400, percentage: 6.8, avgOrderValue: 47, color: '#FF8042' }
];

export default function ComprehensiveDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });
  const [tabValue, setTabValue] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportRange, setExportRange] = useState('current');
  const [isExporting, setIsExporting] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  const timeSeriesData = generateMockData(30);
  const comparisonData = compareMode ? generateMockData(30) : [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download file based on format
      const data = {
        metrics: mockMetrics,
        timeSeries: timeSeriesData,
        products: mockProductData,
        customers: mockCustomerSegments,
        generatedAt: new Date().toISOString(),
        dateRange: {
          start: format(dateRange.startDate, 'yyyy-MM-dd'),
          end: format(dateRange.endDate, 'yyyy-MM-dd')
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportDialogOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [exportFormat, dateRange, timeSeriesData]);

  const MetricCard = ({ title, value, growth, target, icon, color = 'primary' }: any) => (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <Chip
                icon={<Iconify icon={growth >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />}
                label={`${growth >= 0 ? '+' : ''}${growth}%`}
                color={growth >= 0 ? 'success' : 'error'}
                size="small"
              />
              {target && (
                <Typography variant="body2" color="text.secondary">
                  Target: {target}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: `${color}.lighter`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Iconify icon={icon} width={32} height={32} color={`${color}.main`} />
          </Box>
        </Stack>
        {target && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Progress to Target
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((Number(value.replace(/[^0-9]/g, '')) / Number(target.replace(/[^0-9]/g, ''))) * 100, 100)}
              color={color}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive insights and performance metrics
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={(newValue) => newValue && setDateRange(prev => ({ ...prev, startDate: newValue }))}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={(newValue) => newValue && setDateRange(prev => ({ ...prev, endDate: newValue }))}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>

          <Button
            variant={compareMode ? 'contained' : 'outlined'}
            onClick={() => setCompareMode(!compareMode)}
            startIcon={<Iconify icon="eva:bar-chart-2-fill" />}
          >
            Compare
          </Button>

          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:download-fill" />}
            onClick={() => setExportDialogOpen(true)}
          >
            Export
          </Button>
        </Stack>
      </Stack>

      {/* Quick Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={fCurrency(mockMetrics.revenue.total)}
            growth={mockMetrics.revenue.growth}
            target={fCurrency(mockMetrics.revenue.target)}
            icon="eva:dollar-sign-outline"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={fNumber(mockMetrics.orders.total)}
            growth={mockMetrics.orders.growth}
            icon="eva:shopping-cart-outline"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Customers"
            value={fNumber(mockMetrics.customers.total)}
            growth={((mockMetrics.customers.new - mockMetrics.customers.returning) / mockMetrics.customers.total * 100)}
            icon="eva:people-outline"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={fPercent(mockMetrics.orders.conversionRate / 100)}
            growth={12.3}
            icon="eva:trending-up-outline"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:bar-chart-2-outline" />
                  <span>Overview</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:cube-outline" />
                  <span>Products</span>
                  <Badge badgeContent={mockMetrics.products.outOfStock} color="error" />
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:people-outline" />
                  <span>Customers</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:pie-chart-2-outline" />
                  <span>Advanced</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Revenue Chart */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue & Orders Trend
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? fCurrency(Number(value)) : fNumber(Number(value)),
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      fill="#0088FE" 
                      stroke="#0088FE"
                      fillOpacity={0.3}
                    />
                    <Bar yAxisId="right" dataKey="orders" fill="#00C49F" />
                    {compareMode && (
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#FF8042"
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Order Status Breakdown */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Delivered', value: 650, color: '#00C49F' },
                        { name: 'Processing', value: 300, color: '#0088FE' },
                        { name: 'Pending', value: 200, color: '#FFBB28' },
                        { name: 'Cancelled', value: 100, color: '#FF8042' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Delivered', value: 650, color: '#00C49F' },
                        { name: 'Processing', value: 300, color: '#0088FE' },
                        { name: 'Pending', value: 200, color: '#FFBB28' },
                        { name: 'Cancelled', value: 100, color: '#FF8042' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Conversion Funnel */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Conversion Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'conversionRate' ? fPercent(Number(value)) : fNumber(Number(value)),
                        name === 'conversionRate' ? 'Conversion Rate' : 'Avg Order Value'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="conversionRate" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgOrderValue" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Top Products */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Performing Products
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockProductData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? fCurrency(Number(value)) : fNumber(Number(value)),
                        name === 'revenue' ? 'Revenue' : 'Sales'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#0088FE" />
                    <Bar dataKey="revenue" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Product Performance Matrix */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Product Performance Matrix
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="sales" name="Sales" />
                    <YAxis type="number" dataKey="margin" name="Margin %" />
                    <ZAxis type="number" dataKey="revenue" range={[50, 400]} />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Products" data={mockProductData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Inventory Alerts */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Inventory Status
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`${mockMetrics.products.outOfStock} Out of Stock`} color="error" />
                    <Chip label={`${mockMetrics.products.lowStock} Low Stock`} color="warning" />
                  </Stack>
                </Stack>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {mockMetrics.products.outOfStock + mockMetrics.products.lowStock} products need attention
                </Alert>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockProductData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <RechartsTooltip />
                    <Bar 
                      dataKey="inventory" 
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Customers Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Customer Segments */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Segments
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCustomerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ segment, percentage }) => `${segment} ${percentage}%`}
                    >
                      {mockCustomerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Customer Value */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Lifetime Value
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockCustomerSegments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value) => [fCurrency(Number(value)), 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Customer Acquisition */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Acquisition Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stackId="1" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Advanced Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {/* Predictive Analytics */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Forecast
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[...timeSeriesData, ...Array.from({ length: 7 }, (_, i) => ({
                    date: format(addDays(new Date(), i + 1), 'MMM dd'),
                    revenue: Math.floor(3000 + Math.sin(((30 + i) / 37) * Math.PI * 2) * 1000),
                    forecast: true
                  }))]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Performance Indicators */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Performance Indicators
                </Typography>
                <Stack spacing={3}>
                  {[
                    { label: 'Revenue Growth Rate', value: 15.3, target: 20, color: 'success' },
                    { label: 'Customer Acquisition Cost', value: 45, target: 40, color: 'warning' },
                    { label: 'Customer Lifetime Value', value: 350, target: 400, color: 'info' },
                    { label: 'Inventory Turnover', value: 6.2, target: 8, color: 'primary' }
                  ].map((kpi) => (
                    <Box key={kpi.label}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2">{kpi.label}</Typography>
                        <Typography variant="body2" color={`${kpi.color}.main`}>
                          {kpi.value} / {kpi.target}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((kpi.value / kpi.target) * 100, 100)}
                        color={kpi.color as any}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Business Health Score */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Business Health Dashboard
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { title: 'Financial Health', score: 85, color: 'success', icon: 'eva:dollar-sign-outline' },
                    { title: 'Operational Efficiency', score: 72, color: 'warning', icon: 'eva:settings-2-outline' },
                    { title: 'Customer Satisfaction', score: 91, color: 'success', icon: 'eva:heart-outline' },
                    { title: 'Market Position', score: 68, color: 'info', icon: 'eva:trending-up-outline' }
                  ].map((metric) => (
                    <Grid item xs={12} sm={6} md={3} key={metric.title}>
                      <Box textAlign="center">
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: `${metric.color}.lighter`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                          }}
                        >
                          <Iconify icon={metric.icon} width={40} height={40} color={`${metric.color}.main`} />
                        </Box>
                        <Typography variant="h4" color={`${metric.color}.main`} gutterBottom>
                          {metric.score}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {metric.title}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Analytics Report</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportFormat}
                label="Export Format"
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF Report</MenuItem>
                <MenuItem value="csv">CSV Data</MenuItem>
                <MenuItem value="xlsx">Excel Spreadsheet</MenuItem>
                <MenuItem value="json">JSON Data</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={exportRange}
                label="Date Range"
                onChange={(e) => setExportRange(e.target.value)}
              >
                <MenuItem value="current">Current View</MenuItem>
                <MenuItem value="last7days">Last 7 Days</MenuItem>
                <MenuItem value="last30days">Last 30 Days</MenuItem>
                <MenuItem value="last90days">Last 90 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>

            {exportRange === 'custom' && (
              <Stack direction="row" spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(newValue) => newValue && setDateRange(prev => ({ ...prev, startDate: newValue }))}
                  />
                  <DatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(newValue) => newValue && setDateRange(prev => ({ ...prev, endDate: newValue }))}
                  />
                </LocalizationProvider>
              </Stack>
            )}

            <Alert severity="info">
              The report will include all metrics, charts, and data from the selected period.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} /> : <Iconify icon="eva:download-fill" />}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
