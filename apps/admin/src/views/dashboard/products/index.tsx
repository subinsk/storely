"use client";

import CustomBreadcrumbs from "@/components/custom-breadcrumbs";
import { useSettingsContext } from "@/components/settings";
import { paths } from "@/routes/paths";
import { Container } from "@mui/material";
import ProductsList from "@/sections/dashboard/products/list";

export default function ProductsView() {
  const settings: any = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Products"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Products",
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductsList />
    </Container>
  );
}
