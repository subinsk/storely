"use client";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import { useSettingsContext } from "@/components/settings";
import { paths } from "@/routes/paths";
import AddProductForm from "@/sections/dashboard/products/add-product-form";
import { getProductById } from "@/services/product.service";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function EditProduct({ editProductId }: { editProductId: string }) {
  const settings: any = useSettingsContext();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category-id");
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  // functions
  const getProduct = useCallback(async () => {
    if (!editProductId) return;

    try {
      const response = await getProductById(editProductId);
      setCurrentProduct(response.data);
    } catch (err: any) {
      console.error(err);
    }
  }, [editProductId]);

  // effects
  useEffect(() => {
    getProduct();
  }, [getProduct]);

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
      <AddProductForm currentProduct={currentProduct} categoryId={categoryId} />
    </Container>
  );
}

export default function EditProductView({
  editProductId,
}: {
  editProductId: string;
}) {
  return (
    <Suspense>
      <EditProduct editProductId={editProductId} />
    </Suspense>
  );
}
