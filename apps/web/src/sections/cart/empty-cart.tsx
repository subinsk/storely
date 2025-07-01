"use client";

import Image from "@/components/image";
import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { Button, Container, Stack, Typography } from "@mui/material";

export default function EmptyCart() {
  return (
    <Container>
      <Stack
        alignItems="center"
        justifyContent="center"
        py={3}
      >
        <Stack spacing={2} alignItems="center">
          <Image
            src="/assets/illustrations/cart/empty-cart.svg"
            alt="empty-cart"
          />
          <Typography variant="h5">Your Shopping Cart Is Empty!</Typography>
          <Button
            LinkComponent={RouterLink}
            href={paths.home.root}
            variant="contained"
          >
            Continue Shopping
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
