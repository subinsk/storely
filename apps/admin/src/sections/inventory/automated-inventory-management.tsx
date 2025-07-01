"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import { fNumber, fCurrency } from '@/utils/format-number';
import Iconify from '@/components/iconify';

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  maxStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  price: number;
  category: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastRestocked: string;
  avgDailySales: number;
  daysOfInventory: number;
  images: string[];
}

interface InventoryRule {
  id: string;
  name: string;
  type: 'reorder' | 'alert' | 'discount' | 'bundle';
  condition: string;
  action: string;
  isActive: boolean;
  lastTriggered?: string;
}

interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'reorder_needed';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  acknowledged: boolean;
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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function getSeverityColor(severity: string): 'error' | 'info' | 'success' | 'warning' {
  const severityMap = {
    low: 'info' as const,
    medium: 'warning' as const,
    high: 'error' as const,
    critical: 'error' as const
  };
  return severityMap[severity as keyof typeof severityMap] || 'info';
}

function getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  const statusMap = {
    in_stock: 'success' as const,
    low_stock: 'warning' as const,
    out_of_stock: 'error' as const,
    overstock: 'info' as const
  };
  return statusMap[status as keyof typeof statusMap] || 'default';
}

export default function AutomatedInventoryManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [rules, setRules] = useState<InventoryRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Ergonomic Office Chair',
          sku: 'CHAIR-001',
          currentStock: 25,
          lowStockThreshold: 10,
          maxStockLevel: 100,
          reorderPoint: 15,
          reorderQuantity: 50,
          price: 299.99,
          category: 'Office Furniture',
          status: 'in_stock',
          lastRestocked: '2025-06-15',
          avgDailySales: 2.5,
          daysOfInventory: 10,
          images: ['/assets/images/chair.jpg']
        },
        {
          id: '2',
          name: 'Standing Desk',
          sku: 'DESK-002',
          currentStock: 5,
          lowStockThreshold: 8,
          maxStockLevel: 50,
          reorderPoint: 12,
          reorderQuantity: 25,
          price: 599.99,
          category: 'Office Furniture',
          status: 'low_stock',
          lastRestocked: '2025-06-10',
          avgDailySales: 1.8,
          daysOfInventory: 2.7,
          images: ['/assets/images/desk.jpg']
        }
      ];

      const mockAlerts: InventoryAlert[] = [
        {
          id: '1',
          type: 'low_stock',
          productId: '2',
          productName: 'Standing Desk',
          message: 'Stock level is below threshold (5/8)',
          severity: 'high',
          createdAt: '2025-06-30T10:30:00Z',
          acknowledged: false
        }
      ];

      const mockRules: InventoryRule[] = [
        {
          id: '1',
          name: 'Auto Reorder Rule',
          type: 'reorder',
          condition: 'Stock <= Reorder Point',
          action: 'Create purchase order for reorder quantity',
          isActive: true,
          lastTriggered: '2025-06-28T14:00:00Z'
        },
        {
          id: '2',
          name: 'Low Stock Alert',
          type: 'alert',
          condition: 'Stock <= Low Stock Threshold',
          action: 'Send email notification to inventory manager',
          isActive: true
        }
      ];

      setProducts(mockProducts);
      setAlerts(mockAlerts);
      setRules(mockRules);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleToggleRule = async (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const generateInventoryReport = () => {
    // Generate inventory analytics report
    const stockData = products.map(product => ({
      name: product.name.length > 15 ? `${product.name.substring(0, 15)}...` : product.name,
      current: product.currentStock,
      threshold: product.lowStockThreshold,
      max: product.maxStockLevel
    }));

    return stockData;
  };

  const getInventoryMetrics = () => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
    const avgDaysOfInventory = products.reduce((sum, p) => sum + p.daysOfInventory, 0) / products.length;

    return {
      totalProducts,
      lowStockProducts,
      totalValue,
      avgDaysOfInventory: Math.round(avgDaysOfInventory * 10) / 10
    };
  };

  const metrics = getInventoryMetrics();
  const stockData = generateInventoryReport();

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading inventory management...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Automated Inventory Management
          </Typography>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={automationEnabled}
                  onChange={(e) => setAutomationEnabled(e.target.checked)}
                />
              }
              label="Automation Enabled"
            />
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-outline" />}
              onClick={() => setRuleDialogOpen(true)}
            >
              Add Rule
            </Button>
          </Stack>
        </Stack>

        {/* Alerts Banner */}
        {alerts.filter(a => !a.acknowledged).length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Inventory Alerts ({alerts.filter(a => !a.acknowledged).length})
            </Typography>
            <Stack spacing={1}>
              {alerts.filter(a => !a.acknowledged).slice(0, 3).map(alert => (
                <Stack key={alert.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {alert.productName}: {alert.message}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Alert>
        )}
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:cube-outline" width={24} height={24} color="primary.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(metrics.totalProducts)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'warning.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:alert-triangle-outline" width={24} height={24} color="warning.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fNumber(metrics.lowStockProducts)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:dollar-sign-outline" width={24} height={24} color="success.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {fCurrency(metrics.totalValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inventory Value
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'info.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Iconify icon="eva:clock-outline" width={24} height={24} color="info.main" />
                </Box>
                <Box>
                  <Typography variant="h3" component="div">
                    {metrics.avgDaysOfInventory}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Days of Inventory
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:layers-outline" />
                  <span>Stock Overview</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Badge badgeContent={alerts.filter(a => !a.acknowledged).length} color="error">
                    <Iconify icon="eva:alert-circle-outline" />
                  </Badge>
                  <span>Alerts</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:settings-outline" />
                  <span>Automation Rules</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="eva:bar-chart-outline" />
                  <span>Analytics</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Stock Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Stock Levels
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Days of Inventory</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={product.images[0] || '/assets/placeholder.svg'}
                            alt={product.name}
                            sx={{ width: 40, height: 40, borderRadius: 1 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.category}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{product.sku}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2">
                            {fNumber(product.currentStock)}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(product.currentStock / product.maxStockLevel) * 100}
                            sx={{ width: 80, height: 4 }}
                            color={
                              product.currentStock <= product.lowStockThreshold 
                                ? 'error' 
                                : product.currentStock >= product.maxStockLevel * 0.8 
                                ? 'warning' 
                                : 'primary'
                            }
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(product.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.daysOfInventory} days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {fCurrency(product.currentStock * product.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Adjust Stock">
                            <IconButton size="small">
                              <Iconify icon="eva:edit-outline" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reorder">
                            <IconButton size="small">
                              <Iconify icon="eva:shopping-cart-outline" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        {/* Alerts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory Alerts
            </Typography>
            <Stack spacing={2}>
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  severity={getSeverityColor(alert.severity)}
                  variant={alert.acknowledged ? "outlined" : "filled"}
                  action={
                    !alert.acknowledged && (
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )
                  }
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {alert.type.replace('_', ' ').toUpperCase()} - {alert.productName}
                  </Typography>
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Box>
        </TabPanel>

        {/* Automation Rules Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Automation Rules
            </Typography>
            <Stack spacing={2}>
              {rules.map((rule) => (
                <Accordion key={rule.id}>
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-outline" />}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mr: 1 }}>
                      <Box>
                        <Typography variant="subtitle1">{rule.name}</Typography>
                        <Chip
                          label={rule.type.toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Switch
                        checked={rule.isActive}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleToggleRule(rule.id)}
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Condition
                        </Typography>
                        <Typography variant="body1">
                          {rule.condition}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Action
                        </Typography>
                        <Typography variant="body1">
                          {rule.action}
                        </Typography>
                      </Grid>
                      {rule.lastTriggered && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Last Triggered: {format(new Date(rule.lastTriggered), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Stock Levels vs Thresholds
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="current" fill="#1890ff" name="Current Stock" />
                        <Bar dataKey="threshold" fill="#ff7875" name="Low Stock Threshold" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Stock Status Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'In Stock', value: products.filter(p => p.status === 'in_stock').length, fill: '#52c41a' },
                            { name: 'Low Stock', value: products.filter(p => p.status === 'low_stock').length, fill: '#fa8c16' },
                            { name: 'Out of Stock', value: products.filter(p => p.status === 'out_of_stock').length, fill: '#ff4d4f' },
                            { name: 'Overstock', value: products.filter(p => p.status === 'overstock').length, fill: '#1890ff' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label
                        />
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
}
