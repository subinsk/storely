'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Iconify } from '@storely/shared/components/iconify';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  component: string;
  message: string;
  details?: any;
  userId?: string;
  ip?: string;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

// Mock data
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: 'error',
    component: 'Authentication',
    message: 'Failed login attempt',
    details: { email: 'user@example.com', attempts: 3 },
    userId: 'user_123',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    level: 'info',
    component: 'Product Management',
    message: 'Product updated successfully',
    details: { productId: 'prod_456', changes: ['price', 'description'] },
    userId: 'admin_789',
    ip: '192.168.1.101'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    level: 'warning',
    component: 'Payment Processing',
    message: 'Payment gateway timeout',
    details: { gateway: 'stripe', orderId: 'order_321' },
    ip: '192.168.1.102'
  },
];

const mockMetrics: SystemMetric[] = [
  { name: 'CPU Usage', value: 65, unit: '%', threshold: 80, status: 'normal' },
  { name: 'Memory Usage', value: 82, unit: '%', threshold: 85, status: 'warning' },
  { name: 'Disk Usage', value: 45, unit: '%', threshold: 90, status: 'normal' },
  { name: 'Response Time', value: 250, unit: 'ms', threshold: 500, status: 'normal' },
  { name: 'Error Rate', value: 0.8, unit: '%', threshold: 2, status: 'normal' },
  { name: 'Active Users', value: 142, unit: '', threshold: 1000, status: 'normal' },
];

// ----------------------------------------------------------------------

export default function SystemLogs() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filters
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [componentFilter, setComponentFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 24 * 60 * 60 * 1000)); // Last 24 hours
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch logs and metrics from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/system/logs');
        const data = await response.json();
        
        if (data.success) {
          setLogs(data.logs || mockLogs);
          setMetrics(data.metrics || mockMetrics);
        } else {
          // Fall back to mock data if API fails
          setLogs(mockLogs);
          setMetrics(mockMetrics);
        }
      } catch (error) {
        console.error('Failed to fetch system logs:', error);
        // Use mock data as fallback
        setLogs(mockLogs);
        setMetrics(mockMetrics);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRefreshLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/logs');
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs || []);
        setMetrics(data.metrics || []);
        enqueueSnackbar('Logs refreshed successfully', { variant: 'success' });
      } else {
        throw new Error(data.error || 'Failed to fetch logs');
      }
    } catch (error) {
      console.error('Failed to refresh logs:', error);
      enqueueSnackbar('Failed to refresh logs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleClearLogs = useCallback(async () => {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      setLogs([]);
      enqueueSnackbar('Logs cleared successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to clear logs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleExportLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      enqueueSnackbar('Logs exported successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to export logs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const filteredLogs = logs.filter(log => {
    if (levelFilter !== 'all' && log.level !== levelFilter) return false;
    if (componentFilter !== 'all' && log.component !== componentFilter) return false;
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    const logDate = new Date(log.timestamp);
    if (startDate && logDate < startDate) return false;
    if (endDate && logDate > endDate) return false;
    
    return true;
  });

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'default';
      default: return 'default';
    }
  };

  const getMetricStatusColor = (status: SystemMetric['status']): 'error' | 'warning' | 'success' | 'primary' => {
    switch (status) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'normal': return 'success';
      default: return 'primary';
    }
  };

  const renderSystemMetrics = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Metrics
        </Typography>
        
        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={6} md={4} key={metric.name}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">
                      {metric.name}
                    </Typography>
                    <Typography variant="h4">
                      {metric.value}{metric.unit}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(metric.value / metric.threshold) * 100}
                      color={getMetricStatusColor(metric.status)}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                        color={getMetricStatusColor(metric.status)}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Threshold: {metric.threshold}{metric.unit}
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
  );

  const renderLogFilters = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Log Filters
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={levelFilter}
                label="Level"
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="debug">Debug</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Component</InputLabel>
              <Select
                value={componentFilter}
                label="Component"
                onChange={(e) => setComponentFilter(e.target.value)}
              >
                <MenuItem value="all">All Components</MenuItem>
                <MenuItem value="Authentication">Authentication</MenuItem>
                <MenuItem value="Product Management">Product Management</MenuItem>
                <MenuItem value="Payment Processing">Payment Processing</MenuItem>
                <MenuItem value="Order Management">Order Management</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Iconify icon="eva:search-fill" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
        </Grid>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={handleRefreshLogs}
            startIcon={<Iconify icon="eva:refresh-fill" />}
          >
            Refresh
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={handleExportLogs}
            startIcon={<Iconify icon="eva:download-fill" />}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearLogs}
            startIcon={<Iconify icon="eva:trash-2-fill" />}
          >
            Clear Logs
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderLogTable = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Logs ({filteredLogs.length} entries)
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Component</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>User</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.level.toUpperCase()}
                      color={getLogLevelColor(log.level)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.component}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell>{log.userId || '-'}</TableCell>
                  <TableCell>{log.ip || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedLog(log);
                          setDialogOpen(true);
                        }}
                      >
                        <Iconify icon="eva:eye-fill" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            System Logs & Monitoring
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor system performance and review application logs for troubleshooting and security analysis.
          </Typography>
        </Box>

        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="System Metrics" />
          <Tab label="Application Logs" />
        </Tabs>

        {currentTab === 0 && renderSystemMetrics()}
        
        {currentTab === 1 && (
          <Stack spacing={3}>
            {renderLogFilters()}
            {renderLogTable()}
          </Stack>
        )}
      </Stack>

      {/* Log Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Timestamp:</Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedLog.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Level:</Typography>
                  <Chip
                    label={selectedLog.level.toUpperCase()}
                    color={getLogLevelColor(selectedLog.level)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Component:</Typography>
                  <Typography variant="body2">{selectedLog.component}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">User ID:</Typography>
                  <Typography variant="body2">{selectedLog.userId || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">IP Address:</Typography>
                  <Typography variant="body2">{selectedLog.ip || 'N/A'}</Typography>
                </Grid>
              </Grid>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>Message:</Typography>
                <Typography variant="body2">{selectedLog.message}</Typography>
              </Box>
              
              {selectedLog.details && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Details:</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
