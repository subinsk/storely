"use client";

import { useSettingsContext } from "@storely/shared/components/settings";
import { Container } from "@mui/material";
import ProductsList from "@/sections/dashboard/products/list";

export default function ProductsView() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <ProductsList />
    </Container>
  );
}
