'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Inventory as InventoryIcon,
  LocalOffer as TagIcon,
  Visibility as VisibilityIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import {
  productService,
  type ProductFormData,
  type ProductVariant
} from '@/services/product.service';

interface EnhancedProductFormProps {
  productId?: string;
  onSave?: (product: any) => void;
  onCancel?: () => void;
}

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({
  productId,
  onSave,
  onCancel
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    sku: '',
    price: 0,
    comparePrice: 0,
    cost: 0,
    categoryId: '',
    status: 'draft',
    featured: false,
    trackQuantity: true,
    weight: 0,
    dimensions: '',
    metaTitle: '',
    metaDescription: '',
    tags: [],
    content: '',
    images: [],
    mrp: 0,
    quantity: 0,
    lowStockAlert: 10,
    variants: [],
    publishedAt: undefined
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [variantDialog, setVariantDialog] = useState({
    open: false,
    editIndex: -1,
    data: {
      name: '',
      value: '',
      sku: '',
      price: 0,
      comparePrice: 0,
      weight: 0,
      image: '',
      position: 0
    }
  });

  const [tagInput, setTagInput] = useState('');

  // Load product data if editing
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
    loadCategories();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const product = await productService.getProduct(productId!);
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          price: product.price,
          comparePrice: product.comparePrice || 0,
          cost: product.cost || 0,
          categoryId: product.categoryId,
          status: product.status,
          featured: product.featured,
          trackQuantity: product.trackQuantity,
          weight: product.weight || 0,
          dimensions: product.dimensions || '',
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          tags: product.tags || [],
          content: product.content || '',
          images: product.images || [],
          mrp: product.mrp,
          quantity: product.quantity,
          lowStockAlert: product.lowStockAlert || 10,
          variants: product.variants || [],
          publishedAt: product.publishedAt
        });
      }
    } catch (error) {
      enqueueSnackbar('Failed to load product', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/category');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageAdd = (imageUrl: string) => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
    }
  };

  const handleImageRemove = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageToRemove)
    }));
  };

  const handleVariantSave = () => {
    const newVariant: ProductVariant = {
      ...variantDialog.data,
      position: variantDialog.editIndex >= 0 ? variantDialog.data.position : formData.variants.length
    };

    setFormData(prev => {
      const newVariants = [...prev.variants];
      if (variantDialog.editIndex >= 0) {
        newVariants[variantDialog.editIndex] = newVariant;
      } else {
        newVariants.push(newVariant);
      }
      return { ...prev, variants: newVariants };
    });

    setVariantDialog({
      open: false,
      editIndex: -1,
      data: {
        name: '',
        value: '',
        sku: '',
        price: 0,
        comparePrice: 0,
        weight: 0,
        image: '',
        position: 0
      }
    });
  };

  const handleVariantEdit = (index: number) => {
    const variant = formData.variants[index];
    setVariantDialog({
      open: true,
      editIndex: index,
      data: {
        name: variant.name,
        value: variant.value,
        sku: variant.sku || '',
        price: variant.price || 0,
        comparePrice: variant.comparePrice || 0,
        weight: variant.weight || 0,
        image: variant.image || '',
        position: variant.position
      }
    });
  };

  const handleVariantDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let savedProduct;
      if (productId) {
        savedProduct = await productService.updateProduct(productId, formData);
      } else {
        savedProduct = await productService.createProduct(formData);
      }
      
      enqueueSnackbar(
        `Product ${productId ? 'updated' : 'created'} successfully!`,
        { variant: 'success' }
      );
      
      if (onSave) {
        onSave(savedProduct);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      enqueueSnackbar('Failed to save product', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading product...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <StoreIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {productId ? 'Edit Product' : 'Create Product'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <LoadingButton
            variant="contained"
            startIcon={<SaveIcon />}
            loading={saving}
            onClick={handleSave}
            size="large"
          >
            {productId ? 'Update Product' : 'Create Product'}
          </LoadingButton>
          {onCancel && (
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              size="large"
            >
              Cancel
            </Button>
          )}
        </Box>

        {/* Basic Information */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Basic Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Product Description"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                    />
                  }
                  label="Featured Product"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.trackQuantity}
                      onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
                    />
                  }
                  label="Track Inventory"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Pricing & Inventory */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Pricing & Inventory</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Compare Price (MSRP)"
                  value={formData.comparePrice}
                  onChange={(e) => handleInputChange('comparePrice', Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cost"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                />
              </Grid>
              {formData.trackQuantity && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Low Stock Alert"
                      value={formData.lowStockAlert}
                      onChange={(e) => handleInputChange('lowStockAlert', Number(e.target.value))}
                      helperText="Alert when quantity falls below this number"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Weight (kg)"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dimensions (L x W x H)"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="30 x 20 x 10 cm"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Product Variants */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Product Variants</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setVariantDialog({ ...variantDialog, open: true })}
              >
                Add Variant
              </Button>
            </Box>

            {formData.variants.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.variants.map((variant, index) => (
                      <TableRow key={index}>
                        <TableCell>{variant.name}</TableCell>
                        <TableCell>{variant.value}</TableCell>
                        <TableCell>{variant.sku}</TableCell>
                        <TableCell>${variant.price}</TableCell>
                        <TableCell>{variant.weight}kg</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleVariantEdit(index)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleVariantDelete(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Images */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Product Images</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleImageAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <UploadIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {formData.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                    onClick={() => handleImageRemove(image)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Tags & SEO */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TagIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Tags & SEO</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Add Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                  helperText="Press Enter to add tags"
                />
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleTagRemove(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  helperText="Recommended: 50-60 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Meta Description"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  helperText="Recommended: 150-160 characters"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Variant Dialog */}
      <Dialog
        open={variantDialog.open}
        onClose={() => setVariantDialog({ ...variantDialog, open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {variantDialog.editIndex >= 0 ? 'Edit Variant' : 'Add Variant'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Variant Name"
                value={variantDialog.data.name}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, name: e.target.value }
                  }))
                }
                placeholder="e.g., Color, Size, Material"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Variant Value"
                value={variantDialog.data.value}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, value: e.target.value }
                  }))
                }
                placeholder="e.g., Red, Large, Wood"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU"
                value={variantDialog.data.sku}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, sku: e.target.value }
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Price Difference"
                value={variantDialog.data.price}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, price: Number(e.target.value) }
                  }))
                }
                helperText="Price difference from base product (can be negative)"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Compare Price"
                value={variantDialog.data.comparePrice}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, comparePrice: Number(e.target.value) }
                  }))
                }
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Weight (kg)"
                value={variantDialog.data.weight}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, weight: Number(e.target.value) }
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Variant Image URL"
                value={variantDialog.data.image}
                onChange={(e) =>
                  setVariantDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, image: e.target.value }
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setVariantDialog({ ...variantDialog, open: false })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleVariantSave}
          >
            {variantDialog.editIndex >= 0 ? 'Update' : 'Add'} Variant
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedProductForm;
