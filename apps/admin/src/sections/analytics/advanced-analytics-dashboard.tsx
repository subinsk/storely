import React, { useState } from 'react';
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
  Chip
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
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { fCurrency, fNumber } from '@storely/shared/utils/format-number';
import {Iconify} from '@storely/shared/components';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    data: Array<{ date: string; revenue: number; orders: number }>;
  };
  orders: {
    total: number;
    growth: number;
    breakdown: Array<{ status: string; count: number; color: string }>;
  };
  products: {
    topSelling: Array<{ 
      name: string; 
      sales: number; 
      revenue: number; 
      growth: number;
    }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const mockData: AnalyticsData = {
  revenue: {
    total: 125000,
    growth: 15.3,
    data: Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), 'MMM dd'),
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 50) + 10
    }))
  },
  orders: {
    total: 1250,
    growth: 8.2,
    breakdown: [
      { status: 'Delivered', count: 650, color: '#00C49F' },
      { status: 'Processing', count: 300, color: '#0088FE' },
      { status: 'Pending', count: 200, color: '#FFBB28' },
      { status: 'Cancelled', count: 100, color: '#FF8042' }
    ]
  },
  products: {
    topSelling: [
      { name: 'Modern Sofa Set', sales: 145, revenue: 72500, growth: 12.5 },
      { name: 'Dining Table Oak', sales: 98, revenue: 49000, growth: 8.3 },
      { name: 'Office Chair Pro', sales: 87, revenue: 26100, growth: -2.1 },
      { name: 'Bedroom Set Deluxe', sales: 65, revenue: 97500, growth: 18.7 },
      { name: 'Coffee Table Glass', sales: 54, revenue: 16200, growth: 5.4 }
    ]
  },
  customers: {
    total: 2340,
    new: 156,
    returning: 89
  }
};

interface AdvancedAnalyticsDashboardProps {
  data?: AnalyticsData;
}

export default function AdvancedAnalyticsDashboard({ 
  data = mockData 
}: AdvancedAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState<string>('30d');
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const formatTooltipValue = (value: any, name: string) => {
    if (name === 'revenue') {
      return [fCurrency(value), 'Revenue'];
    }
    return [fNumber(value), name];
  };

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon, 
    color = 'primary' 
  }: {
    title: string;
    value: string | number;
    growth?: number;
    icon: string;
    color?: string;
  }) => (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" component="div" color={`${color}.main`}>
              {typeof value === 'number' ? fNumber(value) : value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {growth !== undefined && (
              <Chip
                size="small"
                label={`${growth > 0 ? '+' : ''}${growth}%`}
                color={growth > 0 ? 'success' : growth < 0 ? 'error' : 'default'}
                variant="outlined"
              />
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.lighter`,
              color: `${color}.main`
            }}
          >
            <Iconify icon={icon} width={24} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4">Analytics Dashboard</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select value={dateRange} label="Period" onChange={(e) => setDateRange(e.target.value)}>
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
            {dateRange === 'custom' && (
              <>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { size: 'small' } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </>
            )}
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:download-line" />}
            >
              Export
            </Button>
          </Stack>
        </Stack>

        {/* Key Metrics */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={fCurrency(data.revenue.total)}
              growth={data.revenue.growth}
              icon="mingcute:currency-dollar-line"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={data.orders.total}
              growth={data.orders.growth}
              icon="mingcute:shopping-bag-line"
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value={data.customers.total}
              icon="mingcute:user-line"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="New Customers"
              value={data.customers.new}
              icon="mingcute:user-add-line"
              color="secondary"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Revenue Trend */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue & Orders Trend
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenue.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={formatTooltipValue} />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                        name="Revenue"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        name="Orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Status Distribution */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Status Distribution
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.orders.breakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, count }) => `${status}: ${count}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.orders.breakdown.map((entry, index) => (
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

          {/* Top Selling Products */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Selling Products
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.products.topSelling}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={formatTooltipValue} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="sales"
                        fill="#8884d8"
                        name="Units Sold"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="revenue"
                        fill="#82ca9d"
                        name="Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}
