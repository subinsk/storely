'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '@/components/iconify';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

interface Integration {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'accounting' | 'social' | 'analytics';
  provider: string;
  isConnected: boolean;
  isEnabled: boolean;
  lastSync?: string;
  icon: string;
  description: string;
  features: string[];
  config?: Record<string, any>;
}

interface SyncLog {
  id: string;
  integrationId: string;
  integrationName: string;
  type: 'sync' | 'export' | 'import';
  status: 'success' | 'failed' | 'in_progress';
  timestamp: string;
  recordsProcessed: number;
  duration: string;
  error?: string;
}

// Mock data
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Salesforce CRM',
    type: 'crm',
    provider: 'Salesforce',
    isConnected: true,
    isEnabled: true,
    lastSync: new Date().toISOString(),
    icon: 'simple-icons:salesforce',
    description: 'Sync customers and orders with Salesforce CRM',
    features: ['Customer sync', 'Order sync', 'Lead generation', 'Sales pipeline'],
    config: {
      apiKey: '****-****-****-1234',
      syncInterval: 'hourly',
      syncCustomers: true,
      syncOrders: true
    }
  },
  {
    id: '2',
    name: 'HubSpot CRM',
    type: 'crm',
    provider: 'HubSpot',
    isConnected: false,
    isEnabled: false,
    icon: 'simple-icons:hubspot',
    description: 'Connect with HubSpot for marketing automation and CRM',
    features: ['Contact management', 'Marketing automation', 'Deal tracking', 'Email campaigns']
  },
  {
    id: '3',
    name: 'Mailchimp',
    type: 'email',
    provider: 'Mailchimp',
    isConnected: true,
    isEnabled: true,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'simple-icons:mailchimp',
    description: 'Email marketing and customer segmentation',
    features: ['Email campaigns', 'Customer lists', 'Automation', 'Analytics'],
    config: {
      apiKey: '****-****-****-5678',
      audienceId: 'aud_123456',
      syncCustomers: true
    }
  },
  {
    id: '4',
    name: 'QuickBooks',
    type: 'accounting',
    provider: 'Intuit',
    isConnected: false,
    isEnabled: false,
    icon: 'simple-icons:quickbooks',
    description: 'Sync financial data with QuickBooks accounting',
    features: ['Invoice sync', 'Payment tracking', 'Tax reporting', 'Financial statements']
  },
  {
    id: '5',
    name: 'Google Analytics',
    type: 'analytics',
    provider: 'Google',
    isConnected: true,
    isEnabled: true,
    lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    icon: 'simple-icons:googleanalytics',
    description: 'Track website performance and customer behavior',
    features: ['Traffic analytics', 'Conversion tracking', 'E-commerce reports', 'Audience insights'],
    config: {
      trackingId: 'GA-123456789',
      ecommerceTracking: true
    }
  },
];

const mockSyncLogs: SyncLog[] = [
  {
    id: '1',
    integrationId: '1',
    integrationName: 'Salesforce CRM',
    type: 'sync',
    status: 'success',
    timestamp: new Date().toISOString(),
    recordsProcessed: 150,
    duration: '2 minutes'
  },
  {
    id: '2',
    integrationId: '3',
    integrationName: 'Mailchimp',
    type: 'export',
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    recordsProcessed: 50,
    duration: '30 seconds'
  },
  {
    id: '3',
    integrationId: '5',
    integrationName: 'Google Analytics',
    type: 'import',
    status: 'failed',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    recordsProcessed: 0,
    duration: '5 seconds',
    error: 'API rate limit exceeded'
  },
];

// ----------------------------------------------------------------------

