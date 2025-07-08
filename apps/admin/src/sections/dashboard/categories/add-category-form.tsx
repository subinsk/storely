"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Collapse from "@mui/material/Collapse";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

import { Iconify } from "@storely/shared/components/iconify";
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload,
} from "@storely/shared/components/hook-form";
import { categorySchema } from "@storely/shared/schemas/category";
import { imagekit } from "@storely/shared/lib";
import { slugify } from "@storely/shared/utils/slugify";

import {
  addCategory,
  getCategoryById,
  updateCategory,
  useGetCategories,
} from "@/services/category.service";
import { FormSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/state-components";

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  image?: File | string | null;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface AddCategoryFormProps {
  categoryId?: string;
  parentId?: string;
  editCategoryId?: string;
}

// Helper to build tree from flat list
function buildCategoryTree(categories: any[], excludeId?: string) {
  const map = new Map();
  categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
  categories.forEach((cat) => {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId).children.push(map.get(cat.id));
    }
  });
  // Only root categories
  return (
    Array.from(map.values()).filter(
      (cat) => !cat.parentId && cat.id !== excludeId
    ) || []
  );
}

function flattenTree(tree: any[], level = 0, arr: any[] = []) {
  tree.forEach((node) => {
    arr.push({ ...node, level });
    if (node.children && node.children.length > 0) {
      flattenTree(node.children, level + 1, arr);
    }
  });
  return arr;
}

function ParentCategorySelect({
  name,
  label,
  categories,
  excludeId,
  control,
  ...props
}: any) {
  const tree = buildCategoryTree(categories, excludeId);
  const flat = flattenTree(tree);
  type OptionType = { label: string; id: string; level?: number };
  const options: OptionType[] = [
    { label: "No Parent (Root Category)", id: "", level: 0 },
    ...flat.map((cat) => ({
      label: cat.name,
      id: cat.id,
      level: cat.level,
    })),
  ];
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }: { field: any }) => {
        const selectedOption = options.find(opt => opt.id === field.value) || options[0];
        return (
          <Autocomplete<OptionType, false, false, false>
            options={options}
            getOptionLabel={(option: OptionType) => option.label}
            isOptionEqualToValue={(opt: OptionType, val: OptionType | string) => {
              if (!opt || !val) return false;
              if (typeof val === 'string') return opt.id === val;
              return opt.id === val.id;
            }}
            value={selectedOption}
            onChange={(_: any, val: OptionType | null) => field.onChange(val ? val.id : "")}
            renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: OptionType) => (
              <li {...props} key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
                {option.id === '' ? null : (
                  <span style={{ marginLeft: option.level ? option.level * 16 : 0, marginRight: 8, color: '#aaa' }}>
                    <SubdirectoryArrowRightIcon fontSize="small" style={{ verticalAlign: 'middle' }} />
                  </span>
                )}
                {option.label}
              </li>
            )}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label={label}
                placeholder="Select parent category (optional)"
                helperText="Choose a parent category"
              />
            )}
            getOptionDisabled={(option: OptionType) => option.id === excludeId}
            {...props}
          />
        );
      }}
    />
  );
}

