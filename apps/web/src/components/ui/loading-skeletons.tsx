"use client";

import { Box, Card, CardContent, Skeleton, Stack, Grid } from "@mui/material";

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Stack spacing={1}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={28} />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="rectangular" width={40} height={36} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

// Category card skeleton
export function CategoryCardSkeleton() {
  return (
    <Card sx={{ height: 200 }}>
      <Skeleton variant="rectangular" height={120} />
      <CardContent>
        <Stack spacing={1}>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="50%" height={20} />
        </Stack>
      </CardContent>
    </Card>
  );
}

// Category grid skeleton
export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CategoryCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

// Product detail skeleton
export function ProductDetailSkeleton() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={400} />
          <Stack direction="row" spacing={1}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width={80} height={80} />
            ))}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={3}>
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="60%" height={24} />
          <Stack spacing={1}>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="70%" height={20} />
          </Stack>
          <Skeleton variant="text" width="40%" height={32} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={150} height={48} />
            <Skeleton variant="rectangular" width={48} height={48} />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

// Search results skeleton
export function SearchResultsSkeleton() {
  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width="200px" height={32} />
        <Skeleton variant="text" width="150px" height={24} />
      </Box>
      <ProductGridSkeleton count={8} />
    </Stack>
  );
}

// Cart item skeleton
export function CartItemSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Skeleton variant="rectangular" width={80} height={80} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
          <Stack spacing={1} alignItems="center">
            <Skeleton variant="rectangular" width={100} height={36} />
            <Skeleton variant="text" width="60px" height={24} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Generic list skeleton
export function ListSkeleton({ count = 5, height = 60 }: { count?: number; height?: number }) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={height} />
      ))}
    </Stack>
  );
}