export default function IntegrationsManagement() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [syncLogs] = useState<SyncLog[]>(mockSyncLogs);
  const [loading, setLoading] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleToggleIntegration = useCallback(async (integrationId: string, enabled: boolean) => {
    setLoading(true);
    try {
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, isEnabled: enabled }
          : integration
      ));
      enqueueSnackbar(`Integration ${enabled ? 'enabled' : 'disabled'}`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update integration', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleConnectIntegration = useCallback(async (integrationId: string) => {
    setLoading(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, isConnected: true, isEnabled: true, lastSync: new Date().toISOString() }
          : integration
      ));
      enqueueSnackbar('Integration connected successfully', { variant: 'success' });
      setConnectDialogOpen(false);
    } catch (error) {
      enqueueSnackbar('Failed to connect integration', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleSyncNow = useCallback(async (integrationId: string) => {
    setLoading(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, lastSync: new Date().toISOString() }
          : integration
      ));
      enqueueSnackbar('Sync completed successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Sync failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const getIntegrationTypeColor = (type: Integration['type']) => {
    switch (type) {
      case 'crm': return 'primary';
      case 'email': return 'secondary';
      case 'accounting': return 'success';
      case 'social': return 'info';
      case 'analytics': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: SyncLog['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'in_progress': return 'info';
      default: return 'default';
    }
  };

  const renderIntegrationsList = () => (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Available Integrations
          </Typography>
          
          <Grid container spacing={3}>
            {integrations.map((integration) => (
              <Grid item xs={12} md={6} lg={4} key={integration.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'background.neutral' }}>
                          <Iconify icon={integration.icon} width={24} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {integration.name}
                          </Typography>
                          <Chip
                            label={integration.type.toUpperCase()}
                            color={getIntegrationTypeColor(integration.type)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={integration.isConnected ? 'Connected' : 'Not Connected'}
                            color={integration.isConnected ? 'success' : 'default'}
                            size="small"
                          />
                        </Stack>
                      </Stack>
                      
                      <Typography variant="body2" color="text.secondary">
                        {integration.description}
                      </Typography>
                      
                      <Stack spacing={1}>
                        <Typography variant="caption" fontWeight="medium">
                          Features:
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {integration.features.map((feature) => (
                            <Chip
                              key={feature}
                              label={feature}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Stack>
                      
                      {integration.lastSync && (
                        <Typography variant="caption" color="text.secondary">
                          Last sync: {format(new Date(integration.lastSync), 'MMM dd, HH:mm')}
                        </Typography>
                      )}
                      
                      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={integration.isEnabled}
                              onChange={(e) => handleToggleIntegration(integration.id, e.target.checked)}
                              disabled={!integration.isConnected}
                            />
                          }
                          label="Enabled"
                        />
                        
                        <Stack direction="row" spacing={1}>
                          {integration.isConnected ? (
                            <>
                              <Tooltip title="Configure">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedIntegration(integration);
                                    setConfigDialogOpen(true);
                                  }}
                                >
                                  <Iconify icon="eva:settings-fill" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Sync Now">
                                <IconButton
                                  size="small"
                                  onClick={() => handleSyncNow(integration.id)}
                                  disabled={!integration.isEnabled}
                                >
                                  <Iconify icon="eva:refresh-fill" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setConnectDialogOpen(true);
                              }}
                            >
                              Connect
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderSyncLogs = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sync History
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Integration</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Records</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Error</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {syncLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.integrationName}</TableCell>
                  <TableCell>
                    {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      color={getStatusColor(log.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.recordsProcessed}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell>
                    {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {log.error ? (
                      <Tooltip title={log.error}>
                        <Iconify icon="eva:alert-circle-fill" color="error.main" />
                      </Tooltip>
                    ) : (
                      '-'
                    )}
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
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4">Third-Party Integrations</Typography>
        
        <Alert severity="info">
          Connect your store with external services to streamline your workflow and improve customer experience.
        </Alert>

        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Integrations" />
          <Tab label="Sync History" />
        </Tabs>

        {currentTab === 0 && renderIntegrationsList()}
        {currentTab === 1 && renderSyncLogs()}
      </Stack>

      {/* Connect Integration Dialog */}
      <Dialog
        open={connectDialogOpen}
        onClose={() => setConnectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
        <DialogContent>
          {selectedIntegration && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="body2">
                To connect {selectedIntegration.name}, you'll need to provide your API credentials.
              </Typography>
              
              <TextField
                fullWidth
                label="API Key"
                type="password"
                placeholder="Enter your API key"
              />
              
              {selectedIntegration.type === 'crm' && (
                <TextField
                  fullWidth
                  label="Domain/Instance URL"
                  placeholder="e.g., yourcompany.salesforce.com"
                />
              )}
              
              {selectedIntegration.type === 'email' && (
                <TextField
                  fullWidth
                  label="Audience/List ID"
                  placeholder="Enter your audience ID"
                />
              )}
              
              <Alert severity="info">
                Your credentials are encrypted and stored securely. We only use them to sync data as configured.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)}>Cancel</Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={() => selectedIntegration && handleConnectIntegration(selectedIntegration.id)}
          >
            Connect
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
        <DialogContent>
          {selectedIntegration && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Sync Settings</Typography>
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Sync customers"
              />
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Sync orders"
              />
              
              {selectedIntegration.type === 'email' && (
                <FormControlLabel
                  control={<Switch />}
                  label="Auto-add new customers to campaigns"
                />
              )}
              
              <TextField
                fullWidth
                label="Sync Interval"
                select
                defaultValue="hourly"
                SelectProps={{ native: true }}
              >
                <option value="manual">Manual only</option>
                <option value="hourly">Every hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </TextField>
              
              <Divider />
              
              <Typography variant="subtitle2">API Configuration</Typography>
              
              <TextField
                fullWidth
                label="API Key"
                value={selectedIntegration.config?.apiKey || ''}
                type="password"
              />
              
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="eva:refresh-fill" />}
                  onClick={() => enqueueSnackbar('Connection tested successfully', { variant: 'success' })}
                >
                  Test Connection
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Iconify icon="eva:trash-2-fill" />}
                  onClick={() => enqueueSnackbar('Integration disconnected', { variant: 'info' })}
                >
                  Disconnect
                </Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
