"use client";

import { useSettingsContext } from "@storely/shared/components/settings";
import { paths } from "@/routes/paths";
import AddCategoryForm from "@/sections/dashboard/categories/add-category-form";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AddCategory() {
  // hooks
  const settings: any = useSettingsContext();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent");

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <AddCategoryForm parentId={parentId || undefined} />
    </Container>
  );
}

export default function AddCategoryView() {
  return (
    <Suspense>
      <AddCategory />
    </Suspense>
  );
}
