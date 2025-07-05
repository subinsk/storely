"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControl,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Box,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Wallet,
  Security,
  Settings,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Error,
  Info
} from '@mui/icons-material';
import { Iconify } from '@storely/shared/components/iconify';
import { useSnackbar } from 'notistack';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
  testMode: boolean;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  status: 'active' | 'inactive' | 'error';
}

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  country: string;
  region?: string;
  productCategories: string[];
  enabled: boolean;
}

const mockPaymentGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Stripe',
    type: 'stripe',
    enabled: true,
    config: {
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookSecret: 'whsec_...'
    },
    testMode: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
    fees: { percentage: 2.9, fixed: 0.30 },
    status: 'active'
  },
  {
    id: '2',
    name: 'PayPal',
    type: 'paypal',
    enabled: false,
    config: {
      clientId: '',
      clientSecret: '',
      webhookId: ''
    },
    testMode: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    fees: { percentage: 3.49, fixed: 0.49 },
    status: 'inactive'
  },
  {
    id: '3',
    name: 'Razorpay',
    type: 'razorpay',
    enabled: true,
    config: {
      keyId: 'rzp_test_...',
      keySecret: 'your_key_secret'
    },
    testMode: true,
    supportedCurrencies: ['INR'],
    fees: { percentage: 2.0, fixed: 0 },
    status: 'active'
  }
];

const mockTaxRules: TaxRule[] = [
  {
    id: '1',
    name: 'US Sales Tax',
    rate: 8.25,
    type: 'percentage',
    country: 'US',
    region: 'CA',
    productCategories: ['all'],
    enabled: true
  },
  {
    id: '2',
    name: 'EU VAT',
    rate: 20,
    type: 'percentage',
    country: 'GB',
    productCategories: ['all'],
    enabled: true
  },
  {
    id: '3',
    name: 'India GST',
    rate: 18,
    type: 'percentage',
    country: 'IN',
    productCategories: ['electronics', 'clothing'],
    enabled: true
  }
];

