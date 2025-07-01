'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  TextField,
  Button,
  Divider,
  Alert,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '@/components/iconify';
import { useSnackbar } from 'notistack';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

interface SystemConfig {
  id: string;
  category: string;
  name: string;
  value: string | boolean | number;
  type: 'text' | 'boolean' | 'number' | 'select';
  options?: string[];
  description: string;
  isAdvanced?: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'order_confirmation' | 'shipping_notification' | 'welcome' | 'password_reset';
  isActive: boolean;
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'full' | 'database' | 'files';
  status: 'completed' | 'in_progress' | 'failed';
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  isActive: boolean;
  expiresAt: string;
}

// Mock data
const mockSystemConfigs: SystemConfig[] = [
  {
    id: '1',
    category: 'General',
    name: 'Site Maintenance Mode',
    value: false,
    type: 'boolean',
    description: 'Enable maintenance mode to temporarily disable the website',
  },
  {
    id: '2',
    category: 'General',
    name: 'Max File Upload Size (MB)',
    value: 10,
    type: 'number',
    description: 'Maximum file size allowed for uploads',
  },
  {
    id: '3',
    category: 'Email',
    name: 'SMTP Server',
    value: 'smtp.gmail.com',
    type: 'text',
    description: 'SMTP server for sending emails',
  },
  {
    id: '4',
    category: 'Email',
    name: 'SMTP Port',
    value: 587,
    type: 'number',
    description: 'SMTP server port',
  },
  {
    id: '5',
    category: 'Security',
    name: 'Session Timeout (minutes)',
    value: 30,
    type: 'number',
    description: 'User session timeout duration',
  },
  {
    id: '6',
    category: 'Security',
    name: 'Enable Two-Factor Authentication',
    value: false,
    type: 'boolean',
    description: 'Require 2FA for admin users',
  },
];

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Order Confirmation',
    subject: 'Order Confirmed - #{{order_number}}',
    body: `Dear {{customer_name}},

Thank you for your order! We're happy to confirm that we've received your order and it's being processed.

Order Details:
- Order Number: {{order_number}}
- Total Amount: {{order_total}}
- Estimated Delivery: {{delivery_date}}

We'll send you an update when your order ships.

Best regards,
{{store_name}}`,
    type: 'order_confirmation',
    isActive: true,
  },
  {
    id: '2',
    name: 'Shipping Notification',
    subject: 'Your order is on the way! - #{{order_number}}',
    body: `Hi {{customer_name}},

Great news! Your order has been shipped and is on its way to you.

Tracking Information:
- Order Number: {{order_number}}
- Tracking Number: {{tracking_number}}
- Estimated Delivery: {{delivery_date}}

Track your package: {{tracking_url}}

Thanks for shopping with us!
{{store_name}}`,
    type: 'shipping_notification',
    isActive: true,
  },
];

const mockNotificationSettings: NotificationSetting[] = [
  {
    id: '1',
    name: 'New Order',
    description: 'Notification when a new order is placed',
    email: true,
    sms: false,
    push: true,
    frequency: 'immediate',
  },
  {
    id: '2',
    name: 'Low Stock Alert',
    description: 'Alert when product stock is low',
    email: true,
    sms: true,
    push: false,
    frequency: 'daily',
  },
  {
    id: '3',
    name: 'System Backup',
    description: 'Notification about backup status',
    email: true,
    sms: false,
    push: false,
    frequency: 'weekly',
  },
];

const mockBackupRecords: BackupRecord[] = [
  {
    id: '1',
    name: 'Full Backup - June 30, 2025',
    size: '2.3 GB',
    createdAt: '2025-06-30T02:00:00Z',
    type: 'full',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Database Backup - June 29, 2025',
    size: '45 MB',
    createdAt: '2025-06-29T02:00:00Z',
    type: 'database',
    status: 'completed',
  },
];

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Mobile App API',
    key: 'sk_live_51H*********************',
    permissions: ['orders:read', 'products:read', 'customers:read'],
    lastUsed: '2025-06-30T10:30:00Z',
    isActive: true,
    expiresAt: '2026-06-30T00:00:00Z',
  },
  {
    id: '2',
    name: 'Analytics Integration',
    key: 'sk_test_4e*********************',
    permissions: ['analytics:read', 'reports:read'],
    lastUsed: '2025-06-29T15:45:00Z',
    isActive: true,
    expiresAt: '2025-12-31T00:00:00Z',
  },
];

