"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Iconify from '@/components/iconify';
import { enqueueSnackbar } from 'notistack';

// Types
interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  country: string;
  state?: string;
  city?: string;
  zipCode?: string;
  productCategories: string[];
  isActive: boolean;
  isDefault: boolean;
  description?: string;
  createdAt: Date;
}

interface TaxRule {
  id: string;
  name: string;
  conditions: {
    customerLocation: string[];
    productCategories: string[];
    orderValue?: { min?: number; max?: number };
    customerType?: string[];
  };
  taxRates: string[];
  priority: number;
  isActive: boolean;
}

interface TaxClass {
  id: string;
  name: string;
  description: string;
  rates: string[];
  products: number;
  isDefault: boolean;
}

const taxRateSchema = yup.object({
  name: yup.string().required('Tax rate name is required'),
  rate: yup.number().positive('Rate must be positive').required('Rate is required'),
  type: yup.string().oneOf(['percentage', 'fixed']).required('Type is required'),
  country: yup.string().required('Country is required'),
  state: yup.string(),
  city: yup.string(),
  zipCode: yup.string(),
  productCategories: yup.array().of(yup.string()),
  description: yup.string()
});

const taxRuleSchema = yup.object({
  name: yup.string().required('Rule name is required'),
  priority: yup.number().integer().min(1).required('Priority is required'),
  conditions: yup.object({
    customerLocation: yup.array().of(yup.string()).min(1, 'At least one location required'),
    productCategories: yup.array().of(yup.string()),
    orderValue: yup.object({
      min: yup.number().min(0),
      max: yup.number().min(0)
    }),
    customerType: yup.array().of(yup.string())
  }),
  taxRates: yup.array().of(yup.string()).min(1, 'At least one tax rate required')
});

const mockTaxRates: TaxRate[] = [
  {
    id: '1',
    name: 'US Sales Tax',
    rate: 8.5,
    type: 'percentage',
    country: 'US',
    state: 'CA',
    city: 'San Francisco',
    productCategories: ['furniture', 'electronics'],
    isActive: true,
    isDefault: true,
    description: 'Standard sales tax for California',
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'EU VAT',
    rate: 20,
    type: 'percentage',
    country: 'GB',
    productCategories: ['all'],
    isActive: true,
    isDefault: false,
    description: 'UK Value Added Tax',
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Luxury Tax',
    rate: 50,
    type: 'fixed',
    country: 'US',
    productCategories: ['luxury'],
    isActive: true,
    isDefault: false,
    description: 'Fixed luxury tax for high-end items',
    createdAt: new Date()
  }
];

const mockTaxRules: TaxRule[] = [
  {
    id: '1',
    name: 'US Domestic Sales',
    conditions: {
      customerLocation: ['US'],
      productCategories: ['furniture', 'electronics'],
      orderValue: { min: 0 },
      customerType: ['retail']
    },
    taxRates: ['1'],
    priority: 1,
    isActive: true
  },
  {
    id: '2',
    name: 'EU Sales',
    conditions: {
      customerLocation: ['GB', 'DE', 'FR'],
      productCategories: ['all'],
      orderValue: { min: 100 }
    },
    taxRates: ['2'],
    priority: 2,
    isActive: true
  }
];

const mockTaxClasses: TaxClass[] = [
  {
    id: '1',
    name: 'Standard',
    description: 'Standard tax class for most products',
    rates: ['1', '2'],
    products: 245,
    isDefault: true
  },
  {
    id: '2',
    name: 'Luxury',
    description: 'Tax class for luxury items',
    rates: ['3'],
    products: 12,
    isDefault: false
  },
  {
    id: '3',
    name: 'Tax-Free',
    description: 'Tax-exempt products',
    rates: [],
    products: 8,
    isDefault: false
  }
];

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' }
];

const productCategories = [
  'all',
  'furniture',
  'electronics',
  'clothing',
  'books',
  'luxury',
  'digital',
  'services'
];

