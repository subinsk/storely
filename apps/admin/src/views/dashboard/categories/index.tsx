"use client";

import {CustomBreadcrumbs} from "@storely/shared/components/custom-breadcrumbs";
import { useSettingsContext } from "@storely/shared/components/settings";
import { paths } from "@/routes/paths";
import AddCategoryForm from "@/sections/dashboard/categories/add-category-form";
import CategoriesList from "@/sections/dashboard/categories/categories-list";
import ProductsList from "@/sections/dashboard/products/list";
import {
  getCategoryBySlug,
  useGetCategories,
} from "@/services/category.service";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`item-tabpanel-${index}`}
      aria-labelledby={`item-tab-${index}`}
      {...other}
    >
      {value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `item-tab-${index}`,
    "aria-controls": `item-tabpanel-${index}`,
  };
}

export default function CategoriesView({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const settings: any = useSettingsContext();

  // states
  const [tab, setTab] = useState<number>(0);
  const [category, setCategory] = useState<any>(null);

  // functions
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const getCategory = useCallback(async () => {
    if (!categorySlug) return;

    const response = await getCategoryBySlug(categorySlug);
    setCategory(response.data);
  }, [categorySlug]);

  // effects
  useEffect(() => {
    if (categorySlug) {
      getCategory();
    }
  }, [getCategory, categorySlug]);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Categories"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Categories",
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Categories" {...a11yProps(0)} />
          <Tab
            label="Products"
            disabled={categorySlug ? false : true}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={tab} index={0}>
        <CategoriesList categorySlug={categorySlug} />
      </CustomTabPanel>

      <CustomTabPanel value={tab} index={1}>
        {category && <ProductsList categoryId={category.id} />}
      </CustomTabPanel>
    </Container>
  );
}
