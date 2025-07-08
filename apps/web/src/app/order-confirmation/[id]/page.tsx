'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle, ShoppingBag } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { orderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import { formatPrice, formatDate } from '../../../utils/format';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(id as string);
      if (response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      setError('Failed to fetch order details');
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Order not found'}
        </Alert>
        <Button variant="contained" onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your order. We'll send you a confirmation email shortly.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Number: #{order.orderNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order Date: {formatDate(order.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {order.status}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Items Ordered
              </Typography>
              {order.items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box>
                    <Typography variant="body1">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {formatPrice(item.price)}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2">
                    Subtotal
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(order.subtotal)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2">
                    Shipping
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(order.shippingAmount)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2">
                    Tax
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(order.taxAmount)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">
                    Total
                  </Typography>
                  <Typography variant="h6">
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Shipping Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              
              {order.shippingAddress ? (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress.street}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress.country}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No shipping address available
                </Typography>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Estimated Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5-7 business days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          component={Link}
          href="/orders"
          sx={{ mr: 2 }}
        >
          View All Orders
        </Button>
        <Button
          variant="outlined"
          component={Link}
          href="/"
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}
