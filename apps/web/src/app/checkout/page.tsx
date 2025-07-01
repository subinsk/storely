'use client';

import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Breadcrumbs,
  Link
} from '@mui/material';
import { ArrowBack, ArrowForward, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import NextLink from 'next/link';

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    paymentMethod: 'credit_card',
    notes: ''
  });

  const { items, getTotal, clearCart } = useCartStore();
  
  const subtotal = getTotal();
  const shipping = subtotal > 299 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    try {
      // In a real app, this would create the order and process payment
      console.log('Creating order...', { orderData, items, total });
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === 'shippingAddress') {
      setOrderData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/" color="inherit" underline="hover">
          Home
        </Link>
        <Link component={NextLink} href="/cart" color="inherit" underline="hover">
          Cart
        </Link>
        <Typography color="text.primary">Checkout</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          Checkout
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="body2" color="text.secondary">
            Secure SSL encrypted checkout
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Checkout Form */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Shipping Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={orderData.shippingAddress.firstName}
                        onChange={(e) => handleInputChange('shippingAddress', 'firstName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={orderData.shippingAddress.lastName}
                        onChange={(e) => handleInputChange('shippingAddress', 'lastName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={orderData.shippingAddress.email}
                        onChange={(e) => handleInputChange('shippingAddress', 'email', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={orderData.shippingAddress.phone}
                        onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={orderData.shippingAddress.address}
                        onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={orderData.shippingAddress.city}
                        onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="State"
                        value={orderData.shippingAddress.state}
                        onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        value={orderData.shippingAddress.zipCode}
                        onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Payment Method
                  </Typography>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Select Payment Method</FormLabel>
                    <RadioGroup
                      value={orderData.paymentMethod}
                      onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    >
                      <FormControlLabel
                        value="credit_card"
                        control={<Radio />}
                        label="Credit Card"
                      />
                      <FormControlLabel
                        value="paypal"
                        control={<Radio />}
                        label="PayPal"
                      />
                      <FormControlLabel
                        value="apple_pay"
                        control={<Radio />}
                        label="Apple Pay"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Review Your Order
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Please review your order details before completing your purchase.
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Shipping to:</strong><br />
                      {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}<br />
                      {orderData.shippingAddress.address}<br />
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={activeStep === 0 ? () => window.history.back() : handleBack}
                  disabled={activeStep === 0}
                >
                  {activeStep === 0 ? 'Back to Cart' : 'Back'}
                </Button>
                
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={activeStep === steps.length - 1 ? handleSubmitOrder : handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Order Summary
              </Typography>

              {/* Items */}
              <Box sx={{ mb: 3 }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {item.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Totals */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>{formatPrice(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax</Typography>
                  <Typography>{formatPrice(tax)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(total)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
