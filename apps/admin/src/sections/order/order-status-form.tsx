import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Chip,
  TextField,
  Grid,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { updateOrderStatus, updatePaymentStatus, updateShippingStatus } from '@/services/order.service';

interface OrderStatusFormProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    shippingStatus: string;
  };
  onUpdate?: (updatedOrder: any) => void;
}

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'info' },
  { value: 'processing', label: 'Processing', color: 'primary' },
  { value: 'shipped', label: 'Shipped', color: 'secondary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'default' }
] as const;

const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'default' },
  { value: 'partial', label: 'Partial', color: 'info' }
] as const;

const SHIPPING_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'preparing', label: 'Preparing', color: 'info' },
  { value: 'shipped', label: 'Shipped', color: 'primary' },
  { value: 'in_transit', label: 'In Transit', color: 'secondary' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'returned', label: 'Returned', color: 'error' }
] as const;

export default function OrderStatusForm({ order, onUpdate }: OrderStatusFormProps) {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [shippingStatus, setShippingStatus] = useState(order.shippingStatus);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getStatusColor = (status: string, statusList: readonly any[]) => {
    const statusItem = statusList.find(s => s.value === status);
    return statusItem?.color || 'default';
  };

  const handleUpdateOrderStatus = async () => {
    if (orderStatus === order.status) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedOrder = await updateOrderStatus(order.id, orderStatus as any);
      setSuccess('Order status updated successfully');
      onUpdate?.(updatedOrder.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (paymentStatus === order.paymentStatus) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedOrder = await updatePaymentStatus(order.id, paymentStatus as any);
      setSuccess('Payment status updated successfully');
      onUpdate?.(updatedOrder.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShippingStatus = async () => {
    if (shippingStatus === order.shippingStatus && !trackingNumber) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedOrder = await updateShippingStatus(
        order.id, 
        shippingStatus as any, 
        trackingNumber || undefined
      );
      setSuccess('Shipping status updated successfully');
      setTrackingNumber('');
      onUpdate?.(updatedOrder.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update shipping status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order Status Management
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Order #{order.orderNumber}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Order Status */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Order Status
              </Typography>
              <Chip 
                label={ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                color={getStatusColor(order.status, ORDER_STATUSES) as any}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={orderStatus}
                  label="Order Status"
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  {ORDER_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LoadingButton
                variant="contained"
                size="small"
                loading={loading}
                onClick={handleUpdateOrderStatus}
                disabled={orderStatus === order.status}
                fullWidth
              >
                Update Order Status
              </LoadingButton>
            </Box>
          </Grid>

          {/* Payment Status */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Payment Status
              </Typography>
              <Chip 
                label={PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.label || order.paymentStatus}
                color={getStatusColor(order.paymentStatus, PAYMENT_STATUSES) as any}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentStatus}
                  label="Payment Status"
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LoadingButton
                variant="contained"
                size="small"
                loading={loading}
                onClick={handleUpdatePaymentStatus}
                disabled={paymentStatus === order.paymentStatus}
                fullWidth
              >
                Update Payment Status
              </LoadingButton>
            </Box>
          </Grid>

          {/* Shipping Status */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Shipping Status
              </Typography>
              <Chip 
                label={SHIPPING_STATUSES.find(s => s.value === order.shippingStatus)?.label || order.shippingStatus}
                color={getStatusColor(order.shippingStatus, SHIPPING_STATUSES) as any}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Shipping Status</InputLabel>
                <Select
                  value={shippingStatus}
                  label="Shipping Status"
                  onChange={(e) => setShippingStatus(e.target.value)}
                >
                  {SHIPPING_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {(shippingStatus === 'shipped' || shippingStatus === 'in_transit') && (
                <TextField
                  fullWidth
                  size="small"
                  label="Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}

              <LoadingButton
                variant="contained"
                size="small"
                loading={loading}
                onClick={handleUpdateShippingStatus}
                disabled={shippingStatus === order.shippingStatus && !trackingNumber}
                fullWidth
              >
                Update Shipping Status
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
