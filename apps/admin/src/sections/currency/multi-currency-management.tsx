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
  InputAdornment,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import  Iconify  from '@/components/iconify';
import { useSnackbar } from '@/components/snackbar';
import { ConfirmDialog } from '@/components/custom-dialog';

// ----------------------------------------------------------------------

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  lastUpdated: string;
  autoUpdate: boolean;
}

interface ExchangeRateProvider {
  id: string;
  name: string;
  apiKey: string;
  isActive: boolean;
}

const mockCurrencies: Currency[] = [
  {
    id: '1',
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchangeRate: 1.0,
    isDefault: true,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    autoUpdate: false
  },
  {
    id: '2',
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    exchangeRate: 0.85,
    isDefault: false,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true
  },
  {
    id: '3',
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    exchangeRate: 0.73,
    isDefault: false,
    isActive: true,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true
  },
  {
    id: '4',
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    exchangeRate: 110.0,
    isDefault: false,
    isActive: false,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true
  }
];

const exchangeRateProviders = [
  { id: 'fixer', name: 'Fixer.io', url: 'https://fixer.io' },
  { id: 'openexchange', name: 'Open Exchange Rates', url: 'https://openexchangerates.org' },
  { id: 'currencylayer', name: 'CurrencyLayer', url: 'https://currencylayer.com' },
  { id: 'exchangerate', name: 'ExchangeRate-API', url: 'https://exchangerate-api.com' }
];

// ----------------------------------------------------------------------

