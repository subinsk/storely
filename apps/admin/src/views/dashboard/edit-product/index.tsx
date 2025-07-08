"use client";

import { useSettingsContext } from "@storely/shared/components/settings";
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
      <AddProductForm currentProduct={currentProduct} categoryId={categoryId || ''} />
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
