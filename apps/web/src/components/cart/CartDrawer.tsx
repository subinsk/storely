'use client';

import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Badge,
  Chip,
  CircularProgress,
  Alert,
  ButtonGroup,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Close,
  ShoppingCart,
  Add,
  Remove,
  Delete,
  ArrowForward,
  LocalOffer,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthDialog } from '../auth/AuthDialog';
import { formatPrice } from '../../utils/format';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    cart,
    summary,
    isLoading,
    error,
    updateCartItem,
    removeFromCart,
  } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdating(itemId);
    try {
      await updateCartItem({ itemId, quantity });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    
    onClose();
    router.push('/checkout');
  };

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;

  if (!isAuthenticated) {
    return (
      <>
        <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: { 
              width: { xs: '100%', sm: 450 },
              borderRadius: { xs: 0, sm: '16px 0 0 16px' },
            }
          }}
        >
          <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Shopping Cart</Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Sign in to view your cart
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Please sign in to access your shopping cart and saved items.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>
        
        <AuthDialog
          open={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { 
            width: { xs: '100%', sm: 450 },
            borderRadius: { xs: 0, sm: '16px 0 0 16px' },
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Badge badgeContent={cartItems.length} color="primary">
                  <ShoppingCart color="primary" />
                </Badge>
                <Typography variant="h6" fontWeight="600">
                  Shopping Cart
                </Typography>
              </Stack>
              <IconButton onClick={onClose} size="small">
                <Close />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {error && (
              <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isEmpty ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add some items to get started
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    onClose();
                    router.push('/');
                  }}
                  startIcon={<ArrowForward />}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <Stack spacing={1} sx={{ p: 2 }}>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2}>
                            <CardMedia
                              component="img"
                              image={item.product.images?.[0] || '/assets/placeholder.svg'}
                              alt={item.product.name}
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 1,
                                objectFit: 'cover',
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight="500" gutterBottom>
                                {item.product.name}
                              </Typography>
                              
                              {item.variant && (
                                <Chip
                                  label={item.variant.name}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mb: 1 }}
                                />
                              )}
                              
                              <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6" color="primary.main" fontWeight="600">
                                  {formatPrice(item.price)}
                                </Typography>
                                
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <ButtonGroup size="small" variant="outlined">
                                    <IconButton
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                      disabled={updating === item.id}
                                      size="small"
                                    >
                                      <Remove fontSize="small" />
                                    </IconButton>
                                    <Button
                                      sx={{ 
                                        minWidth: 40, 
                                        cursor: 'default',
                                        '&:hover': { backgroundColor: 'transparent' }
                                      }}
                                      disabled
                                    >
                                      {updating === item.id ? (
                                        <CircularProgress size={16} />
                                      ) : (
                                        item.quantity
                                      )}
                                    </Button>
                                    <IconButton
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                      disabled={updating === item.id}
                                      size="small"
                                    >
                                      <Add fontSize="small" />
                                    </IconButton>
                                  </ButtonGroup>
                                  
                                  <IconButton
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={updating === item.id}
                                    size="small"
                                    color="error"
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Stack>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            )}
          </Box>

          {/* Footer */}
          {!isEmpty && summary && (
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                background: alpha(theme.palette.grey[50], 0.8),
              }}
            >
              <Stack spacing={2}>
                {/* Discount */}
                {summary.discountAmount > 0 && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalOffer color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main">
                      You saved {formatPrice(summary.discountAmount)}
                    </Typography>
                  </Stack>
                )}

                {/* Summary */}
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">{formatPrice(summary.subtotal)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2">
                      {summary.shippingAmount > 0 ? formatPrice(summary.shippingAmount) : 'Free'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">{formatPrice(summary.taxAmount)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="600">Total</Typography>
                    <Typography variant="h6" fontWeight="600" color="primary.main">
                      {formatPrice(summary.totalAmount)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      onClose();
                      router.push('/');
                    }}
                    sx={{ flex: 1 }}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCheckout}
                    sx={{ flex: 1 }}
                    startIcon={<ArrowForward />}
                  >
                    Checkout
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
      </Drawer>
      
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
    </>
  );
};
