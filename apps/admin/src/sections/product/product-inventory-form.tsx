"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Stack,
  Chip,
  LinearProgress,
  Grid,
  InputAdornment,
} from '@mui/material';
import { useController, Control } from 'react-hook-form';
import { Iconify } from '@storely/shared/components/iconify';

// ----------------------------------------------------------------------

interface InventoryFormProps {
  control: Control<any>;
  watch: any;
}

export default function ProductInventoryForm({ control, watch }: InventoryFormProps) {
  const trackQuantity = watch('trackQuantity', true);
  const quantity = watch('quantity', 0);
  const lowStockAlert = watch('lowStockAlert', 10);

  const {
    field: { value: trackQuantityValue, onChange: onTrackQuantityChange },
  } = useController({
    name: 'trackQuantity',
    control,
    defaultValue: true,
  });

  const getStockStatus = () => {
    if (!trackQuantity) return { status: 'not-tracked', color: 'default', label: 'Not Tracked' };
    if (quantity === 0) return { status: 'out-of-stock', color: 'error', label: 'Out of Stock' };
    if (quantity <= lowStockAlert) return { status: 'low-stock', color: 'warning', label: 'Low Stock' };
    return { status: 'in-stock', color: 'success', label: 'In Stock' };
  };

  const stockStatus = getStockStatus();
  const stockPercentage = lowStockAlert > 0 ? Math.min((quantity / (lowStockAlert * 2)) * 100, 100) : 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Inventory Management
        </Typography>

        <Stack spacing={3}>
          {/* Track Quantity Toggle */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={trackQuantityValue}
                  onChange={(e) => onTrackQuantityChange(e.target.checked)}
                />
              }
              label="Track inventory quantity"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Enable this to track stock levels and get low stock alerts
            </Typography>
          </Box>

          {trackQuantity && (
            <>
              {/* Current Stock Status */}
              <Card variant="outlined" sx={{ bgcolor: 'background.neutral' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Iconify 
                          icon={
                            stockStatus.status === 'out-of-stock' ? 'eva:alert-circle-fill' :
                            stockStatus.status === 'low-stock' ? 'eva:alert-triangle-fill' :
                            'eva:checkmark-circle-fill'
                          }
                          sx={{ 
                            color: `${stockStatus.color}.main`,
                            width: 20,
                            height: 20 
                          }}
                        />
                        <Typography variant="subtitle2">
                          Stock Status
                        </Typography>
                      </Stack>
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        {quantity} units
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={stockPercentage}
                          color={stockStatus.color as any}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    </Box>
                    <Chip
                      label={stockStatus.label}
                      color={stockStatus.color as any}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Inventory Fields */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Current Stock"
                    placeholder="0"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:cube-outline" />
                        </InputAdornment>
                      ),
                    }}
                    {...control.register('quantity', { 
                      valueAsNumber: true,
                      min: 0 
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Low Stock Alert"
                    placeholder="10"
                    helperText="Get notified when stock falls below this level"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:bell-outline" />
                        </InputAdornment>
                      ),
                    }}
                    {...control.register('lowStockAlert', { 
                      valueAsNumber: true,
                      min: 0 
                    })}
                  />
                </Grid>
              </Grid>

              {/* Stock Alerts */}
              {quantity === 0 && (
                <Alert severity="error" icon={<Iconify icon="eva:alert-circle-fill" />}>
                  This product is out of stock and won&apos;t be available for purchase
                </Alert>
              )}

              {quantity > 0 && quantity <= lowStockAlert && (
                <Alert severity="warning" icon={<Iconify icon="eva:alert-triangle-fill" />}>
                  Stock is running low. Consider restocking soon.
                </Alert>
              )}

              {/* Product Dimensions & Weight */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Physical Properties
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Weight (kg)"
                      placeholder="0.0"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="eva:car-outline" />
                          </InputAdornment>
                        ),
                      }}
                      {...control.register('weight', { valueAsNumber: true })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Dimensions"
                      placeholder="L x W x H (cm)"
                      helperText="Format: Length x Width x Height"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="eva:cube-outline" />
                          </InputAdornment>
                        ),
                      }}
                      {...control.register('dimensions')}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}

          {!trackQuantity && (
            <Alert severity="info" icon={<Iconify icon="eva:info-fill" />}>
              Inventory tracking is disabled. This product will always be available for purchase.
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