export default function PaymentGatewayManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockPaymentGateways);
  const [taxRules, setTaxRules] = useState<TaxRule[]>(mockTaxRules);
  const [configDialog, setConfigDialog] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [taxDialog, setTaxDialog] = useState(false);
  const [selectedTaxRule, setSelectedTaxRule] = useState<TaxRule | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleGatewayToggle = (gatewayId: string) => {
    setGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, enabled: !gateway.enabled }
        : gateway
    ));
    enqueueSnackbar('Payment gateway updated', { variant: 'success' });
  };

  const handleConfigureGateway = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    setConfigDialog(true);
  };

  const handleSaveGatewayConfig = () => {
    if (selectedGateway) {
      setGateways(prev => prev.map(gateway => 
        gateway.id === selectedGateway.id 
          ? selectedGateway
          : gateway
      ));
      enqueueSnackbar('Gateway configuration saved', { variant: 'success' });
    }
    setConfigDialog(false);
  };

  const handleTaxRuleToggle = (ruleId: string) => {
    setTaxRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));
    enqueueSnackbar('Tax rule updated', { variant: 'success' });
  };

  const getGatewayIcon = (type: string) => {
    switch (type) {
      case 'stripe': return <CreditCard />;
      case 'paypal': return <AccountBalance />;
      case 'razorpay': return <Wallet />;
      default: return <CreditCard />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Payment & Tax Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Payment Gateways" 
            icon={<CreditCard />} 
            iconPosition="start"
          />
          <Tab 
            label="Tax Configuration" 
            icon={<AccountBalance />} 
            iconPosition="start"
          />
          <Tab 
            label="Security Settings" 
            icon={<Security />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Payment Gateways Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure multiple payment gateways to offer customers flexible payment options. 
              Test mode is enabled by default for all gateways.
            </Alert>
          </Grid>

          {gateways.map((gateway) => (
            <Grid item xs={12} md={6} lg={4} key={gateway.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getGatewayIcon(gateway.type)}
                    <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                      {gateway.name}
                    </Typography>
                    <Chip 
                      label={gateway.status} 
                      color={getStatusColor(gateway.status)}
                      size="small"
                    />
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Supported Currencies
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {gateway.supportedCurrencies.map(currency => (
                          <Chip key={currency} label={currency} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Transaction Fees
                      </Typography>
                      <Typography variant="body2">
                        {gateway.fees.percentage}% + ${gateway.fees.fixed}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={gateway.enabled} 
                            onChange={() => handleGatewayToggle(gateway.id)}
                          />
                        }
                        label="Enabled"
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Settings />}
                        onClick={() => handleConfigureGateway(gateway)}
                      >
                        Configure
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tax Configuration Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Tax Rules</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedTaxRule(null);
                  setTaxDialog(true);
                }}
              >
                Add Tax Rule
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <List>
                {taxRules.map((rule, index) => (
                  <React.Fragment key={rule.id}>
                    <ListItem>
                      <ListItemText
                        primary={rule.name}
                        secondary={
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Chip 
                              label={`${rule.rate}%`} 
                              size="small" 
                              color="primary" 
                            />
                            <Chip 
                              label={rule.country} 
                              size="small" 
                              variant="outlined" 
                            />
                            {rule.region && (
                              <Chip 
                                label={rule.region} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                          </Stack>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack direction="row" spacing={1}>
                          <Switch
                            checked={rule.enabled}
                            onChange={() => handleTaxRuleToggle(rule.id)}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedTaxRule(rule);
                              setTaxDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < taxRules.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Security Settings Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Features
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable PCI DSS Compliance"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Require CVV for Card Payments"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Enable 3D Secure Authentication"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Fraud Detection"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Webhook Security
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Webhook Endpoint URL"
                    defaultValue="https://yoursite.com/api/webhooks/payment"
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Webhook Secret"
                    type="password"
                    defaultValue="your_webhook_secret"
                    fullWidth
                    size="small"
                  />
                  <Button variant="outlined" size="small">
                    Test Webhook
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Gateway Configuration Dialog */}
      <Dialog 
        open={configDialog} 
        onClose={() => setConfigDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure {selectedGateway?.name}
        </DialogTitle>
        <DialogContent>
          {selectedGateway && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={selectedGateway.testMode}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      testMode: e.target.checked
                    })}
                  />
                }
                label="Test Mode"
              />

              {selectedGateway.type === 'stripe' && (
                <>
                  <TextField
                    label="Publishable Key"
                    value={selectedGateway.config.publishableKey || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, publishableKey: e.target.value }
                    })}
                    fullWidth
                  />
                  <TextField
                    label="Secret Key"
                    type="password"
                    value={selectedGateway.config.secretKey || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, secretKey: e.target.value }
                    })}
                    fullWidth
                  />
                  <TextField
                    label="Webhook Secret"
                    type="password"
                    value={selectedGateway.config.webhookSecret || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, webhookSecret: e.target.value }
                    })}
                    fullWidth
                  />
                </>
              )}

              {selectedGateway.type === 'paypal' && (
                <>
                  <TextField
                    label="Client ID"
                    value={selectedGateway.config.clientId || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, clientId: e.target.value }
                    })}
                    fullWidth
                  />
                  <TextField
                    label="Client Secret"
                    type="password"
                    value={selectedGateway.config.clientSecret || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, clientSecret: e.target.value }
                    })}
                    fullWidth
                  />
                </>
              )}

              {selectedGateway.type === 'razorpay' && (
                <>
                  <TextField
                    label="Key ID"
                    value={selectedGateway.config.keyId || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, keyId: e.target.value }
                    })}
                    fullWidth
                  />
                  <TextField
                    label="Key Secret"
                    type="password"
                    value={selectedGateway.config.keySecret || ''}
                    onChange={(e) => setSelectedGateway({
                      ...selectedGateway,
                      config: { ...selectedGateway.config, keySecret: e.target.value }
                    })}
                    fullWidth
                  />
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveGatewayConfig} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
