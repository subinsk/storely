"use client";

import {CustomBreadcrumbs} from "@storely/shared/components/custom-breadcrumbs";
import { useSettingsContext } from "@storely/shared/components/settings";
import { paths } from "@/routes/paths";
import AddProductForm from "@/sections/dashboard/products/add-product-form";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AddProduct() {
  const settings: any = useSettingsContext();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category-id");

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Products",
            href: paths.dashboard.products.root,
          },
          { name: "New product" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <AddProductForm categoryId={categoryId as string} />
    </Container>
  );
}

export default function AddProductView() {
  return (
    <Suspense>
      <AddProduct />
    </Suspense>
  );
}
