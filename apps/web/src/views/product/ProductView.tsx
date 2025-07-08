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
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
  Tabs,
  Tab,
  TextField,
  ButtonGroup,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Add,
  Remove,
  Star,
  Home,
} from '@mui/icons-material';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { productService } from '../../services/product.service';
import { reviewService } from '../../services/review.service';
import { wishlistService } from '../../services/wishlist.service';
import { Product, ProductVariant } from '../../types/product';
import { Review, CreateReviewRequest } from '../../types/review';
import { formatPrice, formatRating } from '../../utils/format';
import { LoadingSkeleton } from '../../components/ui/loading-skeletons';
import { AuthDialog } from '../../components/auth/AuthDialog';

interface ProductViewProps {
  slug: string;
}

export default function ProductView({ slug }: ProductViewProps) {
  const { organization } = useOrganization();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [newReview, setNewReview] = useState<CreateReviewRequest>({
    productId: '',
    content: '',
    rating: 5,
  });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (slug && organization) {
      fetchProduct();
    }
  }, [slug, organization]);

  useEffect(() => {
    if (product) {
      fetchReviews();
      fetchReviewSummary();
      if (isAuthenticated) {
        checkWishlistStatus();
      }
    }
  }, [product, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductBySlug(slug, organization!.id);
      
      if (response.success && response.data) {
        setProduct(response.data);
        setNewReview(prev => ({ ...prev, productId: response.data.id }));
        
        // Set default variant if available
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
      } else {
        setError(response.error || 'Product not found');
      }
    } catch (error) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getProductReviews(product!.id, {
        page: 1,
        limit: 10,
      });
      
      if (response.success && response.data) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const fetchReviewSummary = async () => {
    try {
      const response = await reviewService.getReviewSummary(product!.id);
      
      if (response.success && response.data) {
        setReviewSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch review summary:', error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistService.isInWishlist(product!.id);
      
      if (response.success && response.data !== undefined) {
        setIsInWishlist(response.data);
      }
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    try {
      setAddingToCart(true);
      
      const success = await addToCart({
        productId: product!.id,
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

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist logic
        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist({ productId: product!.id });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    try {
      setSubmittingReview(true);
      
      const response = await reviewService.createReview(newReview);
      
      if (response.success) {
        setNewReview({ productId: product!.id, content: '', rating: 5 });
        fetchReviews();
        fetchReviewSummary();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant && selectedVariant.price) {
      return product!.price + selectedVariant.price;
    }
    return product!.price;
  };

  const getComparePrice = () => {
    if (selectedVariant && selectedVariant.comparePrice) {
      return product!.comparePrice ? product!.comparePrice + selectedVariant.comparePrice : null;
    }
    return product!.comparePrice;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSkeleton type="product-detail" />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link href={`/category/${product.category.slug}`} color="inherit">
            {product.category.name}
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box>
              <Card>
                <CardMedia
                  component="img"
                  height="400"
                  image={product.images[selectedImage] || '/assets/placeholder.svg'}
                  alt={product.name}
                />
              </Card>
              
              {product.images.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {product.images.map((image, index) => (
                    <Card
                      key={index}
                      sx={{
                        cursor: 'pointer',
                        opacity: selectedImage === index ? 1 : 0.7,
                        border: selectedImage === index ? 2 : 0,
                        borderColor: 'primary.main',
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <CardMedia
                        component="img"
                        width="80"
                        height="80"
                        image={image}
                        alt={`${product.name} ${index + 1}`}
                      />
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {reviewSummary && (
                  <>
                    <Rating 
                      value={reviewSummary.averageRating} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {formatRating(reviewSummary.averageRating)} ({reviewSummary.totalReviews} reviews)
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

              {product.content && (
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {product.content}
                </Typography>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Options
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {product.variants.map((variant) => (
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
                      disabled={product.trackQuantity && quantity >= product.quantity}
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
                    disabled={addingToCart || !product.isActive}
                    sx={{ flex: 1 }}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  
                  <IconButton
                    onClick={handleWishlistToggle}
                    color={isInWishlist ? 'primary' : 'default'}
                  >
                    {isInWishlist ? <Favorite /> : <FavoriteBorder />}
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
                {product.trackQuantity && (
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.quantity} available
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Description" />
            <Tab label={`Reviews (${reviewSummary?.totalReviews || 0})`} />
            <Tab label="Shipping & Returns" />
          </Tabs>

          {/* Description Tab */}
          {tabValue === 0 && (
            <Box sx={{ py: 3 }}>
              <Typography variant="body1">
                {product.content || 'No description available.'}
              </Typography>
            </Box>
          )}

          {/* Reviews Tab */}
          {tabValue === 1 && (
            <Box sx={{ py: 3 }}>
              {reviewSummary && (
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Customer Reviews
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={reviewSummary.averageRating} readOnly />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                          {formatRating(reviewSummary.averageRating)}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({reviewSummary.totalReviews} reviews)
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Rating Distribution
                      </Typography>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: 60 }}>
                            <Star sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{rating}</Typography>
                          </Box>
                          <Box sx={{ 
                            flex: 1, 
                            height: 8, 
                            bgcolor: 'grey.200', 
                            borderRadius: 1,
                            mx: 2,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              height: '100%', 
                              bgcolor: 'primary.main',
                              width: `${reviewSummary.ratingDistribution && reviewSummary.ratingDistribution[rating] 
                                ? (reviewSummary.ratingDistribution[rating] / reviewSummary.totalReviews) * 100 
                                : 0}%`
                            }} />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {reviewSummary.ratingDistribution?.[rating] || 0}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Write Review Form */}
              {isAuthenticated && (
                <Box sx={{ mb: 4, p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Write a Review
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Rating
                    </Typography>
                    <Rating
                      value={newReview.rating}
                      onChange={(event, newValue) => {
                        setNewReview({ ...newReview, rating: newValue || 5 });
                      }}
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    disabled={submittingReview || !newReview.content.trim()}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Box>
              )}

              {/* Reviews List */}
              <Box>
                {reviews.map((review) => (
                  <Box key={review.id} sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2">
                          {review.user.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2">
                      {review.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
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