export default function AddCategoryForm({
  categoryId,
  parentId,
  editCategoryId,
}: AddCategoryFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!editCategoryId;

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null);

  // Get all categories for parent selection
  const {
    categories: allCategories,
    categoriesLoading: categoriesLoading,
    categoriesError,
  } = useGetCategories();

  const methods = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      parentId: parentId || "",
      image: null,
      isActive: true,
      sortOrder: 0,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const watchName = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchName && !isEdit) {
      setValue("slug", slugify(watchName));
    }
  }, [watchName, setValue, isEdit]);

  // Fetch category data for editing
  const fetchCategoryData = useCallback(async () => {
    if (!editCategoryId || !isEdit) return;

    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await getCategoryById(editCategoryId);

      if (response.success) {
        const category = response.data;
        reset({
          name: category.name,
          description: category.description || "",
          slug: category.slug,
          parentId: category.parentId || "",
          image: category.image || null,
          isActive: category.isActive ?? true,
          sortOrder: category.sortOrder || 0,
          metaTitle: category.metaTitle || "",
          metaDescription: category.metaDescription || "",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      setFetchError(error.message || "Failed to fetch category data");
    } finally {
      setIsLoading(false);
    }
  }, [editCategoryId, isEdit, reset]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  // Handle image upload
  const handleImageDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setValue("image", fileWithPreview, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleImageRemove = useCallback(() => {
    setValue("image", null);
  }, [setValue]);

  // Handle image url attach
  const handleAttachImageUrl = useCallback(() => {
    if (imageUrlInput && /^https?:\/\//.test(imageUrlInput)) {
      setValue('image', imageUrlInput, { shouldValidate: true });
      setImageUrlPreview(imageUrlInput);
    }
  }, [imageUrlInput, setValue]);

  // If editing and image is a string (url), prefill url input and preview
  useEffect(() => {
    if (isEdit) {
      const img = methods.getValues('image');
      if (typeof img === 'string') {
        setImageInputMode('url');
        setImageUrlInput(img);
        setImageUrlPreview(img);
      } else {
        setImageUrlInput('');
        setImageUrlPreview(null);
      }
    }
  }, [isEdit, methods]);

  // Form submission
  const onSubmit = handleSubmit(async (data: CategoryFormData) => {
    try {
      let imageUrl = "";

      // Upload image if provided
      if (data.image && data.image instanceof File) {
        try {
          setUploadProgress(0);
          const response = await imagekit.upload({
            file: data.image as any,
            fileName: slugify(data.name),
            folder: "/storely/categories",
          });
          imageUrl = response.url;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          enqueueSnackbar("Failed to upload image", { variant: "error" });
          return;
        }
      } else if (typeof data.image === "string") {
        imageUrl = data.image;
      }

      const categoryData = {
        name: data.name,
        description: data.description,
        slug: data.slug,
        parentId: data.parentId || null,
        image: imageUrl,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      };

      let response;
      if (isEdit && editCategoryId) {
        response = await updateCategory({
          id: editCategoryId,
          ...categoryData,
        });
      } else {
        response = await addCategory(categoryData);
      }

      if (response.success) {
        enqueueSnackbar(
          isEdit ? "Category updated successfully" : "Category created successfully",
          { variant: "success" }
        );
        router.back();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      enqueueSnackbar(
        error.message || `Failed to ${isEdit ? "update" : "create"} category`,
        { variant: "error" }
      );
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="tabler:category" />
              <Typography variant="h6">
                {isEdit ? "Edit Category" : "Create Category"}
              </Typography>
            </Stack>
          }
        />
        <CardContent>
          <FormSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <ErrorState
        title="Failed to load category"
        message={fetchError}
        onAction={() => fetchCategoryData()}
      />
    );
  }

  // Get parent category options
  const parentCategoryOptions = allCategories
    ?.filter((cat: any) => cat.id !== editCategoryId) // Exclude current category
    ?.map((cat: any) => ({
      label: cat.name,
      value: cat.id,
    })) || [];

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Main Form */}
        <Grid item xs={12} md={8} sx={{ ml: -3 }}>
          <Card>
            <CardHeader
              title={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="tabler:category" />
                  <Typography variant="h6">
                    {isEdit ? "Edit Category" : "Create Category"}
                  </Typography>
                </Stack>
              }
              action={
                <IconButton onClick={() => router.back()}>
                  <Iconify icon="tabler:x" />
                </IconButton>
              }
            />
            <CardContent>
              <Stack spacing={3}>
                {/* Basic Information */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Basic Information
                  </Typography>
                  <Stack spacing={2}>
                    <RHFTextField
                      name="name"
                      label="Category Name"
                      placeholder="Enter category name"
                      required
                    />
                    <RHFTextField
                      name="slug"
                      label="URL Slug"
                      placeholder="category-url-slug"
                      helperText="This will be used in the category URL"
                    />
                    <ParentCategorySelect
                      name="parentId"
                      label="Parent Category"
                      categories={allCategories}
                      excludeId={editCategoryId}
                      control={methods.control}
                    />
                  </Stack>
                </Box>

                <Divider />

                {/* Description */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <RHFEditor
                    name="description"
                    placeholder="Enter category description..."
                  />
                </Box>

                <Divider />

                {/* SEO Settings */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    SEO Settings
                  </Typography>
                  <Stack spacing={2}>
                    <RHFTextField
                      name="metaTitle"
                      label="Meta Title"
                      placeholder="SEO title for search engines"
                      helperText="Recommended: 50-60 characters"
                    />
                    <RHFTextField
                      name="metaDescription"
                      label="Meta Description"
                      placeholder="SEO description for search engines"
                      multiline
                      rows={3}
                      helperText="Recommended: 150-160 characters"
                    />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Settings */}
            <Card>
              <CardHeader title="Settings" />
              <CardContent>
                <Stack spacing={2}>
                  <RHFSwitch
                    name="isActive"
                    label="Active"
                    helperText="Category will be visible on the website"
                  />
                  <RHFTextField
                    name="sortOrder"
                    label="Sort Order"
                    type="number"
                    placeholder="0"
                    helperText="Lower numbers appear first"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Image Upload/URL */}
            <Card>
              <CardHeader title="Category Image" />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    select
                    label="Image Input Mode"
                    value={imageInputMode}
                    onChange={e => {
                      setImageInputMode(e.target.value as 'upload' | 'url');
                      setValue('image', null);
                      setImageUrlInput('');
                      setImageUrlPreview(null);
                    }}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="upload">Upload Image</MenuItem>
                    <MenuItem value="url">Image URL</MenuItem>
                  </TextField>
                </Box>
                {imageInputMode === 'upload' ? (
                  <RHFUpload
                    name="image"
                    multiple={false}
                    maxSize={3145728} // 3MB
                    onDrop={handleImageDrop}
                    onDelete={handleImageRemove}
                    helperText="Upload category image (Max 3MB)"
                  />
                ) : (
                  <>
                    <TextField
                      label="Image URL"
                      value={imageUrlInput}
                      onChange={e => setImageUrlInput(e.target.value)}
                      fullWidth
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAttachImageUrl}
                              disabled={!/^https?:\/\//.test(imageUrlInput)}
                            >
                              Attach
                            </Button>
                          </InputAdornment>
                        )
                      }}
                      placeholder="Paste image URL (https://...)"
                    />
                    {imageUrlPreview && (
                      <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
                        <img
                          src={imageUrlPreview}
                          alt="Category Preview"
                          style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, border: '1px solid #eee' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => {
                            setValue('image', null);
                            setImageUrlInput('');
                            setImageUrlPreview(null);
                          }}
                          sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', boxShadow: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Uploading: {uploadProgress}%
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Parent Category Info */}
            {parentId && (
              <Card>
                <CardHeader title="Parent Category" />
                <CardContent>
                  <Chip
                    label={
                      allCategories?.find((cat: any) => cat.id === parentId)?.name ||
                      "Loading..."
                    }
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <Card>
              <CardContent>
                <Stack spacing={2} pt={3}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    fullWidth
                    size="large"
                    startIcon={<Iconify icon="tabler:check" />}
                  >
                    {isEdit ? "Update Category" : "Create Category"}
                  </LoadingButton>
                  <LoadingButton
                    variant="outlined"
                    onClick={() => router.back()}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Cancel
                  </LoadingButton>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Form Errors */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Please fix the following errors:
          </Typography>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error?.message}</li>
            ))}
          </ul>
        </Alert>
      )}
    </FormProvider>
  );
}
