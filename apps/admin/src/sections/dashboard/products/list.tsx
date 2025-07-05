import {Iconify} from "@storely/shared/components/iconify";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { Button, Stack } from "@mui/material";
import ProductsTable from "./products-table";
import { useGetProducts } from "@/services/product.service";

export default function ProductsList({ categoryId }: { categoryId?: string }) {
  const {
    productDetails,
    products,
    productsLoading,
    productsError,
    productsValidating,
    productsEmpty,
  } = useGetProducts();

  return (
    <Stack spacing={4}>
      <Stack width="100%" justifyContent="flex-end" alignItems="end">
        <Button
          variant="contained"
          startIcon={<Iconify icon="tabler:plus" />}
          color="primary"
          sx={{
            width: "180px",
          }}
          LinkComponent={RouterLink}
          href={categoryId 
            ? `${paths.dashboard.products.new}?category-id=${categoryId}`
            : paths.dashboard.products.new
          }
        >
          Add Product
        </Button>
      </Stack>
      <ProductsTable 
        products={products} 
        productsLoading={productsLoading} 
      />
    </Stack>
  );
}
