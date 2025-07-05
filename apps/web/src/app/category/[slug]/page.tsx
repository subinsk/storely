'use client';

import {
  Container,
  Typography,
  Grid,
  Box,
  Pagination,
  Breadcrumbs,
  Link,
  Skeleton
} from '@mui/material';
import { ProductCard } from '@storely/shared/components/product/ProductCard';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  images: string[];
  sku: string;
  saleLabel?: string;
  newLabel?: string;
  quantity: number;
  subDescription?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryData();
      fetchProducts();
    }
  }, [categorySlug, currentPage]);

  const fetchCategoryData = async () => {
    try {
      // Mock category data for development
      setCategory({
        id: '1',
        name: getCategoryName(categorySlug),
        slug: categorySlug,
        description: `Discover our premium ${getCategoryName(categorySlug).toLowerCase()} collection`,
        image: '/assets/placeholder.svg'
      });
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: categorySlug,
        page: currentPage.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(Math.ceil((data.total || 0) / 12));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Set mock data for development
      setProducts(getMockProducts());
      setTotalPages(2);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (slug: string): string => {
    const categoryNames: { [key: string]: string } = {
      'living-room': 'Living Room',
      'bedroom': 'Bedroom',
      'dining': 'Dining Room',
      'office': 'Office',
      'outdoor': 'Outdoor'
    };
    return categoryNames[slug] || 'Category';
  };

  const getMockProducts = (): Product[] => [
    {
      id: '1',
      name: 'Modern Sectional Sofa',
      slug: 'modern-sectional-sofa',
      price: 1299.99,
      mrp: 1599.99,
      images: ['/assets/placeholder.svg'],
      sku: 'SOF-001',
      newLabel: 'New',
      quantity: 5,
      subDescription: 'Comfortable L-shaped sofa perfect for modern living rooms'
    },
    // Add more mock products based on category...
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={NextLink} href="/" color="inherit" underline="hover">
          Home
        </Link>
        <Link component={NextLink} href="/products" color="inherit" underline="hover">
          Products
        </Link>
        <Typography color="text.primary">
          {category?.name || 'Loading...'}
        </Typography>
      </Breadcrumbs>

      {/* Category Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: 'grey.900',
            mb: 2
          }}
        >
          {category?.name || 'Category'}
        </Typography>
        {category?.description && (
          <Typography
            variant="h6"
            sx={{
              color: 'grey.600',
              mb: 4
            }}
          >
            {category.description}
          </Typography>
        )}
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={{} as Product} loading />
              </Grid>
            ))
          : products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))
        }
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No products found in this category
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back soon for new arrivals
          </Typography>
        </Box>
      )}
    </Container>
  );
}
