import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, subDays, addDays } from 'date-fns';

// Types
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

interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
  avgOrderValue: number;
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

export default function AdvancedAnalyticsDashboard() {
  // Mock user for now - will be replaced with proper auth
  const user = { id: '1', name: 'Demo User', email: 'demo@storely.com' };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [compareMode, setCompareMode] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - in production, this would come from the analytics service
  const mockMetrics: AnalyticsMetrics = {
    revenue: {
      total: 125000,
      growth: 15.3,
      target: 150000,
      forecast: 145000,
    },
    orders: {
      total: 1250,
      growth: 8.2,
      avgValue: 100,
      conversionRate: 2.5,
    },
    customers: {
      total: 850,
      new: 125,
      returning: 725,
      churnRate: 5.2,
    },
    products: {
      totalSKUs: 450,
      outOfStock: 12,
      lowStock: 35,
      topPerforming: 25,
    },
  };

  const generateTimeSeriesData = (days: number = 30): TimeSeriesData[] => {
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const baseRevenue = 3000 + Math.sin((i / days) * Math.PI * 2) * 1000;
      return {
        date: format(date, 'MMM dd'),
        revenue: Math.floor(baseRevenue + (Math.random() - 0.5) * 500),
        orders: Math.floor((baseRevenue / 50) + (Math.random() - 0.5) * 10),
        visitors: Math.floor((baseRevenue / 10) + (Math.random() - 0.5) * 50),
        conversionRate: Number(((Math.random() * 0.05) + 0.02).toFixed(3)),
        avgOrderValue: Math.floor(baseRevenue / ((baseRevenue / 50) + (Math.random() - 0.5) * 10)),
      };
    });
  };

  const timeSeriesData = generateTimeSeriesData();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = {
        metrics: mockMetrics,
        timeSeries: timeSeriesData,
        generatedAt: new Date().toISOString(),
        dateRange: {
          start: format(dateRange.startDate, 'yyyy-MM-dd'),
          end: format(dateRange.endDate, 'yyyy-MM-dd'),
        },
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
  };

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
                icon={<span>📈</span>}
                label={`${growth >= 0 ? '+' : ''}${growth}%`}
                color={growth >= 0 ? 'success' : 'error'}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                vs last month
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
              fontSize: '1.5rem',
            }}
          >
            {icon}
          </Box>
        </Stack>
        {target && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Target Progress
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
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
            Advanced Analytics
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
            startIcon={<span>📊</span>}
          >
            Compare
          </Button>

          <Button
            variant="contained"
            startIcon={<span>📥</span>}
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
            value={`$${mockMetrics.revenue.total.toLocaleString()}`}
            growth={mockMetrics.revenue.growth}
            target={`$${mockMetrics.revenue.target.toLocaleString()}`}
            icon="💰"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={mockMetrics.orders.total.toLocaleString()}
            growth={mockMetrics.orders.growth}
            icon="📦"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Customers"
            value={mockMetrics.customers.total.toLocaleString()}
            growth={((mockMetrics.customers.new - mockMetrics.customers.returning) / mockMetrics.customers.total * 100)}
            icon="👥"
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversion Rate"
            value={`${mockMetrics.orders.conversionRate}%`}
            growth={12.3}
            icon="📈"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="📊 Overview" />
            <Tab label="📦 Products" />
            <Tab label="👥 Customers" />
            <Tab label="🔮 Advanced" />
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
                    <RechartsTooltip />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      fill="#0088FE" 
                      fillOpacity={0.6}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#00C49F" 
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Order Status */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Delivered', value: 650, color: '#00C49F' },
                        { name: 'Processing', value: 300, color: '#0088FE' },
                        { name: 'Pending', value: 200, color: '#FFBB28' },
                        { name: 'Cancelled', value: 100, color: '#FF8042' },
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
                        { name: 'Cancelled', value: 100, color: '#FF8042' },
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
                  Conversion Funnel
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { step: 'Visitors', count: 12500, color: '#0088FE' },
                    { step: 'Product Views', count: 8200, color: '#00C49F' },
                    { step: 'Cart Adds', count: 3400, color: '#FFBB28' },
                    { step: 'Checkouts', count: 1800, color: '#FF8042' },
                    { step: 'Orders', count: 1250, color: '#8884D8' },
                  ].map((item, index) => (
                    <Grid item xs={12} md={2.4} key={index}>
                      <Box textAlign="center">
                        <Typography variant="h4" sx={{ color: item.color }}>
                          {item.count.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.step}
                        </Typography>
                        {index > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {((item.count / 12500) * 100).toFixed(1)}% conversion
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Product Performance */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Product Performance
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={[
                    { name: 'Modern Sofa', sales: 145, revenue: 72500 },
                    { name: 'Dining Table', sales: 98, revenue: 49000 },
                    { name: 'Office Chair', sales: 87, revenue: 26100 },
                    { name: 'Bedroom Set', sales: 65, revenue: 97500 },
                    { name: 'Coffee Table', sales: 54, revenue: 16200 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#0088FE" />
                    <Bar dataKey="revenue" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Inventory Status */}
            <Grid item xs={12} lg={4}>
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
                  <BarChart data={[
                    { name: 'Modern Sofa', inventory: 25 },
                    { name: 'Dining Table', inventory: 15 },
                    { name: 'Office Chair', inventory: 8 },
                    { name: 'Bedroom Set', inventory: 3 },
                    { name: 'Coffee Table', inventory: 0 },
                  ]} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <RechartsTooltip />
                    <Bar dataKey="inventory" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Customers Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Customer Value */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Lifetime Value
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { segment: 'Premium', count: 125, revenue: 65000 },
                    { segment: 'Regular', count: 450, revenue: 35000 },
                    { segment: 'New', count: 275, revenue: 15000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="revenue" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Customer Acquisition */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Acquisition Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#0088FE" />
                  </LineChart>
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
                    forecast: true,
                  }))]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Score
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { title: 'Financial Health', score: 85, color: 'success', icon: '💰' },
                    { title: 'Operational Efficiency', score: 72, color: 'warning', icon: '⚙️' },
                    { title: 'Customer Satisfaction', score: 91, color: 'success', icon: '❤️' },
                    { title: 'Market Position', score: 68, color: 'info', icon: '📈' },
                  ].map((metric) => (
                    <Grid item xs={12} sm={6} md={6} key={metric.title}>
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
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" fontSize="2rem">
                            {metric.icon}
                          </Typography>
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
            startIcon={isExporting ? <CircularProgress size={20} /> : <span>📥</span>}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
