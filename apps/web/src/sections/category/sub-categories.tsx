import { Stack, Typography, Paper } from "@mui/material";
import Image from "@/components/image";
import { RouterLink } from "@/routes/components";
import { usePathname } from "next/navigation";
import { NextLinkComposed } from "@/routes/components/router-link";

export default function SubCategoriesList({
  categoryDetails,
  categories,
}: {
  categoryDetails?: any;
  categories?: any;
}) {
  // hooks
  const pathname = usePathname()

  return (
    <Stack>
      {categories?.map((category: any) => (
        <Paper
          key={category.id}
          elevation={3}
          square={false}
          component={NextLinkComposed}
          to={{ pathname: `/category/${category.slug}` }}
          sx={{
            width: 200,
            height: 200,
            cursor: "pointer",
            textDecoration:"none"
          }}
        >
          <Stack height="100%">
          <Image
            src={category?.image}
            sx={{
              height: "80%",
              width: 200,
            }}
            alt="category-image"
            objectFit="contain"
          />
          <Stack alignItems="center" justifyContent="center" height="20%">
            <Typography variant="body1">{category.name}</Typography>
          </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