export default function SystemConfiguration() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<SystemConfig[]>(mockSystemConfigs);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(mockNotificationSettings);
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackupRecords);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [openBackupDialog, setOpenBackupDialog] = useState(false);
  const [openAPIKeyDialog, setOpenAPIKeyDialog] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    content: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    content: '',
    action: () => {},
  });

  const handleConfigChange = useCallback((id: string, value: any) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, value } : config
    ));
  }, []);

  const handleSaveConfigs = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      enqueueSnackbar('System configuration saved successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to save configuration', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleCreateBackup = useCallback(async (type: 'full' | 'database' | 'files') => {
    setLoading(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup: BackupRecord = {
        id: `backup_${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Backup - ${new Date().toLocaleDateString()}`,
        size: type === 'full' ? '2.1 GB' : type === 'database' ? '42 MB' : '1.8 GB',
        createdAt: new Date().toISOString(),
        type,
        status: 'completed',
      };
      
      setBackups(prev => [newBackup, ...prev]);
      enqueueSnackbar('Backup created successfully', { variant: 'success' });
      setOpenBackupDialog(false);
    } catch (error) {
      enqueueSnackbar('Failed to create backup', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const renderSystemSettings = () => (
    <Grid container spacing={3}>
      {['General', 'Email', 'Security'].map((category) => (
        <Grid item xs={12} key={category}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {category} Settings
              </Typography>
              <Stack spacing={2}>
                {configs
                  .filter(config => config.category === category)
                  .map((config) => (
                    <Box key={config.id}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle2">
                            {config.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {config.description}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: 200 }}>
                          {config.type === 'boolean' ? (
                            <Switch
                              checked={config.value as boolean}
                              onChange={(e) => handleConfigChange(config.id, e.target.checked)}
                            />
                          ) : config.type === 'select' ? (
                            <FormControl size="small" fullWidth>
                              <Select
                                value={config.value}
                                onChange={(e) => handleConfigChange(config.id, e.target.value)}
                              >
                                {config.options?.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              size="small"
                              type={config.type}
                              value={config.value}
                              onChange={(e) => handleConfigChange(config.id, 
                                config.type === 'number' ? Number(e.target.value) : e.target.value
                              )}
                              fullWidth
                            />
                          )}
                        </Box>
                      </Stack>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
              </Stack>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  onClick={handleSaveConfigs}
                >
                  Save Changes
                </LoadingButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderEmailTemplates = () => (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6">
            Email Templates
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setEditingTemplate(null);
              setOpenTemplateDialog(true);
            }}
          >
            Add Template
          </Button>
        </Stack>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emailTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {template.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {template.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.isActive ? 'Active' : 'Inactive'}
                      color={template.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingTemplate(template);
                        setOpenTemplateDialog(true);
                      }}
                    >
                      <Iconify icon="eva:edit-fill" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <Box key={notification.id}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    {notification.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={<Switch size="small" checked={notification.email} />}
                    label="Email"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    control={<Switch size="small" checked={notification.sms} />}
                    label="SMS"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    control={<Switch size="small" checked={notification.push} />}
                    label="Push"
                    labelPlacement="top"
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={notification.frequency}>
                      <MenuItem value="immediate">Immediate</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  const renderBackupRestore = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6">
                Create Backup
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCreateBackup('full')}
                startIcon={<Iconify icon="eva:hard-drive-outline" />}
                disabled={loading}
              >
                Full System Backup
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCreateBackup('database')}
                startIcon={<Iconify icon="eva:database-outline" />}
                disabled={loading}
              >
                Database Only
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleCreateBackup('files')}
                startIcon={<Iconify icon="eva:folder-outline" />}
                disabled={loading}
              >
                Files Only
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Backup History
            </Typography>
            <Stack spacing={2}>
              {backups.map((backup) => (
                <Box key={backup.id}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2">
                        {backup.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {backup.size} • {new Date(backup.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={backup.type}
                        size="small"
                        variant="outlined"
                      />
                      <IconButton size="small">
                        <Iconify icon="eva:download-outline" />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAPIKeys = () => (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6">
            API Keys Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenAPIKeyDialog(true)}
          >
            Generate API Key
          </Button>
        </Stack>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Key</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {apiKey.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {apiKey.key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {apiKey.permissions.slice(0, 2).map((permission) => (
                        <Chip
                          key={permission}
                          label={permission}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {apiKey.permissions.length > 2 && (
                        <Chip
                          label={`+${apiKey.permissions.length - 2} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(apiKey.lastUsed).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={apiKey.isActive ? 'Active' : 'Inactive'}
                      color={apiKey.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const tabs = [
    { label: 'System Settings', content: renderSystemSettings() },
    { label: 'Email Templates', content: renderEmailTemplates() },
    { label: 'Notifications', content: renderNotificationSettings() },
    { label: 'Backup & Restore', content: renderBackupRestore() },
    { label: 'API Keys', content: renderAPIKeys() },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage system settings, email templates, notifications, and security configurations.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={0}>
            {tabs.map((tab, index) => (
              <Button
                key={index}
                variant={activeTab === index ? 'contained' : 'text'}
                onClick={() => setActiveTab(index)}
                sx={{
                  borderRadius: 0,
                  py: 2,
                  px: 3,
                  ...(activeTab === index && {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }),
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Card>

      {tabs[activeTab].content}
    </Box>
  );
}