export default function TaxConfiguration() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(mockTaxRates);
  const [taxRules, setTaxRules] = useState<TaxRule[]>(mockTaxRules);
  const [taxClasses, setTaxClasses] = useState<TaxClass[]>(mockTaxClasses);
  const [activeTab, setActiveTab] = useState(0);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [editingClass, setEditingClass] = useState<TaxClass | null>(null);

  const rateForm = useForm({
    resolver: yupResolver(taxRateSchema),
    defaultValues: {
      name: '',
      rate: 0,
      type: 'percentage' as const,
      country: '',
      state: '',
      city: '',
      zipCode: '',
      productCategories: [],
      description: ''
    }
  });

  const ruleForm = useForm({
    resolver: yupResolver(taxRuleSchema),
    defaultValues: {
      name: '',
      priority: 1,
      conditions: {
        customerLocation: [],
        productCategories: [],
        orderValue: { min: 0, max: undefined },
        customerType: []
      },
      taxRates: []
    }
  });

  const handleCreateRate = async (data: any) => {
    try {
      const newRate: TaxRate = {
        id: Date.now().toString(),
        ...data,
        productCategories: data.productCategories || [],
        isActive: true,
        isDefault: false,
        createdAt: new Date()
      };

      setTaxRates(prev => [...prev, newRate]);
      setIsRateDialogOpen(false);
      rateForm.reset();
      enqueueSnackbar('Tax rate created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create tax rate', { variant: 'error' });
    }
  };

  const handleCreateRule = async (data: any) => {
    try {
      const newRule: TaxRule = {
        id: Date.now().toString(),
        ...data,
        isActive: true
      };

      setTaxRules(prev => [...prev, newRule]);
      setIsRuleDialogOpen(false);
      ruleForm.reset();
      enqueueSnackbar('Tax rule created successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to create tax rule', { variant: 'error' });
    }
  };

  const handleDeleteRate = (id: string) => {
    setTaxRates(prev => prev.filter(rate => rate.id !== id));
    enqueueSnackbar('Tax rate deleted successfully', { variant: 'success' });
  };

  const handleDeleteRule = (id: string) => {
    setTaxRules(prev => prev.filter(rule => rule.id !== id));
    enqueueSnackbar('Tax rule deleted successfully', { variant: 'success' });
  };

  const handleToggleRateStatus = (id: string) => {
    setTaxRates(prev => prev.map(rate => 
      rate.id === id ? { ...rate, isActive: !rate.isActive } : rate
    ));
  };

  const handleToggleRuleStatus = (id: string) => {
    setTaxRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const calculateTaxPreview = (orderValue: number, location: string) => {
    const applicableRules = taxRules
      .filter(rule => rule.isActive && rule.conditions.customerLocation.includes(location))
      .sort((a, b) => a.priority - b.priority);

    let totalTax = 0;
    const appliedRates: Array<{ name: string; rate: number; amount: number }> = [];

    applicableRules.forEach(rule => {
      rule.taxRates.forEach(rateId => {
        const taxRate = taxRates.find(r => r.id === rateId && r.isActive);
        if (taxRate) {
          const amount = taxRate.type === 'percentage' 
            ? (orderValue * taxRate.rate) / 100
            : taxRate.rate;
          totalTax += amount;
          appliedRates.push({
            name: taxRate.name,
            rate: taxRate.rate,
            amount
          });
        }
      });
    });

    return { totalTax, appliedRates };
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Tax Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage tax rates, rules, and classes for your store
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => setIsRateDialogOpen(true)}
        >
          Add Tax Rate
        </Button>
      </Stack>

      {/* Tax Overview */}
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
                  <Iconify icon="eva:percent-outline" width={24} color="primary.main" />
                </Box>
                <Box>
                  <Typography variant="h4">{taxRates.filter(r => r.isActive).length}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Tax Rates</Typography>
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
                  <Iconify icon="eva:settings-2-outline" width={24} color="info.main" />
                </Box>
                <Box>
                  <Typography variant="h4">{taxRules.filter(r => r.isActive).length}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Tax Rules</Typography>
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
                  <Iconify icon="eva:layers-outline" width={24} color="success.main" />
                </Box>
                <Box>
                  <Typography variant="h4">{taxClasses.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Tax Classes</Typography>
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
                  <Iconify icon="eva:globe-outline" width={24} color="warning.main" />
                </Box>
                <Box>
                  <Typography variant="h4">{new Set(taxRates.map(r => r.country)).size}</Typography>
                  <Typography variant="body2" color="text.secondary">Countries Covered</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tax Rates Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-down-fill" />}>
          <Typography variant="h6">Tax Rates</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Configure tax rates for different locations and product categories
            </Typography>
            <Button
              size="small"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setIsRateDialogOpen(true)}
            >
              Add Rate
            </Button>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {rate.name}
                        </Typography>
                        {rate.description && (
                          <Typography variant="caption" color="text.secondary">
                            {rate.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${rate.rate}${rate.type === 'percentage' ? '%' : ' USD'}`}
                        color={rate.type === 'percentage' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {rate.country}
                        {rate.state && `, ${rate.state}`}
                        {rate.city && `, ${rate.city}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {rate.productCategories.slice(0, 2).map((category) => (
                          <Chip key={category} label={category} size="small" variant="outlined" />
                        ))}
                        {rate.productCategories.length > 2 && (
                          <Chip label={`+${rate.productCategories.length - 2}`} size="small" variant="outlined" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rate.isActive}
                        onChange={() => handleToggleRateStatus(rate.id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDeleteRate(rate.id)}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Tax Rules Section */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-down-fill" />}>
          <Typography variant="h6">Tax Rules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Define when and how tax rates are applied
            </Typography>
            <Button
              size="small"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setIsRuleDialogOpen(true)}
            >
              Add Rule
            </Button>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Conditions</TableCell>
                  <TableCell>Tax Rates</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {rule.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={rule.priority} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption">
                          Locations: {rule.conditions.customerLocation.join(', ')}
                        </Typography>
                        {rule.conditions.productCategories.length > 0 && (
                          <Typography variant="caption">
                            Categories: {rule.conditions.productCategories.join(', ')}
                          </Typography>
                        )}
                        {rule.conditions.orderValue?.min && (
                          <Typography variant="caption">
                            Min Order: ${rule.conditions.orderValue.min}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {rule.taxRates.map((rateId) => {
                          const rate = taxRates.find(r => r.id === rateId);
                          return rate ? (
                            <Chip key={rateId} label={rate.name} size="small" variant="outlined" />
                          ) : null;
                        })}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rule.isActive}
                        onChange={() => handleToggleRuleStatus(rule.id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleDeleteRule(rule.id)}>
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Tax Calculator */}
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-down-fill" />}>
          <Typography variant="h6">Tax Calculator</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
            <Typography variant="h6" gutterBottom>
              Tax Preview Calculator
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Order Value"
                  type="number"
                  defaultValue={100}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    const { totalTax, appliedRates } = calculateTaxPreview(value, 'US');
                    // Update preview here
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Customer Location</InputLabel>
                  <Select defaultValue="US" label="Customer Location">
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ pt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Tax: <strong>$8.50</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: <strong>$108.50</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Add Tax Rate Dialog */}
      <Dialog open={isRateDialogOpen} onClose={() => setIsRateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRate ? 'Edit Tax Rate' : 'Add New Tax Rate'}
        </DialogTitle>
        <form onSubmit={rateForm.handleSubmit(handleCreateRate)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={rateForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tax Rate Name"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="rate"
                  control={rateForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Rate"
                      type="number"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="type"
                  control={rateForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select {...field} label="Type">
                        <MenuItem value="percentage">Percentage (%)</MenuItem>
                        <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="country"
                  control={rateForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Country</InputLabel>
                      <Select {...field} label="Country">
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="state"
                  control={rateForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State/Province (Optional)"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="city"
                  control={rateForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City (Optional)"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="zipCode"
                  control={rateForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="ZIP Code (Optional)"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="productCategories"
                  control={rateForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Product Categories</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Product Categories"
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Stack>
                        )}
                      >
                        {productCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={rateForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingRate ? 'Update' : 'Create'} Tax Rate
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Tax Rule Dialog */}
      <Dialog open={isRuleDialogOpen} onClose={() => setIsRuleDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Tax Rule</DialogTitle>
        <form onSubmit={ruleForm.handleSubmit(handleCreateRule)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="name"
                  control={ruleForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Rule Name"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="priority"
                  control={ruleForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Priority"
                      type="number"
                      error={!!error}
                      helperText={error?.message || 'Lower number = higher priority'}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Conditions
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="conditions.customerLocation"
                  control={ruleForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Customer Locations</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Customer Locations"
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Stack>
                        )}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="conditions.productCategories"
                  control={ruleForm.control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Product Categories</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Product Categories"
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Stack>
                        )}
                      >
                        {productCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="conditions.orderValue.min"
                  control={ruleForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Minimum Order Value"
                      type="number"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="conditions.orderValue.max"
                  control={ruleForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Maximum Order Value"
                      type="number"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="taxRates"
                  control={ruleForm.control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Tax Rates to Apply</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Tax Rates to Apply"
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(selected as string[]).map((value) => {
                              const rate = taxRates.find(r => r.id === value);
                              return rate ? (
                                <Chip key={value} label={rate.name} size="small" />
                              ) : null;
                            })}
                          </Stack>
                        )}
                      >
                        {taxRates.filter(r => r.isActive).map((rate) => (
                          <MenuItem key={rate.id} value={rate.id}>
                            {rate.name} ({rate.rate}{rate.type === 'percentage' ? '%' : ' USD'})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRuleDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Tax Rule
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
