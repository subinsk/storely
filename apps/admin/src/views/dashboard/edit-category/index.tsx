"use client";

import {CustomBreadcrumbs} from "@storely/shared/components/custom-breadcrumbs";
import { useSettingsContext } from "@storely/shared/components/settings";
import { paths } from "@/routes/paths";
import AddCategoryForm from "@/sections/dashboard/categories/add-category-form";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EditCategory({ editCategoryId }: { editCategoryId: string }) {
  // hooks
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit Category"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Edit Category",
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

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
