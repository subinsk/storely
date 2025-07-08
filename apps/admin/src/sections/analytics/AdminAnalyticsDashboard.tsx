import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  Analytics,
  FilterList,
  FileDownload,
  Refresh,
  ExpandMore,
  Warning,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material';
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
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Types
interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  newCustomers: number;
  returningCustomers: number;
  abandonedCarts: number;
  refundRate: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    image: string;
  }>;
  topCategories: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    conversions: number;
    revenue: number;
  }>;
  geographicData: Array<{
    country: string;
    orders: number;
    revenue: number;
  }>;
  performanceMetrics: {
    pageLoadTime: number;
    errorRate: number;
    uptime: number;
    apiResponseTime: number;
  };
  emailMetrics: {
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
  inventoryAlerts: Array<{
    productId: string;
    productName: string;
    currentStock: number;
    reorderLevel: number;
    status: 'low' | 'out_of_stock' | 'overstocked';
  }>;
  orderStatusBreakdown: Array<{
    status: string;
    count: number;
    color: string;
  }>;
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
      id={`admin-analytics-tabpanel-${index}`}
      aria-labelledby={`admin-analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [timeframe, setTimeframe] = useState('30d');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [metricsData, setMetricsData] = useState<AdminMetrics | null>(null);

  // Mock data - in production, this would come from your analytics API
  const mockData: AdminMetrics = {
    totalRevenue: 1250000,
    totalOrders: 8450,
    totalProducts: 1250,
    totalCustomers: 3200,
    conversionRate: 3.8,
    averageOrderValue: 147.93,
    newCustomers: 580,
    returningCustomers: 2620,
    abandonedCarts: 1200,
    refundRate: 2.1,
    topSellingProducts: [
      { id: '1', name: 'Modern Sofa Set', sales: 145, revenue: 72500, image: '/products/sofa.jpg' },
      { id: '2', name: 'Dining Table', sales: 98, revenue: 49000, image: '/products/table.jpg' },
      { id: '3', name: 'Office Chair', sales: 87, revenue: 26100, image: '/products/chair.jpg' },
      { id: '4', name: 'Bedroom Set', sales: 65, revenue: 97500, image: '/products/bedroom.jpg' },
      { id: '5', name: 'Coffee Table', sales: 54, revenue: 16200, image: '/products/coffee-table.jpg' },
    ],
    topCategories: [
      { name: 'Living Room', sales: 350, revenue: 175000 },
      { name: 'Bedroom', sales: 280, revenue: 140000 },
      { name: 'Office', sales: 220, revenue: 110000 },
      { name: 'Dining', sales: 180, revenue: 90000 },
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: 12500, conversions: 475, revenue: 71250 },
      { source: 'Direct', visitors: 8200, conversions: 340, revenue: 51000 },
      { source: 'Social Media', visitors: 6800, conversions: 204, revenue: 30600 },
      { source: 'Email', visitors: 4200, conversions: 168, revenue: 25200 },
      { source: 'Paid Ads', visitors: 3500, conversions: 140, revenue: 21000 },
    ],
    geographicData: [
      { country: 'United States', orders: 3200, revenue: 480000 },
      { country: 'Canada', orders: 850, revenue: 127500 },
      { country: 'United Kingdom', orders: 650, revenue: 97500 },
      { country: 'Germany', orders: 480, revenue: 72000 },
      { country: 'France', orders: 420, revenue: 63000 },
    ],
    performanceMetrics: {
      pageLoadTime: 1.24,
      errorRate: 0.05,
      uptime: 99.9,
      apiResponseTime: 145,
    },
    emailMetrics: {
      sent: 45000,
      opened: 22500,
      clicked: 4500,
      unsubscribed: 125,
    },
    inventoryAlerts: [
      { productId: '1', productName: 'Modern Sofa Set', currentStock: 5, reorderLevel: 10, status: 'low' },
      { productId: '2', productName: 'Dining Chair', currentStock: 0, reorderLevel: 20, status: 'out_of_stock' },
      { productId: '3', productName: 'Office Desk', currentStock: 15, reorderLevel: 5, status: 'overstocked' },
    ],
    orderStatusBreakdown: [
      { status: 'Pending', count: 245, color: '#FFA726' },
      { status: 'Processing', count: 180, color: '#42A5F5' },
      { status: 'Shipped', count: 320, color: '#AB47BC' },
      { status: 'Delivered', count: 1200, color: '#66BB6A' },
      { status: 'Cancelled', count: 85, color: '#EF5350' },
    ],
  };

  const generateTimeSeriesData = (days: number = 30) => {
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const baseRevenue = 15000 + Math.sin((i / days) * Math.PI * 2) * 5000;
      const baseOrders = 120 + Math.sin((i / days) * Math.PI * 2) * 40;
      const baseVisitors = 2000 + Math.sin((i / days) * Math.PI * 2) * 500;
      
      return {
        date: format(date, 'MMM dd'),
        revenue: Math.floor(baseRevenue + (Math.random() - 0.5) * 2000),
        orders: Math.floor(baseOrders + (Math.random() - 0.5) * 20),
        visitors: Math.floor(baseVisitors + (Math.random() - 0.5) * 200),
        conversions: Math.floor((baseOrders / baseVisitors) * 100),
      };
    });
  };

  const timeSeriesData = generateTimeSeriesData();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setMetricsData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleExport = () => {
    // Simulate export
    const data = {
      metrics: metricsData,
      timeSeriesData,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExportDialogOpen(false);
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'primary', format = 'number' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {format === 'currency' ? `$${value.toLocaleString()}` : 
               format === 'percentage' ? `${value}%` : 
               value.toLocaleString()}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              {change > 0 ? (
                <TrendingUp color="success" fontSize="small" />
              ) : (
                <TrendingDown color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={change > 0 ? 'success.main' : 'error.main'}
              >
                {change > 0 ? '+' : ''}{change}% vs last period
              </Typography>
            </Stack>
          </Box>
          <Icon sx={{ fontSize: 40, color: `${color}.main` }} />
        </Stack>
      </CardContent>
    </Card>
  );

  const AlertCard = ({ alert }) => (
    <Card sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            {alert.status === 'low' && <Warning color="warning" />}
            {alert.status === 'out_of_stock' && <Error color="error" />}
            {alert.status === 'overstocked' && <Info color="info" />}
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {alert.productName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Stock: {alert.currentStock} | Reorder Level: {alert.reorderLevel}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={alert.status.replace('_', ' ')}
            color={
              alert.status === 'low' ? 'warning' :
              alert.status === 'out_of_stock' ? 'error' : 'info'
            }
            size="small"
          />
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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
            Admin Analytics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive business insights and performance metrics
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small">
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>

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

          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ p: 1 }}
          >
            <Refresh />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={() => setExportDialogOpen(true)}
          >
            Export
          </Button>
        </Stack>
      </Stack>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={metricsData?.totalRevenue || 0}
            change={15.3}
            icon={AttachMoney}
            color="success"
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={metricsData?.totalOrders || 0}
            change={8.2}
            icon={ShoppingCart}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Customers"
            value={metricsData?.totalCustomers || 0}
            change={12.5}
            icon={People}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={metricsData?.conversionRate || 0}
            change={-2.1}
            icon={Analytics}
            color="warning"
            format="percentage"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="admin analytics tabs"
          >
            <Tab label="📊 Overview" />
            <Tab label="🛒 Sales" />
            <Tab label="👥 Customers" />
            <Tab label="📦 Inventory" />
            <Tab label="📈 Performance" />
            <Tab label="✉️ Marketing" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Revenue & Orders Chart */}
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
                    <RechartsTooltip />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      fill="#1976d2" 
                      fillOpacity={0.3}
                      stroke="#1976d2"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#f57c00" 
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={2}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Average Order Value
                      </Typography>
                      <Typography variant="h6">
                        ${metricsData?.averageOrderValue.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        New vs Returning Customers
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={`New: ${metricsData?.newCustomers}`} 
                          color="primary" 
                          size="small"
                        />
                        <Chip 
                          label={`Returning: ${metricsData?.returningCustomers}`} 
                          color="secondary" 
                          size="small"
                        />
                      </Stack>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Abandoned Carts
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        {metricsData?.abandonedCarts}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Status
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={metricsData?.orderStatusBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                      >
                        {metricsData?.orderStatusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Sales Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Top Selling Products */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Selling Products
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Sales</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metricsData?.topSellingProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Box
                                component="img"
                                src={product.image}
                                alt={product.name}
                                sx={{ width: 40, height: 40, borderRadius: 1 }}
                              />
                              <Typography variant="body2">
                                {product.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">{product.sales}</TableCell>
                          <TableCell align="right">${product.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>

            {/* Top Categories */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Categories
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData?.topCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="revenue" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Geographic Data */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Geographic Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData?.geographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="revenue" fill="#f57c00" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Customers Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Customer Acquisition */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Acquisition
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Traffic Sources */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Traffic Sources
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Source</TableCell>
                        <TableCell align="right">Visitors</TableCell>
                        <TableCell align="right">Conversions</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metricsData?.trafficSources.map((source) => (
                        <TableRow key={source.source}>
                          <TableCell>{source.source}</TableCell>
                          <TableCell align="right">{source.visitors.toLocaleString()}</TableCell>
                          <TableCell align="right">{source.conversions}</TableCell>
                          <TableCell align="right">${source.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Inventory Performance
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={metricsData?.topSellingProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="sales" fill="#42a5f5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Inventory Alerts
                </Typography>
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {metricsData?.inventoryAlerts.map((alert) => (
                    <AlertCard key={alert.productId} alert={alert} />
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  System Performance
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Page Load Time
                    </Typography>
                    <Typography variant="h4">
                      {metricsData?.performanceMetrics.pageLoadTime}s
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Error Rate
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {metricsData?.performanceMetrics.errorRate}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={5}
                      color="error"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Uptime
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {metricsData?.performanceMetrics.uptime}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={99.9}
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  API Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Marketing Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Email Marketing Performance
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {metricsData?.emailMetrics.sent.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Emails Sent
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {((metricsData?.emailMetrics.opened / metricsData?.emailMetrics.sent) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Open Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {((metricsData?.emailMetrics.clicked / metricsData?.emailMetrics.sent) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main">
                        {((metricsData?.emailMetrics.unsubscribed / metricsData?.emailMetrics.sent) * 100).toFixed(2)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unsubscribe Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Campaign Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData?.trafficSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="conversions" fill="#ab47bc" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Analytics Data</DialogTitle>
        <DialogContent>
          <Typography>
            Export comprehensive analytics data including all metrics, charts, and performance data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">
            Export JSON
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
