"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { Control, useWatch } from 'react-hook-form';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

interface ProductSEOFormProps {
  control: Control<any>;
}

export default function ProductSEOForm({ control }: ProductSEOFormProps) {
  const [seoScore, setSeoScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Watch form values for SEO analysis
  const productName = useWatch({ control, name: 'name' });
  const metaTitle = useWatch({ control, name: 'metaTitle' });
  const metaDescription = useWatch({ control, name: 'metaDescription' });
  const content = useWatch({ control, name: 'content' });
  const tags = useWatch({ control, name: 'tags' });

  // Calculate SEO score
  useEffect(() => {
    let score = 0;
    const newSuggestions: string[] = [];

    // Title optimization
    if (metaTitle) {
      if (metaTitle.length >= 30 && metaTitle.length <= 60) {
        score += 20;
      } else {
        newSuggestions.push('Meta title should be 30-60 characters long');
      }
    } else {
      newSuggestions.push('Add a meta title for better SEO');
    }

    // Description optimization
    if (metaDescription) {
      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        score += 20;
      } else {
        newSuggestions.push('Meta description should be 120-160 characters long');
      }
    } else {
      newSuggestions.push('Add a meta description for better SEO');
    }

    // Content optimization
    if (content && content.length > 300) {
      score += 20;
    } else {
      newSuggestions.push('Add detailed product description (300+ characters)');
    }

    // Tags optimization
    if (tags && tags.length >= 3) {
      score += 20;
    } else {
      newSuggestions.push('Add at least 3 relevant tags');
    }

    // Product name in meta title
    if (productName && metaTitle && metaTitle.toLowerCase().includes(productName.toLowerCase())) {
      score += 20;
    } else if (productName && metaTitle) {
      newSuggestions.push('Include product name in meta title');
    }

    setSeoScore(score);
    setSuggestions(newSuggestions);
  }, [productName, metaTitle, metaDescription, content, tags]);

  const getSEOStatus = () => {
    if (seoScore >= 80) return { color: 'success', label: 'Excellent' };
    if (seoScore >= 60) return { color: 'warning', label: 'Good' };
    if (seoScore >= 40) return { color: 'info', label: 'Fair' };
    return { color: 'error', label: 'Needs Improvement' };
  };

  const seoStatus = getSEOStatus();

  const commonTags = [
    'furniture', 'home decor', 'modern', 'vintage', 'wooden', 'metal', 
    'comfortable', 'stylish', 'durable', 'affordable', 'premium', 'luxury',
    'living room', 'bedroom', 'dining room', 'office', 'outdoor'
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          SEO Optimization
        </Typography>

        <Stack spacing={3}>
          {/* SEO Score */}
          <Card variant="outlined" sx={{ bgcolor: 'background.neutral' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify 
                      icon="eva:trending-up-fill"
                      sx={{ 
                        color: `${seoStatus.color}.main`,
                        width: 20,
                        height: 20 
                      }}
                    />
                    <Typography variant="subtitle2">
                      SEO Score
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    {seoScore}/100
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={seoScore}
                      color={seoStatus.color as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
                <Chip
                  label={seoStatus.label}
                  color={seoStatus.color as any}
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Meta Title */}
          <TextField
            fullWidth
            label="Meta Title"
            placeholder="SEO-friendly title for search engines"
            helperText={`${metaTitle?.length || 0}/60 characters - Appears in search results`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:text-outline" />
                </InputAdornment>
              ),
            }}
            {...control.register('metaTitle')}
            error={metaTitle && (metaTitle.length < 30 || metaTitle.length > 60)}
          />

          {/* Meta Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Meta Description"
            placeholder="Brief description that appears in search results"
            helperText={`${metaDescription?.length || 0}/160 characters - Should be compelling and informative`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:file-text-outline" />
                </InputAdornment>
              ),
            }}
            {...control.register('metaDescription')}
            error={metaDescription && (metaDescription.length < 120 || metaDescription.length > 160)}
          />

          {/* Tags */}
          <Autocomplete
            multiple
            freeSolo
            options={commonTags}
            defaultValue={tags || []}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="SEO Tags"
                placeholder="Add relevant keywords"
                helperText="Press Enter to add custom tags or select from suggestions"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <Iconify icon="eva:pricetags-outline" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={(_, value) => {
              control.setValue('tags', value);
            }}
          />

          {/* SEO Suggestions */}
          {suggestions.length > 0 && (
            <Alert 
              severity="info" 
              icon={<Iconify icon="eva:bulb-outline" />}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                SEO Improvement Suggestions:
              </Typography>
              <Stack spacing={0.5}>
                {suggestions.map((suggestion, index) => (
                  <Typography key={index} variant="body2">
                    • {suggestion}
                  </Typography>
                ))}
              </Stack>
            </Alert>
          )}

          {/* SEO Preview */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Search Engine Preview
            </Typography>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral' }}>
              <Typography 
                variant="h6" 
                color="primary.main" 
                sx={{ 
                  fontSize: '18px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  mb: 0.5,
                  lineHeight: 1.2
                }}
              >
                {metaTitle || productName || 'Product Title'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '14px',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {metaDescription || 'Meta description will appear here...'}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                www.yourstore.com/products/{productName?.toLowerCase().replace(/\s+/g, '-') || 'product-name'}
              </Typography>
            </Card>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
