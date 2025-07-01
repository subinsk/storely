"use client";

import * as Yup from "yup";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "@/routes/paths";
// hooks
import { useResponsive } from "@/hooks/use-responsive";
// _mock
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from "@/_mock";
// components
import { useSnackbar } from "@/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from "@/components/hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@mui/material";
import { getCategoryById } from "@/services/category.service";
import { createProduct, updateProduct } from "@/services/product.service";
import { imagekit } from "@/lib";
import { slugify } from "@/utils/slugify";

export default function AddProductForm({
  currentProduct,
  categoryId,
}: {
  currentProduct?: any;
  categoryId?: string | null;
}) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);
  const [category, setCategory] = useState<any | string>("");

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    sku: Yup.string().required("SKU is required"),
    code: Yup.string(),
    subDescription: Yup.string(),
    content: Yup.string(),
    // images: Yup.array().min(1, "Images is required"),
    images: Yup.array(),
    quantity: Yup.number().moreThan(0, "Quantity should not be 0"),
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    price: Yup.number().moreThan(0, "Price should not be Rs. 0.00"),
    mrp: Yup.number().moreThan(0, "MRP should not be Rs. 0.00"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      subDescription: currentProduct?.subDescription || "",
      content: currentProduct?.content || "",
      images: currentProduct?.images || [],
      //
      code: currentProduct?.code || "",
      sku: currentProduct?.sku || "",
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      mrp: currentProduct?.mrp || 0,
      newLabel: currentProduct?.newLabel || { enabled: false, content: "" },
      saleLabel: currentProduct?.saleLabel || { enabled: false, content: "" },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema as any),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const getParentCategory = useCallback(async () => {
    if (!categoryId) return;

    try {
      const response = await getCategoryById(categoryId);
      setCategory(response.data.name);
    } catch (error) {
      console.error("error:", error);
    }
  }, [categoryId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.info("DATA: ", data);
      let response = null;
      const imageUrls: string[] = [];

      if (data.images.length > 0) {
        try {
          let uploadPromises = data.images.map((image: any, index: number) => {
            return imagekit.upload({
              file: image,
              fileName: slugify(data.name + "-" + index),
              folder: "/furnerio/products" + slugify(data.name),
            });
          });

          let responses = await Promise.all(uploadPromises);

          responses.forEach((response) => {
            imageUrls.push(response.url);
          });
        } catch (error) {
          enqueueSnackbar("Failed to upload image", {
            variant: "error",
          });
        }
      }

      if (!currentProduct) {
        response = await createProduct({
          ...data,
          images: imageUrls,
          categoryId,
          newLabel: data.newLabel.content,
          saleLabel: data.saleLabel.content,
        });
      } else {
        response = await updateProduct({
          ...data,
          id: currentProduct?.id,
          images: imageUrls,
          categoryId,
          newLabel: data.newLabel.content,
          saleLabel: data.saleLabel.content,
        });
      }

      if (response?.success) {
        router.back();
        enqueueSnackbar(currentProduct ? "Update success!" : "Create success!");
      } else throw new Error("Failed to create product");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Something went wrong");
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue("images", [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File) => {
      const filtered =
        values.images &&
        values.images?.filter((file: File) => file !== inputFile);
      setValue("images", filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue("images", []);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Product Name" />

            <RHFTextField
              name="subDescription"
              label="Sub Description"
              multiline
              rows={4}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="content" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <TextField value={category} disabled />
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="mrp"
              label="MRP"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      ₹
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="price"
              label="Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      ₹
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentProduct ? "Create Product" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

  useEffect(() => {
    getParentCategory();
  }, [getParentCategory]);
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
