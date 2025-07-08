'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  Tabs,
  Tab,
  ButtonGroup,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Avatar,
  Skeleton,
  alpha,
  useTheme,
  Fade,
  Grow,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Add,
  Remove,
  Home,
  Star,
  Security,
  LocalShipping,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useGetProduct } from '../../services/product.service';
import { Product, ProductVariant } from '../../types/product';
import { formatPrice } from '../../utils/format';
import { ProductCardSkeleton } from '../../components/ui/loading-skeletons';
import { AuthDialog } from '../../components/auth/AuthDialog';

interface ProductViewProps {
  slug: string;
}

export default function ProductView({ slug }: ProductViewProps) {
  const theme = useTheme();
  const { organization } = useOrganization();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { product: productData, productLoading, productError } = useGetProduct({ slug });
  const product = productData;

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      
      const success = await addToCart({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      });
      
      if (success) {
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    if (selectedVariant && selectedVariant.price) {
      return product.price + selectedVariant.price;
    }
    return product.price;
  };

  const getComparePrice = () => {
    if (!product?.mrp) return null;
    if (selectedVariant && selectedVariant.price) {
      return product.mrp + selectedVariant.price;
    }
    return product.mrp;
  };

  if (productLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="100%" height={80} />
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={56} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (productError || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  const productImages = product.images || (product.imageUrl ? [product.imageUrl] : ['/assets/placeholder.svg']);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            {product.category && (
              <Link href={`/category/${product.category.slug}`} color="inherit">
                {product.category.name}
              </Link>
            )}
            <Typography color="text.primary">{product.name}</Typography>
          </Breadcrumbs>
        </motion.div>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="500"
                    image={productImages[selectedImage]}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Card>
                
                {productImages.length > 1 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {productImages.map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            opacity: selectedImage === index ? 1 : 0.7,
                            border: selectedImage === index ? 2 : 1,
                            borderColor: selectedImage === index ? 'primary.main' : alpha(theme.palette.grey[500], 0.12),
                            borderRadius: 1,
                            overflow: 'hidden',
                            transition: 'all 0.2s ease-in-out',
                          }}
                          onClick={() => setSelectedImage(index)}
                        >
                          <CardMedia
                            component="img"
                            width="80"
                            height="80"
                            image={image}
                            alt={`${product.name} ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </motion.div>
                    ))}
                  </Stack>
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Stack spacing={3}>
                <Typography variant="h4" gutterBottom>
                  {product.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {product.averageRating && (
                  <>
                    <Rating 
                      value={product.averageRating} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {product.averageRating.toFixed(1)}/5 ({product.reviewCount || 0} reviews)
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" color="primary" component="span">
                  {formatPrice(getCurrentPrice())}
                </Typography>
                {getComparePrice() && (
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'line-through', ml: 2, color: 'text.secondary' }}
                    component="span"
                  >
                    {formatPrice(getComparePrice()!)}
                  </Typography>
                )}
              </Box>

              {product.description && (
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {product.description}
                </Typography>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Options
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {product.variants.map((variant: ProductVariant) => (
                      <Chip
                        key={variant.id}
                        label={`${variant.name}: ${variant.value}`}
                        onClick={() => setSelectedVariant(variant)}
                        color={selectedVariant?.id === variant.id ? 'primary' : 'default'}
                        variant={selectedVariant?.id === variant.id ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="body1">Quantity:</Typography>
                  <ButtonGroup>
                    <IconButton
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <Box sx={{ px: 2, py: 1, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                      <Typography>{quantity}</Typography>
                    </Box>
                    <IconButton
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.quantity}
                    >
                      <Add />
                    </IconButton>
                  </ButtonGroup>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.status !== 'active'}
                    sx={{ flex: 1 }}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  
                  <IconButton>
                    <FavoriteBorder />
                  </IconButton>
                  
                  <IconButton>
                    <Share />
                  </IconButton>
                </Stack>
              </Box>

              {/* Product Info */}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.quantity} available
                </Typography>
              </Box>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Shipping & Returns" />
          </Tabs>

          {/* Description Tab */}
          {tabValue === 0 && (
            <Box sx={{ py: 3 }}>
              <Typography variant="body1">
                {product.description || 'No description available.'}
              </Typography>
            </Box>
          )}

          {/* Specifications Tab */}
          {tabValue === 1 && (
            <Box sx={{ py: 3 }}>
              {product.specifications ? (
                <Grid container spacing={2}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, border: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {key}:
                        </Typography>
                        <Typography variant="body2">
                          {String(value)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1">
                  No specifications available.
                </Typography>
              )}
            </Box>
          )}

          {/* Shipping & Returns Tab */}
          {tabValue === 2 && (
            <Box sx={{ py: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body1" paragraph>
                Free shipping on orders over $50. Standard delivery takes 3-5 business days.
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Returns Policy
              </Typography>
              <Typography variant="body1">
                30-day return policy. Items must be in original condition with tags attached.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
    </>
  );
}
