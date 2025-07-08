"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  Tooltip,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import CircularProgress from '@mui/material/CircularProgress';
import { mutate } from 'swr';

import { Iconify } from "@storely/shared/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";

import { useGetProducts, deleteProduct } from "@/services/product.service";
import { useGetCategories } from "@/services/category.service";
import { GridSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-components";
import NavigationButton from "@/components/ui/navigation-button";
import { paths } from "@/routes/paths";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  mrp: number;
  comparePrice?: number;
  status: "draft" | "active" | "inactive" | "archived";
  featured: boolean;
  images: string[];
  category?: {
    id: string;
    name: string;
  };
  inventory?: {
    quantity: number;
    lowStockAlert: number;
  };
  _count?: {
    reviews: number;
    orderItems: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (slug: string) => void;
}

function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "inactive":
        return "error";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const isLowStock = product.inventory && 
    product.inventory.quantity <= (product.inventory.lowStockAlert || 10);

  const discount = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Card
      sx={{
        position: "relative",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      {/* Featured Badge */}
      {product.featured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        />
      )}

      {/* Low Stock Badge */}
      {isLowStock && (
        <Chip
          label="Low Stock"
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      <CardContent>
        {/* Product Image */}
        <Box
          sx={{
            position: "relative",
            paddingTop: "75%",
            mt: 2,
            mb: 2,
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "grey.100",
          }}
        >
          {product.images && product.images.length > 0 ? (
            <Box
              component="img"
              src={product.images[0]}
              alt={product.name}
              sx={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.200",
              }}
            >
              <Iconify icon="tabler:photo" width={40} color="grey.500" />
            </Box>
          )}

          {/* Actions Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 1,
            }}
          >
            <Tooltip title="More actions">
              <IconButton size="small" onClick={handleMenuOpen}>
                <Iconify icon="tabler:dots-vertical" width={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Product Info */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" noWrap>
            {product.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            SKU: {product.sku}
          </Typography>

          {/* Category */}
          {product.category && (
            <Chip
              label={product.category.name}
              size="small"
              variant="outlined"
              sx={{ width: "fit-content" }}
            />
          )}

          {/* Pricing */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" color="primary">
              ₹{product.price.toLocaleString()}
            </Typography>
            {product.mrp > product.price && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  ₹{product.mrp.toLocaleString()}
                </Typography>
                <Chip
                  label={`${discount}% OFF`}
                  size="small"
                  color="success"
                />
              </>
            )}
          </Stack>

          {/* Inventory */}
          {product.inventory && (
            <Typography variant="caption" color="text.secondary">
              Stock: {product.inventory.quantity} units
            </Typography>
          )}

          {/* Status */}
          <Chip
            label={product.status.toUpperCase()}
            size="small"
            color={getStatusColor(product.status) as any}
            variant="outlined"
            sx={{ width: "fit-content" }}
          />
        </Stack>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => { onView(product.id); handleMenuClose(); }}>
          <Iconify icon="tabler:eye" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => { onEdit(product.id); handleMenuClose(); }}>
          <Iconify icon="tabler:edit" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => { onDelete(product.id); handleMenuClose(); }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="tabler:trash" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}

interface ProductsListProps {
  categoryId?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function ProductsList({ categoryId }: ProductsListProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const confirm = useBoolean();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Filters for API
  const filters = useMemo(() => {
    const apiFilters: any = {};
    if (debouncedSearchTerm) apiFilters.search = debouncedSearchTerm;
    if (statusFilter !== "all") apiFilters.status = statusFilter;
    if (categoryId) apiFilters.category = categoryId;
    else if (categoryFilter !== "all") apiFilters.category = categoryFilter;
    return apiFilters;
  }, [debouncedSearchTerm, statusFilter, categoryFilter, categoryId]);

  const {
    products,
    productsLoading,
    productsError,
    productsEmpty,
  } = useGetProducts({ filters });

  const { categories } = useGetCategories();

  // Handlers
  const handleEdit = useCallback((productId: string) => {
    router.push(`/dashboard/edit-product/${productId}`);
  }, [router]);

  const handleView = useCallback((productId: string) => {
    router.push(`${paths.dashboard.products.edit(productId)}`);
  }, [router]);

  const handleDelete = useCallback((productId: string) => {
    setDeleteId(productId);
    confirm.onTrue();
  }, [confirm]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      const response = await deleteProduct(deleteId);
      if (response.success) {
        enqueueSnackbar("Product deleted successfully", { variant: "success" });
        // Refresh the list - you might want to use SWR mutate here
        mutate('products');
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      enqueueSnackbar(
        error.message || "Failed to delete product", 
        { variant: "error" }
      );
    } finally {
      setDeleteId(null);
      confirm.onFalse();
    }
  }, [deleteId, enqueueSnackbar, confirm]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="tabler:package" />
              <Typography variant="h6">Products</Typography>
              <Chip label={products?.length || 0} size="small" />
            </Stack>
          }
          action={
            <NavigationButton
              href={categoryId 
                ? `${paths.dashboard.products.new}?category=${categoryId}`
                : paths.dashboard.products.new}
              variant="contained"
              startIcon={<Iconify icon="tabler:plus" />}
            >
              Add Product
            </NavigationButton>
          }
        />
        <CardContent>
          {/* Filters - always visible */}
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="tabler:search" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {!categoryId && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories?.map((category: any) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Active filters:
                </Typography>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    size="small"
                    onDelete={() => setSearchTerm("")}
                  />
                )}
                {statusFilter !== "all" && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    size="small"
                    onDelete={() => setStatusFilter("all")}
                  />
                )}
                {categoryFilter !== "all" && (
                  <Chip
                    label={`Category: ${categories?.find((c: any) => c.id === categoryFilter)?.name}`}
                    size="small"
                    onDelete={() => setCategoryFilter("all")}
                  />
                )}
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ ml: 1 }}
                  startIcon={<Iconify icon="tabler:x" />}
                >
                  Clear All
                </Button>
              </Stack>
            )}
          </Stack>

          {/* Loading, Error, Empty, or Products Grid */}
          {productsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : productsError ? (
            <ErrorState
              title="Failed to load products"
              message="There was an error loading the products. Please try again."
              onAction={() => mutate('products')}
            />
          ) : productsEmpty || !products || products.length === 0 ? (
            <EmptyState
              icon="tabler:package"
              title="No products found"
              message={
                searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "No products match your current filters."
                  : "Start by adding your first product to the catalog."
              }
              actionLabel={
                searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Clear Filters"
                  : "Add Product"
              }
              onAction={
                searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? handleClearFilters
                  : () => router.push(paths.dashboard.products.new)
              }
            />
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid key={product.id} xs={12} sm={6} md={4}>
                  <ProductCard
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirm.value}
        onClose={confirm.onFalse}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
            All related data including reviews and analytics will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirm.onFalse}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
