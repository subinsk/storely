import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { createOrder, updateOrder } from '@/services/order.service';
import { useGetProducts } from '@/services/product.service';
import { useGetCustomers } from '@/services/customer.service';
import { fCurrency } from '@storely/shared/utils/format-number';
import { Iconify } from '@storely/shared/components/iconify';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface SimpleOrderFormData {
  customerId: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  notes?: string;
}

interface OrderFormSimpleProps {
  order?: any;
  onSuccess?: (order: any) => void;
  onCancel?: () => void;
}

export default function OrderFormSimple({ order, onSuccess, onCancel }: OrderFormSimpleProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { products } = useGetProducts();
  const { customers } = useGetCustomers();
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SimpleOrderFormData>({
    defaultValues: order || {
      customerId: '',
      status: 'pending',
      paymentStatus: 'pending',
      shippingStatus: 'pending',
      items: [{ productId: '', quantity: 1, price: 0, subtotal: 0 }],
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      shippingAddress: {
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
      },
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedTaxAmount = watch('taxAmount') || 0;
  const watchedShippingAmount = watch('shippingAmount') || 0;
  const watchedDiscountAmount = watch('discountAmount') || 0;

  // Calculate totals
  React.useEffect(() => {
    const subtotal = watchedItems.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.price);
    }, 0);

    setValue('subtotal', subtotal);

    // Update subtotal for each item
    watchedItems.forEach((item: any, index: number) => {
      setValue(`items.${index}.subtotal`, item.quantity * item.price);
    });

    const total = subtotal + watchedTaxAmount + watchedShippingAmount - watchedDiscountAmount;
    setValue('totalAmount', total);
  }, [watchedItems, watchedTaxAmount, watchedShippingAmount, watchedDiscountAmount, setValue]);

  const addItem = () => {
    append({ productId: '', quantity: 1, price: 0, subtotal: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleProductChange = (index: number, product: any) => {
    if (product) {
      setValue(`items.${index}.productId`, product.id);
      setValue(`items.${index}.price`, product.price || 0);
    }
  };

  const onSubmit = async (data: SimpleOrderFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Transform data to match API expectations
      const orderData = {
        ...data,
        status: data.status as any,
        paymentStatus: data.paymentStatus as any,
        shippingStatus: data.shippingStatus as any,
        items: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      let result;
      if (order?.id) {
        result = await updateOrder(order.id, orderData as any);
      } else {
        result = await createOrder(orderData as any);
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Order Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="customerId"
                  control={control}
                  rules={{ required: 'Customer is required' }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={customers?.find((c: any) => c.id === value) || null}
                      onChange={(_, customer) => {
                        onChange(customer?.id || '');
                      }}
                      options={customers || []}
                      getOptionLabel={(option: any) => `${option.name} (${option.email})`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer"
                          error={!!errors.customerId}
                          helperText={errors.customerId?.message}
                        />
                      )}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="refunded">Refunded</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="paymentStatus"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Payment Status</InputLabel>
                      <Select {...field} label="Payment Status">
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="failed">Failed</MenuItem>
                        <MenuItem value="refunded">Refunded</MenuItem>
                        <MenuItem value="partial">Partial</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="shippingStatus"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Shipping Status</InputLabel>
                      <Select {...field} label="Shipping Status">
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="preparing">Preparing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="in_transit">In Transit</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="returned">Returned</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Order Items</Typography>
              <Button
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={addItem}
                variant="outlined"
              >
                Add Item
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`items.${index}.productId`}
                          control={control}
                          rules={{ required: 'Product is required' }}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              value={products?.find((p: any) => p.id === value) || null}
                              onChange={(_, product) => {
                                handleProductChange(index, product);
                              }}
                              options={products || []}
                              getOptionLabel={(option: any) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select product"
                                  size="small"
                                  error={!!errors.items?.[index]?.productId}
                                />
                              )}
                              fullWidth
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`items.${index}.quantity`}
                          control={control}
                          rules={{ required: 'Quantity is required', min: 1 }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              inputProps={{ min: 1 }}
                              error={!!errors.items?.[index]?.quantity}
                              sx={{ width: 80 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`items.${index}.price`}
                          control={control}
                          rules={{ required: 'Price is required', min: 0 }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              inputProps={{ min: 0, step: 0.01 }}
                              error={!!errors.items?.[index]?.price}
                              sx={{ width: 100 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {fCurrency(watchedItems[index]?.quantity * watchedItems[index]?.price || 0)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => removeItem(index)}
                          disabled={fields.length === 1}
                          color="error"
                          size="small"
                        >
                          <Iconify icon="mingcute:delete-2-line" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Order Totals */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Totals
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="taxAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tax Amount"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="shippingAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Shipping Amount"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="discountAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Discount Amount"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  value={fCurrency(watch('totalAmount') || 0)}
                  disabled
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="shippingAddress.fullName"
                  control={control}
                  rules={{ required: 'Full name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      error={!!errors.shippingAddress?.fullName}
                      helperText={errors.shippingAddress?.fullName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="shippingAddress.phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="shippingAddress.addressLine1"
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address Line 1"
                      error={!!errors.shippingAddress?.addressLine1}
                      helperText={errors.shippingAddress?.addressLine1?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="shippingAddress.addressLine2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address Line 2 (Optional)"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="shippingAddress.city"
                  control={control}
                  rules={{ required: 'City is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="City"
                      error={!!errors.shippingAddress?.city}
                      helperText={errors.shippingAddress?.city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="shippingAddress.state"
                  control={control}
                  rules={{ required: 'State is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="State"
                      error={!!errors.shippingAddress?.state}
                      helperText={errors.shippingAddress?.state?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="shippingAddress.postalCode"
                  control={control}
                  rules={{ required: 'Postal code is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Postal Code"
                      error={!!errors.shippingAddress?.postalCode}
                      helperText={errors.shippingAddress?.postalCode?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="shippingAddress.country"
                  control={control}
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Country"
                      error={!!errors.shippingAddress?.country}
                      helperText={errors.shippingAddress?.country?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Order Notes"
                  placeholder="Add any additional notes about this order..."
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          {onCancel && (
            <Button onClick={onCancel} variant="outlined">
              Cancel
            </Button>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
          >
            {order?.id ? 'Update Order' : 'Create Order'}
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
}
