import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Alert,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { fNumber } from '@/utils/format-number';
import Iconify from '@/components/iconify';

interface InventoryItem {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    images?: string[];
  };
  variant?: {
    id: string;
    name: string;
    value: string;
  };
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  location?: string;
  lastUpdated: string;
}

interface InventoryAdjustment {
  inventoryId: string;
  type: 'add' | 'remove' | 'set';
  quantity: number;
  reason: string;
}

const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    product: {
      id: 'prod1',
      name: 'Modern Sofa Set',
      sku: 'MSS-001',
      images: ['/assets/placeholder.svg']
    },
    quantity: 5,
    reservedQuantity: 2,
    availableQuantity: 3,
    lowStockThreshold: 10,
    location: 'Warehouse A',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    product: {
      id: 'prod2',
      name: 'Dining Table Oak',
      sku: 'DTO-002',
      images: ['/assets/placeholder.svg']
    },
    variant: {
      id: 'var1',
      name: 'Size',
      value: 'Large'
    },
    quantity: 15,
    reservedQuantity: 3,
    availableQuantity: 12,
    lowStockThreshold: 5,
    location: 'Warehouse B',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    product: {
      id: 'prod3',
      name: 'Office Chair Pro',
      sku: 'OCP-003',
      images: ['/assets/placeholder.svg']
    },
    quantity: 2,
    reservedQuantity: 0,
    availableQuantity: 2,
    lowStockThreshold: 8,
    location: 'Warehouse A',
    lastUpdated: new Date().toISOString()
  }
];

export default function InventoryManagement() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<InventoryAdjustment>({
    defaultValues: {
      type: 'add',
      quantity: 1,
      reason: ''
    }
  });

  const adjustmentType = watch('type');

  const handleOpenAdjustment = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentDialog(true);
    reset({
      inventoryId: item.id,
      type: 'add',
      quantity: 1,
      reason: ''
    });
  };

  const handleAdjustInventory = async (data: InventoryAdjustment) => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      
      // Calculate new quantity based on adjustment type
      let newQuantity = selectedItem.quantity;
      if (data.type === 'add') {
        newQuantity += data.quantity;
      } else if (data.type === 'remove') {
        newQuantity = Math.max(0, newQuantity - data.quantity);
      } else if (data.type === 'set') {
        newQuantity = data.quantity;
      }

      // Update the inventory data
      setInventoryData(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              quantity: newQuantity,
              availableQuantity: newQuantity - item.reservedQuantity,
              lastUpdated: new Date().toISOString()
            }
          : item
      ));

      setAdjustmentDialog(false);
      reset();
    } catch (error) {
      console.error('Failed to adjust inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.availableQuantity === 0) {
      return { label: 'Out of Stock', color: 'error' as const };
    } else if (item.availableQuantity <= item.lowStockThreshold) {
      return { label: 'Low Stock', color: 'warning' as const };
    } else {
      return { label: 'In Stock', color: 'success' as const };
    }
  };

  const lowStockItems = inventoryData.filter(item => 
    item.availableQuantity <= item.lowStockThreshold
  );

  return (
    <Box>
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Low Stock Alert: {lowStockItems.length} item(s) need attention
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {lowStockItems.map(item => (
              <Chip
                key={item.id}
                label={`${item.product.name} (${item.availableQuantity} left)`}
                size="small"
                variant="outlined"
              />
            ))}
          </Stack>
        </Alert>
      )}

      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Inventory Management</Typography>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mingcute:download-line" />}
        >
          Export Report
        </Button>
      </Stack>

      {/* Inventory Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Variant</TableCell>
                  <TableCell align="center">Total Stock</TableCell>
                  <TableCell align="center">Reserved</TableCell>
                  <TableCell align="center">Available</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            component="img"
                            src={item.product.images?.[0] || '/assets/placeholder.svg'}
                            sx={{ width: 40, height: 40, borderRadius: 1 }}
                          />
                          <Typography variant="subtitle2">
                            {item.product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {item.variant ? (
                          <Typography variant="body2">
                            {item.variant.name}: {item.variant.value}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {fNumber(item.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="warning.main">
                          {fNumber(item.reservedQuantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography 
                          variant="subtitle2"
                          color={item.availableQuantity > 0 ? 'success.main' : 'error.main'}
                        >
                          {fNumber(item.availableQuantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.location || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Adjust Stock">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenAdjustment(item)}
                          >
                            <Iconify icon="mingcute:edit-line" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Inventory Adjustment Dialog */}
      <Dialog 
        open={adjustmentDialog} 
        onClose={() => setAdjustmentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleAdjustInventory)}>
          <DialogTitle>
            Adjust Inventory: {selectedItem?.product.name}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Current stock: {selectedItem?.quantity} | 
                  Available: {selectedItem?.availableQuantity} | 
                  Reserved: {selectedItem?.reservedQuantity}
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Adjustment Type"
                      SelectProps={{ native: true }}
                    >
                      <option value="add">Add Stock</option>
                      <option value="remove">Remove Stock</option>
                      <option value="set">Set Stock Level</option>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ 
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Quantity must be at least 1' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={
                        adjustmentType === 'set' 
                          ? 'New Stock Level' 
                          : 'Quantity'
                      }
                      type="number"
                      inputProps={{ min: 0 }}
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="reason"
                  control={control}
                  rules={{ required: 'Reason is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Reason"
                      multiline
                      rows={3}
                      placeholder="Enter reason for adjustment..."
                      error={!!errors.reason}
                      helperText={errors.reason?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdjustmentDialog(false)}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
            >
              Apply Adjustment
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
