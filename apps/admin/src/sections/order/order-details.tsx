import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack
} from '@mui/material';
import { fCurrency } from '@/utils/format-number';
import { fDateTime } from '@/utils/format-time';
import Image from '@/components/image';

interface OrderDetailsProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    shippingStatus: string;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    notes?: string;
    createdAt: string;
    processedAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    shippingAddress?: any;
    billingAddress?: any;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      phone?: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      total: number;
      product: {
        id: string;
        name: string;
        images?: string[];
        sku?: string;
      };
      variant?: {
        id: string;
        name: string;
        value: string;
      };
    }>;
    payments?: Array<{
      id: string;
      amount: number;
      status: string;
      paymentMethod?: string;
      transactionId?: string;
      createdAt: string;
    }>;
  };
}

const getStatusColor = (status: string, type: 'order' | 'payment' | 'shipping') => {
  const statusColors = {
    order: {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'error',
      refunded: 'default'
    },
    payment: {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
      refunded: 'default',
      partial: 'info'
    },
    shipping: {
      pending: 'warning',
      preparing: 'info',
      shipped: 'primary',
      in_transit: 'secondary',
      delivered: 'success',
      returned: 'error'
    }
  };

  return statusColors[type][status as keyof typeof statusColors[typeof type]] || 'default';
};

export default function OrderDetails({ order }: OrderDetailsProps) {
  const formatAddress = (address: any) => {
    if (!address) return 'N/A';
    return `${address.fullName}\n${address.addressLine1}${address.addressLine2 ? '\n' + address.addressLine2 : ''}\n${address.city}, ${address.state} ${address.postalCode}\n${address.country}${address.phone ? '\nPhone: ' + address.phone : ''}`;
  };

  return (
    <Stack spacing={3}>
      {/* Order Summary */}
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Order #{order.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order ID: {order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created: {fDateTime(order.createdAt, undefined)}
              </Typography>
              {order.processedAt && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Processed: {fDateTime(order.processedAt, undefined)}
                </Typography>
              )}
              {order.shippedAt && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Shipped: {fDateTime(order.shippedAt, undefined)}
                </Typography>
              )}
              {order.deliveredAt && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Delivered: {fDateTime(order.deliveredAt, undefined)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  label={order.status}
                  color={getStatusColor(order.status, 'order') as any}
                  size="small"
                />
                <Chip 
                  label={`Payment: ${order.paymentStatus}`}
                  color={getStatusColor(order.paymentStatus, 'payment') as any}
                  size="small"
                />
                <Chip 
                  label={`Shipping: ${order.shippingStatus}`}
                  color={getStatusColor(order.shippingStatus, 'shipping') as any}
                  size="small"
                />
              </Box>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {fCurrency(order.totalAmount)}
              </Typography>
            </Grid>
          </Grid>

          {order.notes && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
                {order.notes}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={order.user.avatar} sx={{ width: 48, height: 48 }}>
              {order.user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{order.user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.user.email}
              </Typography>
              {order.user.phone && (
                <Typography variant="body2" color="text.secondary">
                  {order.user.phone}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Image
                          src={item.product.images?.[0] || '/assets/placeholder.svg'}
                          alt={item.product.name}
                          sx={{ width: 48, height: 48, borderRadius: 1 }}
                        />
                        <Box>
                          <Typography variant="subtitle2">
                            {item.product.name}
                          </Typography>
                          {item.product.sku && (
                            <Typography variant="caption" color="text.secondary">
                              SKU: {item.product.sku}
                            </Typography>
                          )}
                          {item.variant && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {item.variant.name}: {item.variant.value}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {fCurrency(item.price)}
                    </TableCell>
                    <TableCell align="right">
                      {fCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order Summary */}
          <Box sx={{ mt: 3, maxWidth: 300, ml: 'auto' }}>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  {fCurrency(order.subtotal)}
                </Typography>
              </Box>
              {order.discountAmount > 0 && (
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="success.main">Discount</Typography>
                  <Typography variant="body2" color="success.main">
                    -{fCurrency(order.discountAmount)}
                  </Typography>
                </Box>
              )}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">
                  {fCurrency(order.taxAmount)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">
                  {fCurrency(order.shippingAmount)}
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">
                  {fCurrency(order.totalAmount)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Grid container spacing={3}>
        {order.shippingAddress && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                  {formatAddress(order.shippingAddress)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {order.billingAddress && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Billing Address
                </Typography>
                <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                  {formatAddress(order.billingAddress)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Payment History */}
      {order.payments && order.payments.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment History
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Transaction ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{fDateTime(payment.createdAt, undefined)}</TableCell>
                      <TableCell>{fCurrency(payment.amount)}</TableCell>
                      <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status}
                          color={getStatusColor(payment.status, 'payment') as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{payment.transactionId || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
