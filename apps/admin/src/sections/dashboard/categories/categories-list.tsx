import {Iconify} from "@storely/shared/components/iconify";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { useGetCategories } from "@/services/category.service";
import { Button, Checkbox, Stack } from "@mui/material";
import CategoriesTable from "./categories-table";

export default function CategoriesList({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const {
    categoryDetails,
    categories,
    categoriesLoading,
    categoriesError,
    categoriesValidating,
    categoriesEmpty,
  } = useGetCategories({
    slug: categorySlug,
  });

  console.log('categories: ', categories);

  const id = categoryDetails?.id;

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
          href={
            id
              ? `${paths.dashboard.categories.new}?parent=${id}`
              : paths.dashboard.categories.new
          }
        >
          Add Category
        </Button>
      </Stack>
      <CategoriesTable
        categories={categories}
        categoriesLoading={categoriesLoading}
      />
    </Stack>
  );
}
