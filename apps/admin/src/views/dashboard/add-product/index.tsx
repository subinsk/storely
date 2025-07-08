"use client";

import { useSettingsContext } from "@storely/shared/components/settings";
import { paths } from "@/routes/paths";
import AddProductForm from "@/sections/dashboard/products/add-product-form";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AddProduct() {
  const settings: any = useSettingsContext();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || searchParams.get("category-id");

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <AddProductForm categoryId={categoryId || undefined} />
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
