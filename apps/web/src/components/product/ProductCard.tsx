"use client";

import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Badge,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Iconify } from '../ui/iconify';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  showQuickView?: boolean;
  onQuickView?: (productId: string) => void;
  loading?: boolean; // Optional prop for loading state
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
  showQuickView = true,
  onQuickView,
}: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleProductClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product.id);
  };

  const discountPercentage = product.mrp ? 
    Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{ 
            height: 240, 
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          image={product.imageUrl || '/assets/placeholder.svg'}
          alt={product.name}
        />
        
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <Stack spacing={1}>
            {product.featured && (
              <Chip
                label="Featured"
                size="small"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              />
            )}
            {discountPercentage > 0 && (
              <Chip
                label={`-${discountPercentage}%`}
                size="small"
                color="error"
                sx={{ fontWeight: 'bold' }}
              />
            )}
            {product.quantity === 0 && (
              <Chip
                label="Out of Stock"
                size="small"
                color="default"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Stack>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Stack spacing={1}>
            <Tooltip title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
              <IconButton
                size="small"
                onClick={handleAddToWishlist}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <Iconify
                  icon={isInWishlist ? 'mdi:heart' : 'mdi:heart-outline'}
                  color={isInWishlist ? 'error.main' : 'text.secondary'}
                />
              </IconButton>
            </Tooltip>
            
            {showQuickView && (
              <Tooltip title="Quick View">
                <IconButton
                  size="small"
                  onClick={handleQuickView}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                    },
                  }}
                >
                  <Iconify icon="mdi:eye-outline" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        {product.category && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {product.category.name}
          </Typography>
        )}

        {/* Rating */}
        {product.averageRating && product.reviewCount && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.averageRating}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount})
            </Typography>
          </Box>
        )}

        {/* Price */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="span"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            {typeof product.price === 'number'
              ? `$${product.price.toFixed(2)}`
              : 'N/A'}
          </Typography>
          {typeof product.mrp === 'number' && typeof product.price === 'number' && product.mrp > product.price && (
            <Typography
              variant="body2"
              component="span"
              sx={{
                ml: 1,
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              ${product.mrp.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          startIcon={<Iconify icon="mdi:cart-plus" />}
          sx={{
            opacity: isHovered ? 1 : 0.8,
            transition: 'opacity 0.3s ease',
          }}
        >
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}

// Compact product card for lists
export function ProductCardCompact({ product, onAddToCart }: { product: Product; onAddToCart?: (productId: string) => void }) {
  const router = useRouter();

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      onClick={() => router.push(`/products/${product.slug}`)}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }}
        image={product.imageUrl || '/assets/placeholder.svg'}
        alt={product.name}
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5 }}>
          {product.name}
        </Typography>
        
        {product.category && (
          <Typography variant="body2" color="text.secondary">
            {product.category.name}
          </Typography>
        )}
        
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${product.price.toFixed(2)}
        </Typography>
      </Box>
      
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart?.(product.id);
        }}
        disabled={product.quantity === 0}
      >
        <Iconify icon="mdi:cart-plus" />
      </IconButton>
    </Card>
  );
}
