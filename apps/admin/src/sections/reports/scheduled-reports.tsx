'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Card,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Stack,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useSnackbar } from 'notistack';
import { createScheduledReport, deleteScheduledReport, executeScheduledReport, updateScheduledReport, useScheduledReports } from '@/hooks/useReports';
import { ConfirmDialog } from '@storely/shared/components/custom-dialog';
import { Iconify } from '@storely/shared/components/iconify';

// ----------------------------------------------------------------------

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  reportType: string;
  frequency: string;
  recipients: string[];
  format: string[];
  filters: Record<string, any>;
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
  createdAt: string;
  status: 'active' | 'paused' | 'error';
}

interface ReportExecution {
  id: string;
  reportId: string;
  reportName: string;
  executedAt: string;
  status: 'success' | 'failed' | 'running';
  format: string;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
}

const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Weekly Sales Report',
    description: 'Comprehensive weekly sales analysis',
    reportType: 'sales',
    frequency: 'weekly',
    recipients: ['admin@company.com', 'manager@company.com'],
    format: ['pdf', 'excel'],
    filters: {
      dateRange: 'last_7_days',
      includeProducts: true,
      includeCustomers: true
    },
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    name: 'Monthly Customer Analysis',
    description: 'Customer behavior and segmentation report',
    reportType: 'customers',
    frequency: 'monthly',
    recipients: ['analytics@company.com'],
    format: ['pdf'],
    filters: {
      dateRange: 'last_30_days',
      includeSegmentation: true,
      includeLoyalty: true
    },
    nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '3',
    name: 'Daily Inventory Alert',
    description: 'Low stock and inventory status',
    reportType: 'inventory',
    frequency: 'daily',
    recipients: ['warehouse@company.com', 'operations@company.com'],
    format: ['email'],
    filters: {
      lowStockThreshold: 10,
      includeOutOfStock: true
    },
    nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    status: 'active'
  }
];

const mockReportExecutions: ReportExecution[] = [
  {
    id: '1',
    reportId: '1',
    reportName: 'Weekly Sales Report',
    executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'success',
    format: 'pdf',
    fileSize: 1024 * 512,
    downloadUrl: '#'
  },
  {
    id: '2',
    reportId: '2',
    reportName: 'Monthly Customer Analysis',
    executedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'success',
    format: 'pdf',
    fileSize: 1024 * 256,
    downloadUrl: '#'
  },
  {
    id: '3',
    reportId: '3',
    reportName: 'Daily Inventory Alert',
    executedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'failed',
    format: 'email',
    error: 'SMTP connection failed'
  }
];

const reportTypes = [
  { value: 'sales', label: 'Sales Report', icon: 'eva:trending-up-fill' },
  { value: 'customers', label: 'Customer Analysis', icon: 'eva:people-fill' },
  { value: 'inventory', label: 'Inventory Report', icon: 'eva:cube-fill' },
  { value: 'analytics', label: 'Analytics Dashboard', icon: 'eva:bar-chart-fill' },
  { value: 'financial', label: 'Financial Report', icon: 'eva:credit-card-fill' }
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'custom', label: 'Custom Schedule' }
];

const formats = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'excel', label: 'Excel Spreadsheet' },
  { value: 'csv', label: 'CSV File' },
  { value: 'email', label: 'Email Summary' }
];

// ----------------------------------------------------------------------

