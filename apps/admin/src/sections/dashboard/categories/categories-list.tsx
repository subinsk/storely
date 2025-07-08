"use client";

import { useCallback, useState, useMemo } from "react";
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
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";

import { Iconify } from "@storely/shared/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";

import { useGetCategories, deleteCategoryById } from "@/services/category.service";
import { CategoryTreeSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-components";
import NavigationButton from "@/components/ui/navigation-button";
import { paths } from "@/routes/paths";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parent?: { id: string; name: string };
  subCategories?: Category[];
  _count?: {
    products: number;
    subCategories: number;
  };
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryNodeProps {
  category: Category;
  level: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (slug: string) => void;
  searchTerm: string;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
}

function CategoryNode({
  category,
  level,
  onEdit,
  onDelete,
  onView,
  searchTerm,
  expanded,
  onToggleExpand,
}: CategoryNodeProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;
  const isExpanded = expanded.has(category.id);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const matchesSearch = searchTerm
    ? category.name.toLowerCase().includes(searchTerm.toLowerCase())
    : true;

  if (!matchesSearch) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 1,
          px: 2,
          ml: level * 2,
          borderRadius: 1,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {/* Expand/Collapse Button */}
        <IconButton
          size="small"
          onClick={() => onToggleExpand(category.id)}
          sx={{ mr: 1, opacity: hasSubCategories ? 1 : 0 }}
          disabled={!hasSubCategories}
        >
          <Iconify
            icon={isExpanded ? "tabler:chevron-down" : "tabler:chevron-right"}
            width={16}
          />
        </IconButton>

        {/* Category Icon */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: "primary.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          {category.image ? (
            <Box
              component="img"
              src={category.image}
              sx={{ width: 24, height: 24, borderRadius: 0.5 }}
            />
          ) : (
            <Iconify icon="tabler:category" width={16} />
          )}
        </Box>

        {/* Category Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {category.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {category._count?.products || 0} products
            </Typography>
            {category._count?.subCategories && category._count.subCategories > 0 ? (
              <Typography variant="caption" color="text.secondary">
                • {category._count.subCategories} subcategories
              </Typography>
            ): null}
          </Stack>
        </Box>

        {/* Status */}
        <Chip
          size="small"
          label={category.isActive !== false ? "Active" : "Inactive"}
          color={category.isActive !== false ? "success" : "default"}
          variant="outlined"
          sx={{ mr: 1 }}
        />

        {/* Actions */}
        <Tooltip title="More actions">
          <IconButton size="small" onClick={handleMenuOpen}>
            <Iconify icon="tabler:dots-vertical" width={16} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => { onView(category.slug); handleMenuClose(); }}>
            <Iconify icon="tabler:eye" sx={{ mr: 1 }} />
            View
          </MenuItem>
          <MenuItem onClick={() => { onEdit(category.id); handleMenuClose(); }}>
            <Iconify icon="tabler:edit" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => { onDelete(category.id); handleMenuClose(); }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="tabler:trash" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>

      {/* Sub-categories */}
      {hasSubCategories ? (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {category.subCategories!.map((subCategory) => (
            <CategoryNode
              key={subCategory.id}
              category={subCategory}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              searchTerm={searchTerm}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </Collapse>
      ): null}
    </Box>
  );
}

interface CategoriesListProps {
  categorySlug?: string;
}

export default function CategoriesList({ categorySlug }: CategoriesListProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const confirm = useBoolean();

  const {
    categories,
    categoriesLoading,
    categoriesError,
    categoriesEmpty,
    categoryDetails,
  } = useGetCategories({ slug: categorySlug });

  // Build category tree
  const categoryTree: Category[] = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];

    // If we have a parent slug, we're showing subcategories
    if (categorySlug) {
      return categories as Category[];
    }

    // Build a map of all categories by id
    const categoryMap = new Map(
      categories.map(cat => [
        cat.id,
        { ...cat, subCategories: [] }
      ])
    );

    // Build parent-child relationships using parentId
    categories.forEach(cat => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.subCategories.push(categoryMap.get(cat.id)!);
        }
      }
    });

    // Only return root categories (those with no parentId)
    return Array.from(categoryMap.values()).filter(cat => !cat.parentId);
  }, [categories, categorySlug]);

  // Handlers
  const handleToggleExpand = useCallback((categoryId: string) => {
    setExpanded(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      return newExpanded;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collectIds = (cats: Category[]) => {
      cats.forEach(cat => {
        allIds.add(cat.id);
        if (cat.subCategories) {
          collectIds(cat.subCategories);
        }
      });
    };
    collectIds(categoryTree);
    setExpanded(allIds);
  }, [categoryTree]);

  const handleCollapseAll = useCallback(() => {
    setExpanded(new Set());
  }, []);

  const handleEdit = useCallback((categoryId: string) => {
    router.push(`/dashboard/edit-category/${categoryId}`);
  }, [router]);

  const handleView = useCallback((slug: string) => {
    router.push(`${paths.dashboard.categories.root}/${slug}`);
  }, [router]);

  const handleDelete = useCallback((categoryId: string) => {
    setDeleteId(categoryId);
    confirm.onTrue();
  }, [confirm]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      const response = await deleteCategoryById(deleteId);
      if (response.success) {
        enqueueSnackbar("Category deleted successfully", { variant: "success" });
        // Refresh the list - you might want to use SWR mutate here
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      enqueueSnackbar(
        error.message || "Failed to delete category", 
        { variant: "error" }
      );
    } finally {
      setDeleteId(null);
      confirm.onFalse();
    }
  }, [deleteId, enqueueSnackbar, confirm]);

  // Loading state
  if (categoriesLoading) {
    return (
      <Card>
        <CardHeader title="Categories" />
        <CardContent>
          <CategoryTreeSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <ErrorState
        title="Failed to load categories"
        message="There was an error loading the categories. Please try again."
        onAction={() => window.location.reload()}
      />
    );
  }

  // Empty state
  if (categoriesEmpty || categoryTree.length === 0) {
    return (
      <Card>
        <CardHeader 
          title="Categories"
          action={
            <NavigationButton
              href={paths.dashboard.categories.new}
              variant="contained"
              startIcon={<Iconify icon="tabler:plus" />}
            >
              Add Category
            </NavigationButton>
          }
        />
        <CardContent>
          <EmptyState
            icon="tabler:category"
            title="No categories found"
            message="Start by creating your first category to organize your products."
            actionLabel="Create Category"
            onAction={() => router.push(paths.dashboard.categories.new)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="tabler:category" />
              <Typography variant="h6">
                {categorySlug ? `${categoryDetails?.name} - Subcategories` : "Categories"}
              </Typography>
            </Stack>
          }
          action={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleExpandAll}
                startIcon={<Iconify icon="tabler:chevrons-down" />}
              >
                Expand All
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCollapseAll}
                startIcon={<Iconify icon="tabler:chevrons-up" />}
              >
                Collapse All
              </Button>
              <NavigationButton
                href={categorySlug 
                  ? `${paths.dashboard.categories.new}?parent=${categoryDetails?.id}`
                  : paths.dashboard.categories.new}
                variant="contained"
                startIcon={<Iconify icon="tabler:plus" />}
              >
                Add {categorySlug ? "Subcategory" : "Category"}
              </NavigationButton>
            </Stack>
          }
        />
        <CardContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="tabler:search" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Categories Tree */}
          <Box>
            {categoryTree.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                level={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                searchTerm={searchTerm}
                expanded={expanded}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirm.value}
        onClose={confirm.onFalse}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
            All products in this category will need to be reassigned.
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
