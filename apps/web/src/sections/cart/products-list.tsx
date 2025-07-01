import Image from "@/components/image";
import useCartContext from "@/hooks/use-cart-context";
import {
  alpha,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment } from "react";

function ProductItem({
  id,
  image,
  name,
  quantity,
  mrp,
  price,
}: {
  id: string;
  image: string;
  name: string;
  quantity: number;
  mrp: number;
  price: number;
}) {
  const { updateCartItem, removeFromCart } = useCartContext();

  return (
    <Stack padding={2} direction="row" alignItems="center" spacing={2}>
      <Image
        src="/assets/background/overlay_3.jpg"
        alt={name}
        sx={{
          width: "100px",
          height: "100px",
        }}
      />
      <Stack spacing={1}>
        <Stack spacing={0.5}>
          <Typography variant="body1" fontWeight={600}>
            {name}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={4}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body1">Quantity: </Typography>
            <Stack direction="row" alignItems="center" spacing={0.2}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  updateCartItem({
                    id,
                    quantity: quantity - 1,
                  });
                }}
              >
                -
              </Button>
              <Stack
                alignItems="center"
                justifyContent="center"
                borderColor={(theme) => alpha(theme.palette.grey[500], 0.32)}
                borderRadius={6}
                px={1}
                py={0.5}
              >
                <Typography variant="body1">{quantity}</Typography>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  updateCartItem({
                    id,
                    quantity: quantity + 1,
                  });
                }}
              >
                +
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="subtitle1">Rs {price}</Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                textDecoration: "line-through",
              }}
            >
              Rs {mrp}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function ProductsList() {
  const {
    cart,
  }: {
    cart: any;
  } = useCartContext();
  const cartLength = cart.length;

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          paddingX={2}
        >
          <Typography variant="h6">My Cart ({cartLength})</Typography>
          <Divider />
        </Stack>
        {cart.map((item: any) => (
          <Fragment key={item.id}>
            <ProductItem {...item} />
            {cart[cart.length - 1].id !== item.id && <Divider />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
