"use client";

import React, { useState } from 'react';
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
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import {
  LocalShipping,
  Public,
  Speed,
  Add,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  MonetizationOn
} from '@mui/icons-material';
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

interface ShippingZone {
  id: string;
  name: string;
  description: string;
  countries: string[];
  regions: string[];
  enabled: boolean;
  priority: number;
}

interface ShippingMethod {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  type: 'fixed' | 'weight_based' | 'price_based' | 'free';
  baseRate: number;
  weightRates: Array<{ minWeight: number; maxWeight: number; rate: number }>;
  priceRates: Array<{ minPrice: number; maxPrice: number; rate: number }>;
  freeThreshold?: number;
  estimatedDays: { min: number; max: number };
  enabled: boolean;
  carrier?: 'ups' | 'fedex' | 'dhl' | 'usps' | 'custom';
}

interface Carrier {
  id: string;
  name: string;
  type: 'ups' | 'fedex' | 'dhl' | 'usps' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
  supportedServices: string[];
  trackingUrl: string;
}

const mockShippingZones: ShippingZone[] = [
  {
    id: '1',
    name: 'Domestic',
    description: 'Shipping within the country',
    countries: ['US'],
    regions: ['All States'],
    enabled: true,
    priority: 1
  },
  {
    id: '2',
    name: 'International',
    description: 'International shipping',
    countries: ['CA', 'GB', 'AU', 'DE', 'FR'],
    regions: [],
    enabled: true,
    priority: 2
  },
  {
    id: '3',
    name: 'Local Delivery',
    description: 'Same-day local delivery',
    countries: ['US'],
    regions: ['CA', 'NY', 'TX'],
    enabled: true,
    priority: 0
  }
];

const mockShippingMethods: ShippingMethod[] = [
  {
    id: '1',
    zoneId: '1',
    name: 'Standard Shipping',
    description: 'Regular delivery within 5-7 business days',
    type: 'weight_based',
    baseRate: 5.99,
    weightRates: [
      { minWeight: 0, maxWeight: 1, rate: 5.99 },
      { minWeight: 1, maxWeight: 5, rate: 9.99 },
      { minWeight: 5, maxWeight: 10, rate: 14.99 }
    ],
    priceRates: [],
    estimatedDays: { min: 5, max: 7 },
    enabled: true,
    carrier: 'usps'
  },
  {
    id: '2',
    zoneId: '1',
    name: 'Express Shipping',
    description: 'Fast delivery within 2-3 business days',
    type: 'fixed',
    baseRate: 19.99,
    weightRates: [],
    priceRates: [],
    estimatedDays: { min: 2, max: 3 },
    enabled: true,
    carrier: 'fedex'
  },
  {
    id: '3',
    zoneId: '1',
    name: 'Free Shipping',
    description: 'Free shipping on orders over $50',
    type: 'free',
    baseRate: 0,
    weightRates: [],
    priceRates: [],
    freeThreshold: 50,
    estimatedDays: { min: 5, max: 10 },
    enabled: true
  }
];

const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'UPS',
    type: 'ups',
    enabled: true,
    config: {
      accountNumber: '',
      accessKey: '',
      username: '',
      password: ''
    },
    supportedServices: ['Ground', 'Next Day Air', '2nd Day Air'],
    trackingUrl: 'https://www.ups.com/track?tracknum='
  },
  {
    id: '2',
    name: 'FedEx',
    type: 'fedex',
    enabled: false,
    config: {
      accountNumber: '',
      meterNumber: '',
      key: '',
      password: ''
    },
    supportedServices: ['Ground', 'Express', 'Overnight'],
    trackingUrl: 'https://www.fedex.com/apps/fedextrack/?tracknumbers='
  },
  {
    id: '3',
    name: 'DHL',
    type: 'dhl',
    enabled: false,
    config: {
      siteId: '',
      password: '',
      accountNumber: ''
    },
    supportedServices: ['Express', 'Economy'],
    trackingUrl: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id='
  }
];