export default function ScheduledReports() {
  const { enqueueSnackbar } = useSnackbar();
  
  // Use API hooks
  const { scheduledData, scheduledLoading, scheduledError, refresh } = useScheduledReports();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const reports = scheduledData?.data?.schedules || [];
  const executions = scheduledData?.data?.executions || [];
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    content: '',
    action: () => {}
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reportType: '',
    frequency: '',
    recipients: [''],
    format: [] as string[],
    customSchedule: null as Date | null,
    filters: {}
  });

  const handleOpenDialog = useCallback((report?: ScheduledReport) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        description: report.description,
        reportType: report.reportType,
        frequency: report.frequency,
        recipients: report.recipients,
        format: report.format,
        customSchedule: null,
        filters: report.filters
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: '',
        description: '',
        reportType: '',
        frequency: '',
        recipients: [''],
        format: [],
        customSchedule: null,
        filters: {}
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingReport(null);
  }, []);

  const handleAddRecipient = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  }, []);

  const handleRemoveRecipient = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  }, []);

  const handleRecipientChange = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? value : recipient
      )
    }));
  }, []);

  const handleFormatChange = useCallback((format: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      format: checked 
        ? [...prev.format, format]
        : prev.format.filter(f => f !== format)
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const nextRun = formData.frequency === 'custom' && formData.customSchedule
        ? formData.customSchedule.toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const reportData = {
        ...formData,
        nextRun,
        recipients: formData.recipients.filter(r => r.trim() !== '')
      };

      if (editingReport) {
        await updateScheduledReport(editingReport.id, reportData);
        enqueueSnackbar('Scheduled report updated successfully', { variant: 'success' });
      } else {
        await createScheduledReport(reportData);
        enqueueSnackbar('Scheduled report created successfully', { variant: 'success' });
      }
      
      // Refresh the data
      refresh();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Failed to save scheduled report', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editingReport, formData, enqueueSnackbar, handleCloseDialog, refresh]);

  const handleToggleActive = useCallback(async (id: string) => {
    try {
      const report = reports.find((r: any) => r.id === id);
      if (report) {
        await updateScheduledReport(id, {
          ...report,
          isActive: !report.isActive,
          status: report.isActive ? 'paused' : 'active'
        });
        refresh();
        enqueueSnackbar('Report status updated', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to update report status', { variant: 'error' });
    }
  }, [reports, enqueueSnackbar, refresh]);

  const handleRunNow = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await executeScheduledReport(id);
      refresh();
      enqueueSnackbar('Report executed successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to execute report', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, refresh]);

  const handleDelete = useCallback((id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Scheduled Report',
      content: 'Are you sure you want to delete this scheduled report? This action cannot be undone.',
      action: async () => {
        try {
          await deleteScheduledReport(id);
          refresh();
          enqueueSnackbar('Scheduled report deleted successfully', { variant: 'success' });
        } catch (error) {
          enqueueSnackbar('Failed to delete scheduled report', { variant: 'error' });
        }
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  }, [confirmDialog, enqueueSnackbar, refresh]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'error': return 'error';
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'running': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Scheduled Reports</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenDialog()}
        >
          Create Report Schedule
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Automatically generate and send reports to stakeholders on a regular schedule. 
          Reports can be sent via email or saved to specific formats.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Scheduled Reports */}
        <Grid item xs={12} lg={8}>
          <Card>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6">Active Schedules</Typography>
            </Box>
            
            {scheduledLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : scheduledError ? (
              <Alert severity="error" sx={{ m: 3 }}>
                Failed to load scheduled reports. Please try refreshing the page.
              </Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Next Run</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {reports.map((report: ScheduledReport) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {report.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reportTypes.find(t => t.value === report.reportType)?.label || report.reportType}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {report.frequency}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(report.nextRun).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(report.nextRun).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          size="small"
                          color={getStatusColor(report.status) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Run Now">
                            <IconButton
                              size="small"
                              onClick={() => handleRunNow(report.id)}
                              disabled={loading}
                            >
                              <Iconify icon="eva:play-circle-fill" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(report)}
                            >
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={report.isActive ? 'Pause' : 'Resume'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleActive(report.id)}
                            >
                              <Iconify icon={report.isActive ? 'eva:pause-circle-fill' : 'eva:play-circle-fill'} />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(report.id)}
                            >
                              <Iconify icon="eva:trash-2-fill" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </Card>
        </Grid>

        {/* Recent Executions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6">Recent Executions</Typography>
            </Box>
            <List>
              {executions.map((execution: ReportExecution, index: number) => (
                <Box key={execution.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify 
                        icon={
                          execution.status === 'success' ? 'eva:checkmark-circle-2-fill' :
                          execution.status === 'failed' ? 'eva:close-circle-fill' :
                          'eva:clock-fill'
                        }
                        color={
                          execution.status === 'success' ? 'success.main' :
                          execution.status === 'failed' ? 'error.main' :
                          'warning.main'
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={execution.reportName}
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="caption">
                            {new Date(execution.executedAt).toLocaleString()}
                          </Typography>
                          {execution.fileSize && (
                            <Typography variant="caption" color="text.secondary">
                              {execution.format.toUpperCase()} • {formatFileSize(execution.fileSize)}
                            </Typography>
                          )}
                          {execution.error && (
                            <Typography variant="caption" color="error">
                              {execution.error}
                            </Typography>
                          )}
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      {execution.downloadUrl && execution.status === 'success' && (
                        <IconButton size="small">
                          <Iconify icon="eva:download-fill" />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < executions.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>

      {/* Create/Edit Report Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingReport ? 'Edit Scheduled Report' : 'Create Scheduled Report'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={formData.reportType}
                    label="Report Type"
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Iconify icon={type.icon} width={16} />
                          <span>{type.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    label="Frequency"
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    {frequencies.map((freq) => (
                      <MenuItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.frequency === 'custom' && (
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Custom Schedule"
                    value={formData.customSchedule}
                    onChange={(date) => setFormData({ ...formData, customSchedule: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>
              )}
            </Grid>
            
            <Divider />
            
            <Typography variant="h6">Recipients</Typography>
            {formData.recipients.map((recipient, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  label={`Recipient ${index + 1}`}
                  type="email"
                  value={recipient}
                  onChange={(e) => handleRecipientChange(index, e.target.value)}
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveRecipient(index)}
                  disabled={formData.recipients.length === 1}
                >
                  <Iconify icon="eva:minus-circle-fill" />
                </IconButton>
              </Stack>
            ))}
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAddRecipient}
              size="small"
            >
              Add Recipient
            </Button>
            
            <Divider />
            
            <Typography variant="h6">Output Format</Typography>
            <Grid container spacing={1}>
              {formats.map((format) => (
                <Grid item xs={12} sm={6} key={format.value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.format.includes(format.value)}
                        onChange={(e) => handleFormatChange(format.value, e.target.checked)}
                      />
                    }
                    label={format.label}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleSave}
            loading={loading}
          >
            {editingReport ? 'Update' : 'Create'} Schedule
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        title={confirmDialog.title}
        content={confirmDialog.content}
        action={confirmDialog.action}
      />
    </Box>
  );
}
