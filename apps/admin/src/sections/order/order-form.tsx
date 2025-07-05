import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createOrder, updateOrder, OrderFormData } from '@/services/order.service';
import { useGetProducts } from '@/services/product.service';
import { fCurrency } from '@storely/shared/utils/format-number';
import { Iconify } from '@storely/shared/components/iconify';

interface LocalOrderFormData {
  customerId: string;
  status?: string;
  paymentStatus?: string;
  shippingStatus?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    subtotal?: number;
  }>;
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

interface OrderFormProps {
  order?: OrderFormData;
  onSuccess?: (order: any) => void;
  onCancel?: () => void;
}

const orderSchema = yup.object({
  customerId: yup.string().required('Customer is required'),
  status: yup.string().oneOf(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  paymentStatus: yup.string().oneOf(['pending', 'paid', 'failed', 'refunded', 'partial']),
  shippingStatus: yup.string().oneOf(['pending', 'preparing', 'shipped', 'in_transit', 'delivered', 'returned']),
  items: yup.array().of(
    yup.object({
      productId: yup.string().required('Product is required'),
      quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      price: yup.number().min(0, 'Price must be positive').required('Price is required'),
      subtotal: yup.number().min(0, 'Subtotal must be positive')
    })
  ).min(1, 'At least one item is required'),
  subtotal: yup.number().min(0, 'Subtotal must be positive'),
  taxAmount: yup.number().min(0, 'Tax amount must be positive'),
  shippingAmount: yup.number().min(0, 'Shipping amount must be positive'),
  discountAmount: yup.number().min(0, 'Discount amount must be positive'),
  totalAmount: yup.number().min(0, 'Total amount must be positive'),
  shippingAddress: yup.object({
    fullName: yup.string().required('Full name is required'),
    addressLine1: yup.string().required('Address is required'),
    addressLine2: yup.string(),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postalCode: yup.string().required('Postal code is required'),
    country: yup.string().required('Country is required'),
    phone: yup.string()
  }).required('Shipping address is required')
});

export default function OrderForm({ order, onSuccess, onCancel }: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { products } = useGetProducts();
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<any>({
    resolver: yupResolver(orderSchema) as any,
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
  const watchedTaxAmount = watch('taxAmount');
  const watchedShippingAmount = watch('shippingAmount');
  const watchedDiscountAmount = watch('discountAmount');

  // Calculate totals
  useEffect(() => {
    const subtotal = watchedItems.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const total = subtotal + (watchedTaxAmount || 0) + (watchedShippingAmount || 0) - (watchedDiscountAmount || 0);

    setValue('subtotal', subtotal);
    setValue('totalAmount', total);

    // Update individual item subtotals
    watchedItems.forEach((item: any, index: number) => {
      const itemSubtotal = item.quantity * item.price;
      setValue(`items.${index}.subtotal`, itemSubtotal);
    });
  }, [watchedItems, watchedTaxAmount, watchedShippingAmount, watchedDiscountAmount, setValue]);

  const handleProductChange = (index: number, product: any) => {
    if (product) {
      setValue(`items.${index}.productId`, product.id);
      setValue(`items.${index}.price`, product.price || 0);
    }
  };

  const addItem = () => {
    append({ productId: '', quantity: 1, price: 0, subtotal: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (order?.id) {
        result = await updateOrder(order.id, data);
      } else {
        result = await createOrder(data);
      }
      
      onSuccess?.(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  // Helper for safely getting error messages for array fields
  function getItemError(errors: any, index: number, field: string): string | undefined {
    return (errors.items && Array.isArray(errors.items) && errors.items[index] && errors.items[index][field]?.message) || undefined;
  }
  // Helper for safely getting error messages for shippingAddress fields
  function getAddressError(errors: any, field: string): string | undefined {
    return (errors.shippingAddress && typeof errors.shippingAddress === 'object' && 'message' in errors.shippingAddress[field] ? errors.shippingAddress[field].message : undefined);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Order Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {order?.id ? 'Edit Order' : 'Create New Order'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Customer ID"
                        error={!!errors.customerId}
                        helperText={typeof errors.customerId?.message === 'string' ? errors.customerId.message : undefined}
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
                        <InputLabel>Order Status</InputLabel>
                        <Select {...field} label="Order Status">
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
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Order Items</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={addItem}
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
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={products?.find((p: any) => p.id === value) || null}
                                onChange={(_, product) => {
                                  handleProductChange(index, product);
                                }}
                                options={products || []}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select product"
                                    size="small"
                                    error={Boolean(getItemError(errors, index, 'productId'))}
                                    helperText={getItemError(errors, index, 'productId')}
                                  />
                                )}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`items.${index}.quantity`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                inputProps={{ min: 1 }}
                                error={Boolean(getItemError(errors, index, 'quantity'))}
                                helperText={getItemError(errors, index, 'quantity')}
                                sx={{ width: 80 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`items.${index}.price`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                inputProps={{ min: 0, step: 0.01 }}
                                error={Boolean(getItemError(errors, index, 'price'))}
                                helperText={getItemError(errors, index, 'price')}
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

              {/* Order Totals */}
              <Box sx={{ mt: 3, maxWidth: 400, ml: 'auto' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                  <Grid item xs={12}>
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
                </Grid>

                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography variant="h6" color="primary">
                    {fCurrency(watch('totalAmount') || 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Shipping Address */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="shippingAddress.fullName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        error={Boolean(getAddressError(errors, 'fullName'))}
                        helperText={getAddressError(errors, 'fullName')}
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
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Address Line 1"
                        error={Boolean(getAddressError(errors, 'addressLine1'))}
                        helperText={getAddressError(errors, 'addressLine1')}
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
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        error={Boolean(getAddressError(errors, 'city'))}
                        helperText={getAddressError(errors, 'city')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="shippingAddress.state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State"
                        error={Boolean(getAddressError(errors, 'state'))}
                        helperText={getAddressError(errors, 'state')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="shippingAddress.postalCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Postal Code"
                        error={Boolean(getAddressError(errors, 'postalCode'))}
                        helperText={getAddressError(errors, 'postalCode')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="shippingAddress.country"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                        error={Boolean(getAddressError(errors, 'country'))}
                        helperText={getAddressError(errors, 'country')}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Order Notes"
                    multiline
                    rows={3}
                    placeholder="Add any special instructions or notes for this order..."
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
            >
              {order?.id ? 'Update Order' : 'Create Order'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
