import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Stack,
  Chip,
  Rating,
  IconButton,
  Paper,
  Skeleton,
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  ShoppingCart, 
  ArrowForward,
  Star,
  LocalOffer,
  Visibility,
} from '@mui/icons-material';
import { useGetProducts } from '../../services/product.service';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useState } from 'react';

interface FeaturedProductsProps {
  organizationId?: string;
}

export function FeaturedProducts({ organizationId }: FeaturedProductsProps) {
  const { organization } = useOrganization();
  const { products, productsLoading, productsError } = useGetProducts({ featured: true });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (productsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Featured Products
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Discover our most popular items
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={28} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (productsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          Featured Products
        </Typography>
        <Box display="flex" justifyContent="center" py={4}>
          <Typography color="error" variant="h6">
            Error loading products. Please try again later.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show first 8 products as featured
  const featuredProducts = products.slice(0, 8);

  return (
    <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Featured Products
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Discover our most popular items
            </Typography>
            <Box sx={{ width: 60, height: 4, backgroundColor: 'primary.main', mx: 'auto', borderRadius: 2 }} />
          </Box>

          <Grid container spacing={3}>
            {featuredProducts.map((product: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Product Badge */}
                  {product.featured && (
                    <Chip
                      label="Featured"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 1,
                        fontWeight: 'bold',
                      }}
                    />
                  )}

                  {/* Favorite Button */}
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(product.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      },
                    }}
                  >
                    {favorites.has(product.id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>

                  {/* Product Image */}
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        height: 220, 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                      image={product.imageUrl || '/assets/placeholder.svg'}
                      alt={product.name}
                    />
                    
                    {/* Quick Actions Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '.MuiCard-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <IconButton size="small" sx={{ color: 'white' }}>
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'white' }}>
                        <ShoppingCart />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack spacing={2}>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        fontWeight="600"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.description || 'No description available'}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Rating 
                          value={product.averageRating || 0} 
                          readOnly 
                          size="small"
                          precision={0.5}
                        />
                        <Typography variant="caption" color="text.secondary">
                          ({product.reviewCount || 0})
                        </Typography>
                      </Stack>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography 
                          variant="h6" 
                          color="primary" 
                          fontWeight="bold"
                          sx={{ fontSize: '1.25rem' }}
                        >
                          ${product.price?.toFixed(2)}
                        </Typography>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            ${product.originalPrice.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<ShoppingCart />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        },
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" sx={{ mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontWeight: 600,
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              View All Products
            </Button>
          </Box>
        </Stack>
      </Container>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
