'use client';

import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Paper,
  Breadcrumbs,
  Link,
  TextField,
  Chip
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  ArrowForward,
  LocalOffer
} from '@mui/icons-material';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import NextLink from 'next/link';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    getItemCount,
    clearCart 
  } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const subtotal = getTotal();
  const shipping = subtotal > 299 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingBag sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={NextLink}
            href="/products"
            startIcon={<ShoppingBag />}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/" color="inherit" underline="hover">
          Home
        </Link>
        <Typography color="text.primary">Shopping Cart</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          Shopping Cart
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {items.map((item, index) => (
                <Box key={item.id}>
                  <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        SKU: {item.sku}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(item.price)}
                      </Typography>
                    </Box>

                    {/* Quantity Controls */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Chip
                          label={item.quantity}
                          variant="outlined"
                          sx={{ minWidth: 50 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.id)}
                        sx={{ mt: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Cart Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              component={NextLink}
              href="/products"
              startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
            >
              Continue Shopping
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
              startIcon={<Delete />}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Order Summary
              </Typography>

              {/* Promo Code */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Enter promo code"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <Button size="small" sx={{ ml: 1 }}>
                        Apply
                      </Button>
                    )
                  }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({getItemCount()} items)</Typography>
                  <Typography>{formatPrice(subtotal)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography color={shipping === 0 ? 'success.main' : 'inherit'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax</Typography>
                  <Typography>{formatPrice(tax)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(total)}
                </Typography>
              </Box>

              {/* Free Shipping Promo */}
              {shipping > 0 && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.dark">
                    <LocalOffer sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    Add {formatPrice(299 - subtotal)} more for FREE shipping!
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                component={NextLink}
                href="/checkout"
                endIcon={<ArrowForward />}
                sx={{ py: 1.5, mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Secure checkout powered by Stripe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
