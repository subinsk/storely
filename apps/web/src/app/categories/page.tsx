'use client';

import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Button,
  CircularProgress 
} from '@mui/material';
import { useState, useEffect } from 'react';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../types/category';
import { useOrganization } from '../../contexts/OrganizationContext';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      fetchCategories();
    }
  }, [organization]);

  const fetchCategories = async () => {
    if (!organization) return;
    
    try {
      setLoading(true);
      const categoryService = new CategoryService(organization.id);
      const response = await categoryService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Categories
      </Typography>

      {categories.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No categories found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={category.imageUrl || '/api/placeholder/300/200'}
                  alt={category.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {category.name}
                  </Typography>
                  
                  {category.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {category.description}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      href={`/products?category=${category.slug}`}
                    >
                      Shop Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
