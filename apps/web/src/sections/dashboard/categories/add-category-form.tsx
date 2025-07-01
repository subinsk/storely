"use client";

import FormProvider from "@/components/hook-form/form-provider";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFEditor, RHFTextField, RHFUpload } from "@/components/hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Stack, Typography } from "@mui/material";
import { addCategory } from "@/services/category.service";
import { categorySchema } from "@/schema/category";
import { useCallback, useState } from "react";
import Label from "@/components/label";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/config";
import { CLOUDINARY_API_URL } from "@/lib/cloudinary";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

export default function AddCategoryForm(): JSX.Element {
  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    setIsSubmitting(true);

    let imageUrl = "";

    if (data.image) {
      try {
        const formData = new FormData();
        const file = data.image;

        formData.append("file", file);
        formData.append("upload_preset", `${CLOUDINARY_UPLOAD_PRESET}`);
        formData.append("cloud_name", `${CLOUDINARY_CLOUD_NAME}`);

        const response = await fetch(CLOUDINARY_API_URL, {
          method: "POST",
          body: formData,
        }).then((response) => {
          return response.json();
        });

        imageUrl = response.secure_url;

        // {"asset_id":"ee14d3fc5bc185247543faedb0ff9f43","public_id":"IMG_2076_neblhq","version":1714025175,"version_id":"88e205df9fca86d4f5d9176c3daa0d15","signature":"7b9de58e132ce039c02a9a763d176d3d031483b3","width":1192,"height":1294,"format":"jpg","resource_type":"image","created_at":"2024-04-25T06:06:15Z","tags":[],"bytes":375085,"type":"upload","etag":"ee1787eeb4e81e29297b26209d7fc22d","placeholder":false,"url":"http://res.cloudinary.com/dngbmzf6x/image/upload/v1714025175/IMG_2076_neblhq.jpg","secure_url":"https://res.cloudinary.com/dngbmzf6x/image/upload/v1714025175/IMG_2076_neblhq.jpg","folder":"","access_mode":"public","existing":false,"original_filename":"IMG_2076"}
      } catch (error) {
        enqueueSnackbar("Failed to upload image", {
          variant: "error",
        });
      }
    }

    const category = {
      name: data.name,
      description: data.description,
      image: imageUrl,
    };

    try {
      const response = await addCategory(category);

      if (response.success) {
        enqueueSnackbar("Category added successfully", {
          variant: "success",
        });
      } else throw new Error(response.message);
    } catch (error) {
      console.error("error:", error);
      enqueueSnackbar("Failed to add category", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
      router.push("/dashboard/categories");
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField name="name" label="Category Name" />
        <RHFEditor name="description" placeholder="Category Description" />
        <Stack gap={2}>
          <Typography>Category Image</Typography>
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
          Add Category
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
