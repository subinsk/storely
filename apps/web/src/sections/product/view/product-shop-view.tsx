"use client";

import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import { useCallback, useState } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// hooks
import { useBoolean } from "@/hooks/use-boolean";
import { useDebounce } from "@/hooks/use-debounce";
// routes
import { paths } from "@/routes/paths";
// _mock
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from "@/_mock";
// api
// components
import EmptyContent from "@/components/empty-content";
import { useSettingsContext } from "@/components/settings";
//
import { useCheckoutContext } from "../../checkout/context";
import CartIcon from "../common/cart-icon";
import ProductList from "../product-list";
import ProductSort from "../product-sort";
import ProductSearch from "../product-search";
import ProductFilters from "../product-filters";
import ProductFiltersResult from "../product-filters-result";
import { useGetProducts, useSearchProducts } from "@/services/product.service";
import SubCategoriesList from "@/sections/category/sub-categories";

// ----------------------------------------------------------------------

const defaultFilters = {
  gender: [],
  colors: [],
  rating: "",
  category: "all",
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ProductShopView({
  categoryDetails,
  categories,
}: {
  categoryDetails?: any;
  categories?: any;
}) {
  const settings: any = useSettingsContext();

  const checkout: any = useCheckoutContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState("featured");

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery);

  const [filters, setFilters] = useState(defaultFilters);

  const { products, productsLoading, productsEmpty } = useGetProducts({
    categoryId: categoryDetails?.id
  });

  console.log(products);

  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  const handleFilters = useCallback((name: any, value: any) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const dataFiltered = applyFilter({
    inputData: products,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: any) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: any) => {
    setSearchQuery(inputValue);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
    >
      <ProductSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(id: any) => paths.product.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={PRODUCT_GENDER_OPTIONS}
          categoryOptions={["all", ...PRODUCT_CATEGORY_OPTIONS]}
        />

        <ProductSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ProductFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const renderNotFound = (
    <EmptyContent filled title="No Data" sx={{ py: 10 }} />
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : "lg"}
      sx={{
        mb: 15,
      }}
    >
      {/* <CartIcon totalItems={checkout.totalItems} /> */}

      <Stack width="100%" alignItems="center" px={3} py={4} spacing={2}>
        <Typography variant="h3" gutterBottom>
          {categoryDetails?.name}
        </Typography>
        <SubCategoriesList
          categories={categories}
          categoryDetails={categoryDetails}
        />
      </Stack>

      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Products
      </Typography>

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || productsEmpty) && renderNotFound}

      <ProductList products={dataFiltered} loading={productsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  sortBy,
}: {
  inputData: any;
  filters: any;
  sortBy: any;
}) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === "featured") {
    inputData = orderBy(inputData, ["totalSold"], ["desc"]);
  }

  if (sortBy === "newest") {
    inputData = orderBy(inputData, ["createdAt"], ["desc"]);
  }

  if (sortBy === "priceDesc") {
    inputData = orderBy(inputData, ["price"], ["desc"]);
  }

  if (sortBy === "priceAsc") {
    inputData = orderBy(inputData, ["price"], ["asc"]);
  }

  // FILTERS
  if (gender.length) {
    inputData = inputData.filter((product: any) =>
      gender.includes(product.gender)
    );
  }

  if (category !== "all") {
    inputData = inputData.filter(
      (product: any) => product.category === category
    );
  }

  if (colors.length) {
    inputData = inputData.filter((product: any) =>
      product.colors.some((color: any) => colors.includes(color))
    );
  }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter(
      (product: any) => product.price >= min && product.price <= max
    );
  }

  if (rating) {
    inputData = inputData.filter((product: any) => {
      const convertRating = (value: any) => {
        if (value === "up4Star") return 4;
        if (value === "up3Star") return 3;
        if (value === "up2Star") return 2;
        return 1;
      };
      return product.totalRatings > convertRating(rating);
    });
  }

  return inputData;
}
