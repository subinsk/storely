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
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
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
  ComposedChart
} from 'recharts';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { fCurrency, fNumber, fPercent } from '@storely/shared/utils/format-number';
import { Iconify } from '@storely/shared/components/iconify';
import { useAdvancedReports } from '@/hooks/useReports';

interface ReportTemplate {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'customer' | 'financial' | 'custom';
  description: string;
  metrics: string[];
  charts: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  isActive: boolean;
  lastGenerated?: string;
  nextScheduled?: string;
}

interface ScheduledReport {
  id: string;
  templateId: string;
  templateName: string;
  schedule: string;
  recipients: string[];
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
  status: 'active' | 'paused' | 'error';
}

interface ReportData {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    conversionRate: number;
    growth: number;
    chartData: Array<{ date: string; revenue: number; orders: number }>;
  };
  inventory: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    inventoryValue: number;
    turnoverRate: number;
    chartData: Array<{ category: string; stock: number; value: number }>;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    averageLifetimeValue: number;
    retentionRate: number;
    chartData: Array<{ month: string; new: number; returning: number }>;
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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdvancedReportsAnalytics() {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('overview');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date()
  });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'orders', 'customers']);

  // Use API hooks
  const { advancedData, advancedLoading, advancedError, refresh } = useAdvancedReports(reportType, {
    startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
    endDate: format(dateRange.endDate, 'yyyy-MM-dd'),
    period: '30'
  });

  const reportData = advancedData || null;
  const loading = advancedLoading;

  // Add missing state for scheduledReports and templates
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  useEffect(() => {
    // Refresh data when date range or report type changes
    refresh();
  }, [dateRange, reportType, refresh]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Update report type based on tab
    const reportTypes = ['overview', 'revenue', 'products', 'customers', 'inventory', 'cohort', 'conversion'];
    setReportType(reportTypes[newValue] || 'overview');
  };

  const handleGenerateReport = async (templateId: string) => {
    try {
      // Simulate report generation
      console.log('Generating report for template:', templateId);
      // In real implementation, this would call an API to generate the report
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleToggleScheduledReport = async (reportId: string) => {
    setScheduledReports(prev =>
      prev.map(report =>
        report.id === reportId 
          ? { ...report, isActive: !report.isActive, status: !report.isActive ? 'paused' : 'active' }
          : report
      )
    );
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulate export functionality
    console.log('Exporting report in format:', format);
  };

  // Add missing loadReportsData function for Update button
  const loadReportsData = () => {
    refresh();
  };

  // Add fallback demo data for templates and scheduledReports if empty
  useEffect(() => {
    if (templates.length === 0) {
      setTemplates([
        {
          id: '1',
          name: 'Monthly Sales',
          type: 'sales',
          description: 'Monthly sales performance overview',
          metrics: ['revenue', 'orders'],
          charts: ['line', 'bar'],
          frequency: 'monthly',
          recipients: ['admin@store.com'],
          isActive: true,
          lastGenerated: new Date().toISOString(),
          nextScheduled: new Date(Date.now() + 86400000).toISOString(),
        },
      ]);
    }
    if (scheduledReports.length === 0) {
      setScheduledReports([
        {
          id: '1',
          templateId: '1',
          templateName: 'Monthly Sales',
          schedule: 'Every 1st of the month',
          recipients: ['admin@store.com'],
          isActive: true,
          lastRun: new Date().toISOString(),
          nextRun: new Date(Date.now() + 86400000).toISOString(),
          status: 'active',
        },
      ]);
    }
  }, [templates.length, scheduledReports.length]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2">Loading reports and analytics...</Typography>
      </Box>
    );
  }

  if (!reportData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load reports data</Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Advanced Reports & Analytics
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:calendar-outline" />}
              >
                Schedule Report
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-outline" />}
                onClick={() => setTemplateDialogOpen(true)}
              >
                Create Template
              </Button>
            </Stack>
          </Stack>

          {/* Date Range Selector */}
          <Card sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date || new Date() }))}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date || new Date() }))}
                slotProps={{ textField: { size: 'small' } }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Metrics</InputLabel>
                <Select
                  multiple
                  value={selectedMetrics}
                  onChange={(e) => setSelectedMetrics(e.target.value as string[])}
                  label="Metrics"
                >
                  <MenuItem value="revenue">Revenue</MenuItem>
                  <MenuItem value="orders">Orders</MenuItem>
                  <MenuItem value="customers">Customers</MenuItem>
                  <MenuItem value="inventory">Inventory</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                onClick={() => loadReportsData()}
              >
                Update
              </Button>
            </Stack>
          </Card>
        </Box>

        {/* Key Metrics Overview */}
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
                      bgcolor: 'success.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Iconify icon="eva:trending-up-outline" width={24} height={24} color="success.main" />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="div">
                      {fCurrency(reportData.sales.totalRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      +{fPercent(reportData.sales.growth)}
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
                      bgcolor: 'primary.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Iconify icon="eva:shopping-bag-outline" width={24} height={24} color="primary.main" />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="div">
                      {fNumber(reportData.sales.totalOrders)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg: {fCurrency(reportData.sales.avgOrderValue)}
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
                    <Iconify icon="eva:people-outline" width={24} height={24} color="info.main" />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="div">
                      {fNumber(reportData.customers.totalCustomers)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Customers
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      +{fNumber(reportData.customers.newCustomers)} new
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
                    <Iconify icon="eva:cube-outline" width={24} height={24} color="warning.main" />
                  </Box>
                  <Box>
                    <Typography variant="h3" component="div">
                      {fCurrency(reportData.inventory.inventoryValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inventory Value
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      {reportData.inventory.lowStockItems} low stock
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:bar-chart-outline" />
                    <span>Analytics Dashboard</span>
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:file-text-outline" />
                    <span>Report Templates</span>
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:clock-outline" />
                    <span>Scheduled Reports</span>
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:download-outline" />
                    <span>Export Center</span>
                  </Stack>
                }
              />
            </Tabs>
          </Box>

          {/* Analytics Dashboard Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Sales Trend Chart */}
                <Grid item xs={12} lg={8}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sales Performance Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={reportData.sales.chartData}>
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
                            fill="#8884d8"
                            stroke="#8884d8"
                            fillOpacity={0.3}
                            name="Revenue ($)"
                          />
                          <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Customer Analytics */}
                <Grid item xs={12} lg={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Customer Growth
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={reportData.customers.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Area
                            type="monotone"
                            dataKey="new"
                            stackId="1"
                            stroke="#8884d8"
                            fill="#8884d8"
                            name="New Customers"
                          />
                          <Area
                            type="monotone"
                            dataKey="returning"
                            stackId="1"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            name="Returning Customers"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Inventory Distribution */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Inventory by Category
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={reportData.inventory.chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ category, stock }) => `${category}: ${stock}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="stock"
                          >
                            {reportData.inventory.chartData.map((entry:any, index:any) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Inventory Value Chart */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Inventory Value by Category
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.inventory.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <RechartsTooltip formatter={(value) => [fCurrency(value as number), 'Value']} />
                          <Bar dataKey="value" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Report Templates Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  Report Templates
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-outline" />}
                  onClick={() => setTemplateDialogOpen(true)}
                >
                  Create Template
                </Button>
              </Stack>

              <Grid container spacing={3}>
                {templates.map((template) => (
                  <Grid item xs={12} md={6} lg={4} key={template.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              {template.name}
                            </Typography>
                            <Chip
                              label={template.type.toUpperCase()}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Switch
                            checked={template.isActive}
                            onChange={() => {/* Handle toggle */}}
                            size="small"
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {template.description}
                        </Typography>

                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Frequency: {template.frequency}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recipients: {template.recipients.length}
                          </Typography>
                          {template.lastGenerated && (
                            <Typography variant="caption" color="text.secondary">
                              Last generated: {format(new Date(template.lastGenerated), 'MMM dd, HH:mm')}
                            </Typography>
                          )}
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleGenerateReport(template.id)}
                          >
                            Generate Now
                          </Button>
                          <IconButton size="small">
                            <Iconify icon="eva:edit-outline" />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Scheduled Reports Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  Scheduled Reports
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:clock-outline" />}
                  onClick={() => setScheduleDialogOpen(true)}
                >
                  Schedule New Report
                </Button>
              </Stack>

              <List>
                {scheduledReports.map((report, index) => (
                  <React.Fragment key={report.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Iconify 
                          icon={
                            report.status === 'active' ? 'eva:checkmark-circle-2-outline' :
                            report.status === 'paused' ? 'eva:pause-circle-outline' :
                            'eva:alert-circle-outline'
                          }
                          color={
                            report.status === 'active' ? 'success.main' :
                            report.status === 'paused' ? 'warning.main' :
                            'error.main'
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={report.templateName}
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {report.schedule}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Recipients: {report.recipients.join(', ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Next run: {format(new Date(report.nextRun), 'MMM dd, yyyy HH:mm')}
                            </Typography>
                          </Stack>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={1}>
                          <Switch
                            checked={report.isActive}
                            onChange={() => handleToggleScheduledReport(report.id)}
                            size="small"
                          />
                          <IconButton size="small">
                            <Iconify icon="eva:edit-outline" />
                          </IconButton>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < scheduledReports.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </TabPanel>

          {/* Export Center Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Export Center
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Quick Export
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Export current dashboard data in various formats
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Button
                          variant="outlined"
                          startIcon={<Iconify icon="eva:file-text-outline" />}
                          onClick={() => handleExportReport('pdf')}
                          fullWidth
                        >
                          Export as PDF
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Iconify icon="eva:file-outline" />}
                          onClick={() => handleExportReport('excel')}
                          fullWidth
                        >
                          Export as Excel
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Iconify icon="eva:download-outline" />}
                          onClick={() => handleExportReport('csv')}
                          fullWidth
                        >
                          Export as CSV
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Custom Export
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Configure custom export settings
                      </Typography>
                      
                      <Stack spacing={2}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Data Range</InputLabel>
                          <Select value="last_30_days" label="Data Range">
                            <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                            <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                            <MenuItem value="last_3_months">Last 3 Months</MenuItem>
                            <MenuItem value="custom">Custom Range</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <FormControl fullWidth size="small">
                          <InputLabel>Include Data</InputLabel>
                          <Select multiple value={['sales', 'inventory']} label="Include Data">
                            <MenuItem value="sales">Sales Data</MenuItem>
                            <MenuItem value="inventory">Inventory Data</MenuItem>
                            <MenuItem value="customers">Customer Data</MenuItem>
                            <MenuItem value="financial">Financial Data</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <Button variant="contained" fullWidth>
                          Generate Custom Export
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
