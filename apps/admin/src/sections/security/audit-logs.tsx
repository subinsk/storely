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
  Avatar,
  TablePagination,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Iconify } from '@storely/shared/components/iconify';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Mock data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    userId: 'admin_123',
    userName: 'John Admin',
    userEmail: 'admin@furnerio.com',
    action: 'DELETE_PRODUCT',
    resource: 'Product',
    resourceId: 'prod_456',
    details: { productName: 'Office Chair', reason: 'Discontinued' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    outcome: 'success',
    severity: 'high'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    userId: 'user_789',
    userName: 'Jane Manager',
    userEmail: 'manager@furnerio.com',
    action: 'UPDATE_USER_PERMISSIONS',
    resource: 'User',
    resourceId: 'user_321',
    details: { addedPermissions: ['manage_products'], removedPermissions: [] },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    outcome: 'success',
    severity: 'medium'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    userId: 'user_456',
    userName: 'Bob User',
    userEmail: 'user@furnerio.com',
    action: 'FAILED_LOGIN',
    resource: 'Authentication',
    resourceId: 'login_attempt_789',
    details: { reason: 'Invalid password', attempts: 3 },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    outcome: 'failure',
    severity: 'medium'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    userId: 'admin_123',
    userName: 'John Admin',
    userEmail: 'admin@furnerio.com',
    action: 'EXPORT_CUSTOMER_DATA',
    resource: 'Customer',
    resourceId: 'bulk_export_001',
    details: { customerCount: 1500, format: 'CSV', includePersonalData: true },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    outcome: 'success',
    severity: 'critical'
  },
];

// ----------------------------------------------------------------------

export default function AuditLogs() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // Last 7 days
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch audit logs from API
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/security/audit-logs');
        const data = await response.json();
        
        if (data.success) {
          setLogs(data.logs || []);
        } else {
          // Fall back to mock data if API fails
          setLogs(mockAuditLogs);
        }
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        // Use mock data as fallback
        setLogs(mockAuditLogs);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const handleRefreshLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/security/audit-logs');
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs || []);
        enqueueSnackbar('Audit logs refreshed successfully', { variant: 'success' });
      } else {
        throw new Error(data.error || 'Failed to fetch audit logs');
      }
    } catch (error) {
      console.error('Failed to refresh audit logs:', error);
      enqueueSnackbar('Failed to refresh audit logs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleExportLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      enqueueSnackbar('Audit logs exported successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to export audit logs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'all' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    if (resourceFilter !== 'all' && log.resource !== resourceFilter) return false;
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (outcomeFilter !== 'all' && log.outcome !== outcomeFilter) return false;
    if (userFilter && !log.userName.toLowerCase().includes(userFilter.toLowerCase()) && !log.userEmail.toLowerCase().includes(userFilter.toLowerCase())) return false;
    if (searchQuery && !log.action.toLowerCase().includes(searchQuery.toLowerCase()) && !log.resource.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    const logDate = new Date(log.timestamp);
    if (startDate && logDate < startDate) return false;
    if (endDate && logDate > endDate) return false;
    
    return true;
  });

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getSeverityColor = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getOutcomeColor = (outcome: AuditLogEntry['outcome']) => {
    return outcome === 'success' ? 'success' : 'error';
  };

  const renderFilters = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Audit Log Filters
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Resource</InputLabel>
              <Select
                value={resourceFilter}
                label="Resource"
                onChange={(e) => setResourceFilter(e.target.value)}
              >
                <MenuItem value="all">All Resources</MenuItem>
                <MenuItem value="Product">Product</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Order">Order</MenuItem>
                <MenuItem value="Authentication">Authentication</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Outcome</InputLabel>
              <Select
                value={outcomeFilter}
                label="Outcome"
                onChange={(e) => setOutcomeFilter(e.target.value)}
              >
                <MenuItem value="all">All Outcomes</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failure">Failure</MenuItem>
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
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              InputProps={{
                startAdornment: <Iconify icon="eva:person-fill" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search actions or resources..."
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
        </Stack>
      </CardContent>
    </Card>
  );

  const renderAuditTable = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Audit Trail ({filteredLogs.length} entries)
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {log.userName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {log.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.userEmail}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {log.action.replace(/_/g, ' ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {log.resource}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {log.resourceId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.outcome.charAt(0).toUpperCase() + log.outcome.slice(1)}
                      color={getOutcomeColor(log.outcome)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                      color={getSeverityColor(log.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {log.ipAddress}
                    </Typography>
                  </TableCell>
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
        
        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4">Audit Logs</Typography>
        
        <Alert severity="info">
          Track all user actions and system changes for security and compliance purposes. All actions are logged with detailed information including user identity, timestamps, and outcomes.
        </Alert>

        {renderFilters()}
        {renderAuditTable()}
      </Stack>

      {/* Log Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Audit Log Details</DialogTitle>
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
                  <Typography variant="subtitle2">User:</Typography>
                  <Typography variant="body2">
                    {selectedLog.userName} ({selectedLog.userEmail})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Action:</Typography>
                  <Typography variant="body2">{selectedLog.action.replace(/_/g, ' ')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Resource:</Typography>
                  <Typography variant="body2">{selectedLog.resource}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Resource ID:</Typography>
                  <Typography variant="body2">{selectedLog.resourceId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">IP Address:</Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {selectedLog.ipAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Outcome:</Typography>
                  <Chip
                    label={selectedLog.outcome.charAt(0).toUpperCase() + selectedLog.outcome.slice(1)}
                    color={getOutcomeColor(selectedLog.outcome)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Severity:</Typography>
                  <Chip
                    label={selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)}
                    color={getSeverityColor(selectedLog.severity)}
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>User Agent:</Typography>
                <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                  {selectedLog.userAgent}
                </Typography>
              </Box>
              
              {selectedLog.details && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Details:</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <pre style={{ fontSize: '12px', overflow: 'auto', margin: 0 }}>
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
