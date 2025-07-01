"use client";

import useCartContext from "@/hooks/use-cart-context";
import Coupons from "@/sections/cart/coupons";
import EmptyCart from "@/sections/cart/empty-cart";
import PriceDetails from "@/sections/cart/price-details";
import ProductsList from "@/sections/cart/products-list";
import { Button, Container, Grid, Stack } from "@mui/material";

export default function CartView() {
  const { cart } = useCartContext();
  const cartLength = cart.length;

  const coupons = [
    {
      id: "1",
      code: "SUMMER24",
      name: "Summer Sale",
    },
  ];

  return (
    <Container
      sx={{
        minHeight: "calc(100vh - 128px)",
      }}
      maxWidth="xl"
    >
      {cartLength > 0 ? (
        <Grid container spacing={3} px={3} py={2} bgcolor="grey.200">
          <Grid item xs={8}>
            <ProductsList />
          </Grid>
          <Grid item xs={4} position="sticky" top={0}>
            <Stack spacing={4}>
              <Coupons coupons={coupons} />
              <PriceDetails />
              <Button variant="contained" fullWidth size="large">
                Place order
              </Button>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <EmptyCart />
      )}
    </Container>
  );
}