export default function MultiCurrencyManagement() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [openDialog, setOpenDialog] = useState(false);
  const [openProviderDialog, setOpenProviderDialog] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(false);
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
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1,
    autoUpdate: true
  });

  const [providerConfig, setProviderConfig] = useState({
    provider: 'fixer',
    apiKey: '',
    updateInterval: 'daily'
  });

  const handleOpenDialog = useCallback((currency?: Currency) => {
    if (currency) {
      setEditingCurrency(currency);
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: currency.exchangeRate,
        autoUpdate: currency.autoUpdate
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: '',
        name: '',
        symbol: '',
        exchangeRate: 1,
        autoUpdate: true
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCurrency(null);
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      if (editingCurrency) {
        setCurrencies(prev => prev.map(currency => 
          currency.id === editingCurrency.id 
            ? { ...currency, ...formData, lastUpdated: new Date().toISOString() }
            : currency
        ));
        enqueueSnackbar('Currency updated successfully', { variant: 'success' });
      } else {
        const newCurrency: Currency = {
          id: Date.now().toString(),
          ...formData,
          isDefault: false,
          isActive: true,
          lastUpdated: new Date().toISOString()
        };
        setCurrencies(prev => [...prev, newCurrency]);
        enqueueSnackbar('Currency added successfully', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Failed to save currency', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editingCurrency, formData, enqueueSnackbar, handleCloseDialog]);

  const handleToggleActive = useCallback((id: string) => {
    setCurrencies(prev => prev.map(currency => 
      currency.id === id 
        ? { ...currency, isActive: !currency.isActive }
        : currency
    ));
    enqueueSnackbar('Currency status updated', { variant: 'success' });
  }, [enqueueSnackbar]);

  const handleSetDefault = useCallback((id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Set Default Currency',
      content: 'Are you sure you want to set this as the default currency? This will affect all pricing and calculations.',
      action: () => {
        setCurrencies(prev => prev.map(currency => ({
          ...currency,
          isDefault: currency.id === id,
          exchangeRate: currency.id === id ? 1.0 : currency.exchangeRate
        })));
        enqueueSnackbar('Default currency updated', { variant: 'success' });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  }, [confirmDialog, enqueueSnackbar]);

  const handleDelete = useCallback((id: string) => {
    const currency = currencies.find(c => c.id === id);
    if (currency?.isDefault) {
      enqueueSnackbar('Cannot delete default currency', { variant: 'error' });
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Delete Currency',
      content: 'Are you sure you want to delete this currency? This action cannot be undone.',
      action: () => {
        setCurrencies(prev => prev.filter(currency => currency.id !== id));
        enqueueSnackbar('Currency deleted successfully', { variant: 'success' });
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  }, [currencies, confirmDialog, enqueueSnackbar]);

  const handleUpdateExchangeRates = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        exchangeRate: currency.isDefault ? 1.0 : currency.exchangeRate * (0.95 + Math.random() * 0.1),
        lastUpdated: new Date().toISOString()
      })));
      
      enqueueSnackbar('Exchange rates updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update exchange rates', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleSaveProviderConfig = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      enqueueSnackbar('Exchange rate provider configured successfully', { variant: 'success' });
      setOpenProviderDialog(false);
    } catch (error) {
      enqueueSnackbar('Failed to configure provider', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Multi-Currency Management</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:settings-2-fill" />}
            onClick={() => setOpenProviderDialog(true)}
          >
            Configure Provider
          </Button>
          <LoadingButton
            variant="outlined"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            loading={loading}
            onClick={handleUpdateExchangeRates}
          >
            Update Rates
          </LoadingButton>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleOpenDialog()}
          >
            Add Currency
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Multi-currency support allows customers to view and pay in their preferred currency. 
              Exchange rates are automatically updated based on your configured provider.
            </Typography>
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Currency</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Exchange Rate</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Auto Update</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currencies.map((currency) => (
                    <TableRow key={currency.id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2">
                            {currency.name}
                          </Typography>
                          {currency.isDefault && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {currency.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">{currency.symbol}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {currency.exchangeRate.toFixed(4)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={currency.isActive ? 'Active' : 'Inactive'}
                          color={currency.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={currency.autoUpdate}
                          onChange={() => {
                            setCurrencies(prev => prev.map(c => 
                              c.id === currency.id 
                                ? { ...c, autoUpdate: !c.autoUpdate }
                                : c
                            ));
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(currency.lastUpdated).toLocaleDateString('en-US')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(currency)}
                            >
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title={currency.isActive ? 'Deactivate' : 'Activate'}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleActive(currency.id)}
                            >
                              <Iconify icon={currency.isActive ? 'eva:eye-off-fill' : 'eva:eye-fill'} />
                            </IconButton>
                          </Tooltip>

                          {!currency.isDefault && (
                            <Tooltip title="Set as Default">
                              <IconButton
                                size="small"
                                onClick={() => handleSetDefault(currency.id)}
                              >
                                <Iconify icon="eva:star-fill" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {!currency.isDefault && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(currency.id)}
                              >
                                <Iconify icon="eva:trash-2-fill" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Currency Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCurrency ? 'Edit Currency' : 'Add New Currency'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Currency Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="USD, EUR, GBP..."
              inputProps={{ maxLength: 3 }}
            />
            
            <TextField
              fullWidth
              label="Currency Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="US Dollar, Euro, British Pound..."
            />
            
            <TextField
              fullWidth
              label="Currency Symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="$, €, £..."
              inputProps={{ maxLength: 3 }}
            />
            
            <TextField
              fullWidth
              label="Exchange Rate"
              type="number"
              value={formData.exchangeRate}
              onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 0 })}
              InputProps={{
                startAdornment: <InputAdornment position="start">1 USD =</InputAdornment>,
                inputProps: { min: 0, step: 0.0001 }
              }}
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Auto Update Exchange Rate
              </Typography>
              <Switch
                checked={formData.autoUpdate}
                onChange={(e) => setFormData({ ...formData, autoUpdate: e.target.checked })}
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Automatically update exchange rates from configured provider
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleSave}
            loading={loading}
          >
            {editingCurrency ? 'Update' : 'Add'} Currency
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Exchange Rate Provider Configuration Dialog */}
      <Dialog open={openProviderDialog} onClose={() => setOpenProviderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Exchange Rate Provider</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                value={providerConfig.provider}
                label="Provider"
                onChange={(e) => setProviderConfig({ ...providerConfig, provider: e.target.value })}
              >
                {exchangeRateProviders.map((provider) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={providerConfig.apiKey}
              onChange={(e) => setProviderConfig({ ...providerConfig, apiKey: e.target.value })}
              placeholder="Enter your API key"
            />
            
            <FormControl fullWidth>
              <InputLabel>Update Interval</InputLabel>
              <Select
                value={providerConfig.updateInterval}
                label="Update Interval"
                onChange={(e) => setProviderConfig({ ...providerConfig, updateInterval: e.target.value })}
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProviderDialog(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleSaveProviderConfig}
            loading={loading}
          >
            Save Configuration
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
