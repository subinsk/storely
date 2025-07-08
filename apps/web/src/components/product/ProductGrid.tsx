"use client";

import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Pagination,
  Skeleton,
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../ui/loading-skeletons';
import { EmptyProductsState, ErrorState } from '../ui/state-components';
import { Iconify } from '../ui/iconify';
import { useGetProducts } from '../../services/product.service';
import { useGetCategories } from '../../services/category.service';
import { useDebounce } from '../../hooks/useDebounce';
import type { Product, ProductFilters } from '../../types';

interface ProductGridProps {
  initialFilters?: Partial<ProductFilters>;
  showFilters?: boolean;
  showSorting?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
}

export function ProductGrid({
  initialFilters = {},
  showFilters = true,
  showSorting = true,
  showPagination = true,
  itemsPerPage = 12,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Filter state
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categoryId: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: itemsPerPage,
    ...initialFilters,
  });

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 300);

  // Data fetching
  const { 
    products, 
    productsLoading, 
    productsError,
    total = 0,
    totalPages = 0,
  } = useGetProducts({
    ...filters,
    search: debouncedSearch,
  });

  const { categories, categoriesLoading } = useGetCategories();

  // Update filters from URL params
  useEffect(() => {
    const categoryId = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    setFilters(prev => ({
      ...prev,
      categoryId,
      search,
      page,
      sortBy,
      sortOrder,
    }));
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (newFilters: Partial<ProductFilters>) => {
    const params = new URLSearchParams();
    
    if (newFilters.categoryId) params.set('category', newFilters.categoryId);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.sortBy && newFilters.sortBy !== 'createdAt') params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder && newFilters.sortOrder !== 'desc') params.set('sortOrder', newFilters.sortOrder);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      categoryId: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
      page: 1,
      limit: itemsPerPage,
    };
    setFilters(clearedFilters);
    router.push('?', { scroll: false });
  };

  const activeFiltersCount = [
    filters.search,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  if (productsError) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  return (
    <Box>
      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Filters</Typography>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearFilters}
                  startIcon={<Iconify icon="mdi:filter-remove" />}
                >
                  Clear All ({activeFiltersCount})
                </Button>
              )}
            </Box>

            <Grid container spacing={2}>
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  InputProps={{
                    startAdornment: <Iconify icon="mdi:magnify" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange({ categoryId: e.target.value })}
                  disabled={categoriesLoading}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Price Range */}
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Price"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange({ 
                    minPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange({ 
                    maxPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      )}

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          {productsLoading ? (
            <Skeleton width={200} height={32} />
          ) : (
            <Typography variant="h6">
              {total} Product{total !== 1 ? 's' : ''} Found
            </Typography>
          )}
          
          {/* Active filters display */}
          {activeFiltersCount > 0 && (
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {filters.search && (
                <Chip
                  label={`Search: "${filters.search}"`}
                  onDelete={() => handleFilterChange({ search: '' })}
                  size="small"
                />
              )}
              {filters.categoryId && (
                <Chip
                  label={categories.find(c => c.id === filters.categoryId)?.name || 'Category'}
                  onDelete={() => handleFilterChange({ categoryId: '' })}
                  size="small"
                />
              )}
              {filters.minPrice && (
                <Chip
                  label={`Min: $${filters.minPrice}`}
                  onDelete={() => handleFilterChange({ minPrice: undefined })}
                  size="small"
                />
              )}
              {filters.maxPrice && (
                <Chip
                  label={`Max: $${filters.maxPrice}`}
                  onDelete={() => handleFilterChange({ maxPrice: undefined })}
                  size="small"
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Sorting */}
        {showSorting && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Sort by:
            </Typography>
            <TextField
              select
              size="small"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="createdAt-desc">Newest First</MenuItem>
              <MenuItem value="createdAt-asc">Oldest First</MenuItem>
              <MenuItem value="name-asc">Name A-Z</MenuItem>
              <MenuItem value="name-desc">Name Z-A</MenuItem>
              <MenuItem value="price-asc">Price Low to High</MenuItem>
              <MenuItem value="price-desc">Price High to Low</MenuItem>
              <MenuItem value="rating-desc">Highest Rated</MenuItem>
            </TextField>
          </Stack>
        )}
      </Box>

      {/* Products Grid */}
      {productsLoading ? (
        <ProductGridSkeleton count={itemsPerPage} />
      ) : products.length === 0 ? (
        <EmptyProductsState />
      ) : (
        <Grid container spacing={3}>
          {products.map((product: Product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={(id) => console.log('Add to cart:', id)}
                onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                onQuickView={(id) => console.log('Quick view:', id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={filters.page || 1}
            onChange={(_, page) => handlePageChange(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
}
