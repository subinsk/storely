'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
  LocalShipping,
  Analytics,
  Store,
  Warning,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useSnackbar } from 'notistack';
import { getOrderAnalytics } from '@/services/order.service';
import { productService } from '@/services/product.service';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'customer';
  title: string;
  description: string;
  timestamp: Date;
  value?: string;
}

const ComprehensiveDashboard: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0
  });

  const [chartData, setChartData] = useState<{
    revenue: Array<{ name: string; revenue: number; orders: number }>;
    orders: Array<{ name: string; revenue: number; orders: number }>;
    products: any[];
    orderStatus: any[];
    topProducts: any[];
  }>({
    revenue: [],
    orders: [],
    products: [],
    orderStatus: [],
    topProducts: []
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadChartData(),
        loadRecentActivity(),
        loadLowStockProducts()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));

      const [orderAnalytics, productAnalytics] = await Promise.all([
        getOrderAnalytics({
          start: startDate,
          end: endDate
        }),
        productService.getAnalytics(
          startDate.toISOString(),
          endDate.toISOString()
        )
      ]);

      setDashboardStats({
        totalRevenue: orderAnalytics?.totalRevenue || 0,
        totalOrders: orderAnalytics?.totalOrders || 0,
        totalProducts: productAnalytics?.overview?.totalProducts || 0,
        totalCustomers: orderAnalytics?.uniqueCustomers || 0,
        revenueChange: orderAnalytics?.revenueChange || 0,
        ordersChange: orderAnalytics?.ordersChange || 0,
        productsChange: 5.2, // Mock data
        customersChange: orderAnalytics?.customersChange || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadChartData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange.replace('d', '')));

      const orderAnalytics = await getOrderAnalytics({
        start: startDate,
        end: endDate
      });

      // Mock chart data - in real app, this would come from analytics
      const mockRevenueData = Array.from({ length: 7 }, (_, i) => ({
        name: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10
      }));

      setChartData({
        revenue: mockRevenueData,
        orders: mockRevenueData,
        products: [],
        orderStatus: orderAnalytics?.ordersByStatus || [],
        topProducts: orderAnalytics?.topProducts || []
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // Mock recent activity data
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'order',
          title: 'New Order #1234',
          description: 'Order placed by John Doe',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          value: '$299.99'
        },
        {
          id: '2',
          type: 'product',
          title: 'Product Updated',
          description: 'Vintage Chair inventory updated',
          timestamp: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'customer',
          title: 'New Customer',
          description: 'Jane Smith registered',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '4',
          type: 'order',
          title: 'Order Shipped',
          description: 'Order #1233 shipped to customer',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        }
      ];

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const loadLowStockProducts = async () => {
    try {
      const productAnalytics = await productService.getAnalytics();
      
      // Mock low stock products
      const lowStock = [
        { id: '1', name: 'Vintage Chair', currentStock: 5, minStock: 10 },
        { id: '2', name: 'Modern Table', currentStock: 2, minStock: 5 },
        { id: '3', name: 'Office Desk', currentStock: 1, minStock: 3 }
      ];

      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    enqueueSnackbar('Dashboard refreshed', { variant: 'success' });
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {change > 0 ? (
                <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: change > 0 ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                {Math.abs(change)}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                vs last period
              </Typography>
            </Box>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart />;
      case 'product':
        return <Inventory />;
      case 'customer':
        return <People />;
      default:
        return <Analytics />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'primary.main';
      case 'product':
        return 'secondary.main';
      case 'customer':
        return 'success.main';
      default:
        return 'info.main';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 3 months</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${dashboardStats.totalRevenue.toFixed(2)}`}
            change={dashboardStats.revenueChange}
            icon={<AttachMoney />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={dashboardStats.totalOrders}
            change={dashboardStats.ordersChange}
            icon={<ShoppingCart />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={dashboardStats.totalProducts}
            change={dashboardStats.productsChange}
            icon={<Inventory />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={dashboardStats.totalCustomers}
            change={dashboardStats.customersChange}
            icon={<People />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Order Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.orderStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.orderStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity and Alerts */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {activity.description}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {activity.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                  />
                  {activity.value && (
                    <Typography variant="body2" fontWeight="bold">
                      {activity.value}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6">
                Low Stock Alerts
              </Typography>
            </Box>
            {lowStockProducts.length > 0 ? (
              <List>
                {lowStockProducts.map((product) => (
                  <ListItem key={product.id}>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Current Stock: {product.currentStock} / Min: {product.minStock}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(product.currentStock / product.minStock) * 100}
                            color={product.currentStock <= product.minStock ? 'error' : 'warning'}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                    <Chip
                      label={`${product.currentStock} left`}
                      color={product.currentStock <= product.minStock ? 'error' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="success">All products are in stock!</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComprehensiveDashboard;
