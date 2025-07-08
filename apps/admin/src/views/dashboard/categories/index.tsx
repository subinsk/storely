"use client";

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
import { useRouter, useSearchParams } from "next/navigation";

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

const TAB_QUERY_KEY = "tab";
const TAB_CATEGORIES = "categories";
const TAB_PRODUCTS = "products";

export default function CategoriesView({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const settings: any = useSettingsContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine initial tab from URL
  const tabParam = searchParams.get(TAB_QUERY_KEY);
  const initialTab = tabParam === TAB_PRODUCTS ? 1 : 0;

  // states
  const [tab, setTab] = useState<number>(initialTab);
  const [category, setCategory] = useState<any>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Only update tab if URL param changes and is different from state
  useEffect(() => {
    if (tabParam === TAB_PRODUCTS && tab !== 1) setTab(1);
    else if (tabParam !== TAB_PRODUCTS && tab !== 0) setTab(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  // Fetch category only when categorySlug changes
  useEffect(() => {
    let ignore = false;
    const fetchCategory = async () => {
      if (!categorySlug) {
        setCategory(null);
        return;
      }
      setCategoryLoading(true);
      try {
        const response = await getCategoryBySlug(categorySlug);
        if (!ignore) setCategory(response.data);
      } catch (e) {
        if (!ignore) setCategory(null);
      } finally {
        if (!ignore) setCategoryLoading(false);
      }
    };
    fetchCategory();
    return () => { ignore = true; };
  }, [categorySlug]);

  // Memoize tab labels to avoid flicker
  const categoriesTabLabel = categorySlug
    ? categoryLoading
      ? "Loading..."
      : category
        ? `${category.name} - Subcategories`
        : "Categories"
    : "Categories";
  const productsTabLabel = categorySlug
    ? categoryLoading
      ? "Loading..."
      : category
        ? `${category.name} - Products`
        : "Products"
    : "Products";

  // functions
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (newValue === 1) {
      params.set(TAB_QUERY_KEY, TAB_PRODUCTS);
    } else {
      params.set(TAB_QUERY_KEY, TAB_CATEGORIES);
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label={categoriesTabLabel} {...a11yProps(0)} />
          <Tab
            label={productsTabLabel}
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
