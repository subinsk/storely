"use client";

import FormProvider from "@/components/hook-form/form-provider";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFEditor, RHFTextField, RHFUpload } from "@/components/hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Stack, TextField, Typography } from "@mui/material";
import {
  addCategory,
  getCategoryById,
  updateCategory,
} from "@/services/category.service";
import { categorySchema } from "@/schema/category";
import { useCallback, useEffect, useState } from "react";
import Label from "@/components/label";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/config";
import { CLOUDINARY_API_URL } from "@/lib/cloudinary";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { imagekit } from "@/lib";
import { slugify } from "@/utils/slugify";

export default function AddCategoryForm({
  parentId,
  editCategoryId,
}: {
  parentId?: string | null;
  editCategoryId?: string | null;
}): JSX.Element {
  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [parentCategory, setParentCategory] = useState<string>("N/A");
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  // hooks
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    resolver: zodResolver(categorySchema),
  });

  const { setValue, handleSubmit } = methods;

  // functions
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("image", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue("image", null);
  }, [setValue]);

  const getCategory = useCallback(async () => {
    if (editCategoryId) {
      try {
        setIsCategoryLoading(true);
        const response = await getCategoryById(editCategoryId);

        setValue("name", response.data.name);
        setValue("description", response.data.description);
        setValue("image", response.data.image);
        setParentCategory(response.data.parent.name);
      } catch (error: any) {
        console.error("error:", error);
        enqueueSnackbar("Failed to fetch category", {
          variant: "error",
        });
      } finally {
        setIsCategoryLoading(false);
      }
    }
  }, [editCategoryId, setValue, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    setIsSubmitting(true);

    let imageUrl = "";

    if (data.image) {
      try {
        const response = await imagekit.upload({
          file: data.image,
          fileName: slugify(data.name),
          folder: "/furnerio/categories",
        });

        imageUrl = response.url;
      } catch (error) {
        enqueueSnackbar("Failed to upload image", {
          variant: "error",
        });
      }
    }

    const category = {
      name: data.name,
      description: data.description,
      parent: parentId,
      image: imageUrl,
    };

    try {
      if (editCategoryId) {
        const response = await updateCategory({
          id: editCategoryId,
          ...category,
        });

        if (response.success) {
          enqueueSnackbar("Category updated successfully", {
            variant: "success",
          });
        } else throw new Error(response.message);
      } else {
        const response = await addCategory(category);

        if (response.success) {
          enqueueSnackbar("Category added successfully", {
            variant: "success",
          });
        } else throw new Error(response.message);
      }
    } catch (error) {
      console.error("error:", error);
      enqueueSnackbar("Failed to add category", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
      if (!editCategoryId) {
        router.back();
      }
    }
  });

  const getParentCategory = useCallback(async () => {
    if (!parentId) return;

    try {
      const response = await getCategoryById(parentId);
      setParentCategory(response.data.name);
    } catch (error) {
      console.error("error:", error);
    }
  }, [parentId]);

  // effects
  useEffect(() => {
    getParentCategory();
  }, [getParentCategory]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField name="name" placeholder="Category Name" />
        <RHFEditor name="description" placeholder="Category Description" />
        <TextField value={parentCategory} disabled />
        <Stack gap={2}>
          <Typography variant="h6">Category Image</Typography>
          <RHFUpload
            name="image"
            multiple={false}
            maxSize={3145728}
            onDrop={handleDrop}
            onDelete={handleRemoveFile}
            onUpload={() => console.info("ON UPLOAD")}
          />
        </Stack>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {editCategoryId ? "Edit Category" : "Add Category"}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
