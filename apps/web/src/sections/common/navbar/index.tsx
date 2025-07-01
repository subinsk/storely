// "use client";

import Iconify from "@/components/iconify";
import Logo from "@/components/logo";
import useCartContext from "@/hooks/use-cart-context";
import useGetUser from "@/hooks/use-get-user";
import { AccountPopover } from "@/layouts/_common";
import { RouterLink } from "@/routes/components";
import { NextLinkComposed } from "@/routes/components/router-link";
import { paths } from "@/routes/paths";
import { useCheckoutContext } from "@/sections/checkout/context";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Stack,
  Toolbar,
} from "@mui/material";

export default function Navbar({ categories }: { categories: any[] }) {
  // hooks
  const user = useGetUser();
  const checkout: any = useCheckoutContext()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Stack width="100%" px={2} py={2}>
              <Stack direction="row" alignItems="center" width="100%">
                <Logo />
                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      LinkComponent={RouterLink}
                      href={paths.checkout}
                    >
                      <Badge badgeContent={checkout.totalItems} color="error">
                        <Iconify icon="tabler:shopping-cart" />
                      </Badge>
                    </IconButton>
                  </Stack>
                  {user ? (
                    <AccountPopover />
                  ) : (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Button
                        component={NextLinkComposed}
                        to={{ pathname: "/auth/signup" }}
                        variant="outlined"
                      >
                        Signup
                      </Button>
                      <Button
                        component={NextLinkComposed}
                        to={{ pathname: "/auth/login" }}
                        variant="contained"
                      >
                        Login
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                py={2}
              >
                {categories
                  ?.filter((item) => {
                    return item.parentId === null;
                  })
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      color="inherit"
                    >
                      {category.name}
                    </Link>
                  ))}
              </Stack>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
