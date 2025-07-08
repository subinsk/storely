"use client";

import { useSettingsContext } from "@storely/shared/components/settings";
import AddCategoryForm from "@/sections/dashboard/categories/add-category-form";
import { Container } from "@mui/material";
import { Suspense } from "react";

function EditCategory({ editCategoryId }: { editCategoryId: string }) {
  // hooks
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <AddCategoryForm editCategoryId={editCategoryId} />
    </Container>
  );
}

export default function EditCategoryView({
  editCategoryId,
}: {
  editCategoryId: string;
}) {
  return (
    <Suspense>
      <EditCategory editCategoryId={editCategoryId} />
    </Suspense>
  );
}
