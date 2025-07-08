"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Chip,
  Typography,
  Grid,
  Alert,
  InputAdornment,
  Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Iconify } from "@storely/shared/components/iconify";
import { useGetCategories } from "@/services/category.service";
import { createProduct, ProductFormData } from "@/services/product.service";
import { FormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/state-components";
import { paths } from "@/routes/paths";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required").min(2, "Name must be at least 2 characters"),
  description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  sku: Yup.string().required("SKU is required"),
  price: Yup.number().required("Price is required").min(0, "Price must be positive"),
  mrp: Yup.number().required("MRP is required").min(0, "MRP must be positive"),
  comparePrice: Yup.number().min(0, "Compare price must be positive"),
  categoryId: Yup.string().required("Category is required"),
  status: Yup.string().oneOf(["draft", "active", "inactive", "archived"]).required("Status is required"),
  featured: Yup.boolean(),
  metaTitle: Yup.string().max(60, "Meta title should be under 60 characters"),
  metaDescription: Yup.string().max(160, "Meta description should be under 160 characters"),
  quantity: Yup.number().min(0, "Quantity must be positive"),
  lowStockAlert: Yup.number().min(0, "Low stock alert must be positive"),
  trackQuantity: Yup.boolean(),
  weight: Yup.number().min(0, "Weight must be positive"),
});

interface AddProductFormProps {
  categoryId?: string;
}

export default function AddProductForm({ categoryId }: AddProductFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [tagInput, setTagInput] = useState("");

  // Fetch categories
  const {
    categories,
    categoriesLoading,
    categoriesError,
  } = useGetCategories();

  const allCategories = useMemo(() => {
    if (!categories) return [];
    return categories;
  }, [categories]);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sku: "",
      price: 0,
      mrp: 0,
      comparePrice: 0,
      categoryId: categoryId || "",
      status: "draft",
      featured: false,
      tags: [],
      metaTitle: "",
      metaDescription: "",
      quantity: 0,
      lowStockAlert: 5,
      trackQuantity: true,
      weight: 0,
      dimensions: "",
      images: [],
      variants: [],
    },
  });

  const watchedFields = watch();

  // Auto-generate slug and SKU from name
  const generateSlug = useCallback((name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  const generateSKU = useCallback((name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toUpperCase();
  }, []);

  // Auto-generate values from name
  useEffect(() => {
    if (watchedFields.name) {
      if (!watchedFields.slug) {
        setValue("slug", generateSlug(watchedFields.name));
      }
      if (!watchedFields.sku) {
        setValue("sku", generateSKU(watchedFields.name));
      }
      if (!watchedFields.metaTitle) {
        setValue("metaTitle", watchedFields.name);
      }
    }
  }, [watchedFields.name, watchedFields.slug, watchedFields.sku, watchedFields.metaTitle, setValue, generateSlug, generateSKU]);

  // Handle tag input
  const handleTagKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const tag = tagInput.trim();
      if (tag && !watchedFields.tags.includes(tag)) {
        setValue("tags", [...watchedFields.tags, tag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", watchedFields.tags.filter(tag => tag !== tagToRemove));
  };

  // Submit handler
  const onSubmit = useCallback(async (data: ProductFormData) => {
    try {
      await createProduct(data);
      
      enqueueSnackbar("Product created successfully!", { variant: "success" });
      router.push(paths.dashboard.products.root);
    } catch (error: any) {
      console.error("Failed to create product:", error);
      enqueueSnackbar(error?.message || "Failed to create product", { variant: "error" });
    }
  }, [router, enqueueSnackbar]);

  // Loading state
  if (categoriesLoading) {
    return <FormSkeleton />;
  }

  // Error state
  if (categoriesError) {
    return (
      <ErrorState
        title="Failed to load categories"
        message="Unable to load categories. Please try again."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="tabler:plus" />
              <Typography variant="h6">Add New Product</Typography>
            </Stack>
          }
        />
        <CardContent>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Product Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        placeholder="Enter product name"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="SKU"
                        error={!!errors.sku}
                        helperText={errors.sku?.message}
                        placeholder="Product SKU"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Slug"
                        error={!!errors.slug}
                        helperText={errors.slug?.message}
                        placeholder="Product slug"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        placeholder="Enter product description"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Pricing */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Pricing
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Selling Price"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="mrp"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="MRP"
                        error={!!errors.mrp}
                        helperText={errors.mrp?.message}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="comparePrice"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Compare Price (Optional)"
                        error={!!errors.comparePrice}
                        helperText={errors.comparePrice?.message}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Category & Status */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Category & Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.categoryId}>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          {allCategories.map((category: any) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.parent ? `${category.parent.name} > ` : ""}
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.categoryId && (
                          <FormHelperText>{errors.categoryId.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                  {categoryId && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Category pre-selected: {
                        allCategories.find((cat: any) => cat.id === categoryId)?.name ||
                        "Unknown Category"
                      }
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                          <MenuItem value="archived">Archived</MenuItem>
                        </Select>
                        {errors.status && (
                          <FormHelperText>{errors.status.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="featured"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Featured Product"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Inventory */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Inventory
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="trackQuantity"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Track Inventory"
                      />
                    )}
                  />
                </Grid>
                {watchedFields.trackQuantity && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Initial Quantity"
                            error={!!errors.quantity}
                            helperText={errors.quantity?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="lowStockAlert"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Low Stock Alert"
                            error={!!errors.lowStockAlert}
                            helperText={errors.lowStockAlert?.message}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            <Divider />

            {/* Tags */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <TextField
                fullWidth
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Type and press Enter to add tags"
                helperText="Press Enter or comma to add tags"
              />
              {watchedFields.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                  {watchedFields.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Divider />

            {/* SEO */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                SEO
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="metaTitle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Meta Title"
                        error={!!errors.metaTitle}
                        helperText={errors.metaTitle?.message || `${field.value?.length || 0}/60 characters`}
                        placeholder="Meta title for search engines"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="metaDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Meta Description"
                        error={!!errors.metaDescription}
                        helperText={errors.metaDescription?.message || `${field.value?.length || 0}/160 characters`}
                        placeholder="Meta description for search engines"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Shipping */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Shipping
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Weight"
                        error={!!errors.weight}
                        helperText={errors.weight?.message}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dimensions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Dimensions"
                        placeholder="L x W x H (in cm)"
                        helperText="Format: Length x Width x Height"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Submit Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <LoadingButton
                type="button"
                variant="outlined"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Iconify icon="tabler:check" />}
              >
                Create Product
              </LoadingButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </form>
  );
}
