import useCartContext from "@/hooks/use-cart-context";
import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function PriceDetails() {
  const {
    cart,
  }: {
    cart: any;
  } = useCartContext();
  const cartLength = cart.length;

  // calculate total price
  const totalPrice = cart.reduce((acc: any, item: any) => {
    return acc + item.price * item.quantity;
  }, 0);

  // calculate total MRP
  const totalMRP = cart.reduce((acc: any, item: any) => {
    return acc + item.mrp * item.quantity;
  }, 0);

  // calculate total discount
  const totalDiscount = totalMRP - totalPrice;

  // calculate total coupon discount
  const totalCouponDiscount = 0;

  // calculate total payable amount
  const totalPayable = totalMRP - totalDiscount - totalCouponDiscount;

  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="h6">
            Price Detail ({cartLength} items)
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            px={0.5}
            py={0.1}
          >
            <Typography variant="body1">MRP</Typography>
            <Typography variant="body1" fontWeight={600}>
              Rs {totalMRP}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            px={0.5}
            py={0.1}
          >
            <Typography variant="body1">Discount</Typography>
            <Typography variant="body1" color="primary.main" fontWeight={600}>
              - Rs {totalDiscount}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            px={0.5}
            py={0.1}
          >
            <Typography variant="body1">Coupon</Typography>
            <Typography variant="body1" color="primary.main" fontWeight={600}>
              - Rs {totalDiscount}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            px={0.5}
            py={0.1}
          >
            <Typography variant="h5">Total Payable</Typography>
            <Typography variant="h5">Rs {totalPayable}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