export default function ShippingConfiguration() {
  const [tabValue, setTabValue] = useState(0);
  const [zones, setZones] = useState<ShippingZone[]>(mockShippingZones);
  const [methods, setMethods] = useState<ShippingMethod[]>(mockShippingMethods);
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [zoneDialog, setZoneDialog] = useState(false);
  const [methodDialog, setMethodDialog] = useState(false);
  const [carrierDialog, setCarrierDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleZoneToggle = (zoneId: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { ...zone, enabled: !zone.enabled }
        : zone
    ));
    enqueueSnackbar('Shipping zone updated', { variant: 'success' });
  };

  const handleMethodToggle = (methodId: string) => {
    setMethods(prev => prev.map(method => 
      method.id === methodId 
        ? { ...method, enabled: !method.enabled }
        : method
    ));
    enqueueSnackbar('Shipping method updated', { variant: 'success' });
  };

  const handleCarrierToggle = (carrierId: string) => {
    setCarriers(prev => prev.map(carrier => 
      carrier.id === carrierId 
        ? { ...carrier, enabled: !carrier.enabled }
        : carrier
    ));
    enqueueSnackbar('Carrier updated', { variant: 'success' });
  };

  const getMethodsByZone = (zoneId: string) => {
    return methods.filter(method => method.zoneId === zoneId);
  };

  const getCarrierIcon = (type: string) => {
    switch (type) {
      case 'ups': return '📦';
      case 'fedex': return '✈️';
      case 'dhl': return '🚚';
      case 'usps': return '📬';
      default: return '🚛';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Shipping Configuration
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Shipping Zones" 
            icon={<Public />} 
            iconPosition="start"
          />
          <Tab 
            label="Shipping Methods" 
            icon={<LocalShipping />} 
            iconPosition="start"
          />
          <Tab 
            label="Carriers" 
            icon={<Speed />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Shipping Zones Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Shipping Zones</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedZone(null);
                  setZoneDialog(true);
                }}
              >
                Add Zone
              </Button>
            </Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Define geographical zones for different shipping rates and methods. 
              Higher priority zones will be matched first.
            </Alert>
          </Grid>

          {zones.map((zone) => (
            <Grid item xs={12} md={6} lg={4} key={zone.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn color="primary" />
                    <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                      {zone.name}
                    </Typography>
                    <Chip 
                      label={`Priority ${zone.priority}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {zone.description}
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Countries: {zone.countries.join(', ')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Methods: {getMethodsByZone(zone.id).length}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={zone.enabled} 
                            onChange={() => handleZoneToggle(zone.id)}
                          />
                        }
                        label="Enabled"
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedZone(zone);
                          setZoneDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Shipping Methods Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Shipping Methods</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedMethod(null);
                  setMethodDialog(true);
                }}
              >
                Add Method
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Method Name</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Base Rate</TableCell>
                    <TableCell>Delivery Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {methods.map((method) => {
                    const zone = zones.find(z => z.id === method.zoneId);
                    return (
                      <TableRow key={method.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {method.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{zone?.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={method.type.replace('_', ' ')} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {method.type === 'free' ? 'Free' : `$${method.baseRate}`}
                          {method.freeThreshold && (
                            <Typography variant="caption" display="block">
                              (Orders over ${method.freeThreshold})
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {method.estimatedDays.min}-{method.estimatedDays.max} days
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={method.enabled}
                            onChange={() => handleMethodToggle(method.id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMethod(method);
                              setMethodDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Carriers Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Shipping Carriers
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configure shipping carriers for automatic rate calculation and tracking integration.
            </Alert>
          </Grid>

          {carriers.map((carrier) => (
            <Grid item xs={12} md={6} key={carrier.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ mr: 1, fontSize: '1.5rem' }}>
                      {getCarrierIcon(carrier.type)}
                    </Typography>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                      {carrier.name}
                    </Typography>
                    <Chip 
                      label={carrier.enabled ? 'Active' : 'Inactive'} 
                      color={carrier.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Supported Services
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                        {carrier.supportedServices.map(service => (
                          <Chip key={service} label={service} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={carrier.enabled} 
                            onChange={() => handleCarrierToggle(carrier.id)}
                          />
                        }
                        label="Enabled"
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => {
                          setSelectedCarrier(carrier);
                          setCarrierDialog(true);
                        }}
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

      {/* Zone Configuration Dialog */}
      <Dialog 
        open={zoneDialog} 
        onClose={() => setZoneDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedZone ? 'Edit' : 'Add'} Shipping Zone
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Zone Name"
                defaultValue={selectedZone?.name || ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                defaultValue={selectedZone?.description || ''}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Countries</InputLabel>
                <Select
                  multiple
                  defaultValue={selectedZone?.countries || []}
                  label="Countries"
                >
                  <MenuItem value="US">United States</MenuItem>
                  <MenuItem value="CA">Canada</MenuItem>
                  <MenuItem value="GB">United Kingdom</MenuItem>
                  <MenuItem value="AU">Australia</MenuItem>
                  <MenuItem value="DE">Germany</MenuItem>
                  <MenuItem value="FR">France</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Priority"
                type="number"
                defaultValue={selectedZone?.priority || 1}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setZoneDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            {selectedZone ? 'Update' : 'Create'} Zone
          </Button>
        </DialogActions>
      </Dialog>

      {/* Method Configuration Dialog */}
      <Dialog 
        open={methodDialog} 
        onClose={() => setMethodDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMethod ? 'Edit' : 'Add'} Shipping Method
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Method Name"
                defaultValue={selectedMethod?.name || ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Zone</InputLabel>
                <Select
                  defaultValue={selectedMethod?.zoneId || ''}
                  label="Zone"
                >
                  {zones.map(zone => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                defaultValue={selectedMethod?.description || ''}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pricing Type</InputLabel>
                <Select
                  defaultValue={selectedMethod?.type || 'fixed'}
                  label="Pricing Type"
                >
                  <MenuItem value="fixed">Fixed Rate</MenuItem>
                  <MenuItem value="weight_based">Weight Based</MenuItem>
                  <MenuItem value="price_based">Price Based</MenuItem>
                  <MenuItem value="free">Free Shipping</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Base Rate ($)"
                type="number"
                defaultValue={selectedMethod?.baseRate || 0}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Min Delivery Days"
                type="number"
                defaultValue={selectedMethod?.estimatedDays.min || 1}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Max Delivery Days"
                type="number"
                defaultValue={selectedMethod?.estimatedDays.max || 7}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMethodDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            {selectedMethod ? 'Update' : 'Create'} Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* Carrier Configuration Dialog */}
      <Dialog 
        open={carrierDialog} 
        onClose={() => setCarrierDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure {selectedCarrier?.name}
        </DialogTitle>
        <DialogContent>
          {selectedCarrier && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {selectedCarrier.type === 'ups' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Account Number"
                      defaultValue={selectedCarrier.config.accountNumber || ''}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Access Key"
                      type="password"
                      defaultValue={selectedCarrier.config.accessKey || ''}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Username"
                      defaultValue={selectedCarrier.config.username || ''}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Password"
                      type="password"
                      defaultValue={selectedCarrier.config.password || ''}
                      fullWidth
                    />
                  </Grid>
                </>
              )}

              {selectedCarrier.type === 'fedex' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Account Number"
                      defaultValue={selectedCarrier.config.accountNumber || ''}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Meter Number"
                      defaultValue={selectedCarrier.config.meterNumber || ''}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Key"
                      type="password"
                      defaultValue={selectedCarrier.config.key || ''}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Password"
                      type="password"
                      defaultValue={selectedCarrier.config.password || ''}
                      fullWidth
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Alert severity="info">
                  These credentials will be used for live rate calculation and tracking integration.
                  Make sure to test the configuration before going live.
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCarrierDialog(false)}>
            Cancel
          </Button>
          <Button variant="outlined" sx={{ mr: 1 }}>
            Test Connection
          </Button>
          <Button variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
